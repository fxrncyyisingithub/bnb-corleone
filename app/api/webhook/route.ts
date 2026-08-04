import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { refundCheckoutSession, stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendGuestConfirmation, sendStaffNotification } from "@/lib/email"
import { formatDate } from "@/lib/format"
import { findOverlappingReservations } from "@/lib/reservations"
import { jsonError } from "@/lib/api-response"

export const maxDuration = 30

// PostgreSQL error codes surfaced by PostgREST
const UNIQUE_VIOLATION = "23505"
const EXCLUSION_VIOLATION = "23P01"

/** Refund that fails loudly: the caller must retry when nothing could be refunded. */
async function refundSession(session: Stripe.Checkout.Session): Promise<void> {
  const refunded = await refundCheckoutSession(session)

  if (!refunded) {
    throw new Error(`No payment intent on session ${session.id}: cannot refund automatically`)
  }
}

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return jsonError("Missing stripe-signature header", 400)
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return jsonError("Webhook not configured", 500)
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook signature verification failed:", message)
    return jsonError(`Webhook Error: ${message}`, 400)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (!metadata?.roomId || !metadata.checkIn || !metadata.checkOut || !metadata.guests || !metadata.totalPrice) {
      console.error("Webhook missing required metadata:", session.id)
      return jsonError("Invalid session metadata", 400)
    }

    const guests = Number.parseInt(metadata.guests, 10)
    const totalPrice = Number.parseFloat(metadata.totalPrice)

    if (!Number.isFinite(guests) || !Number.isFinite(totalPrice)) {
      console.error("Webhook has non-numeric metadata:", session.id, {
        guests: metadata.guests,
        totalPrice: metadata.totalPrice,
      })
      return jsonError("Invalid session metadata", 400)
    }

    const supabase = createAdminClient()

    const { data: existing, error: existingError } = await supabase
      .from("reservations")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle()

    // Without a working dedup lookup we cannot tell a replay from a new booking:
    // fail so Stripe retries instead of risking a duplicate insert.
    if (existingError) {
      console.error("Failed to look up existing reservation:", session.id, existingError)
      return jsonError("Database Error", 500)
    }

    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const { data: conflicts, error: conflictError } = await findOverlappingReservations(supabase, {
      roomId: metadata.roomId,
      checkIn: metadata.checkIn,
      checkOut: metadata.checkOut,
    })

    if (conflictError) {
      console.error("Failed to check overlapping reservations:", session.id, conflictError)
      return jsonError("Database Error", 500)
    }

    if (conflicts && conflicts.length > 0) {
      console.error("Overlapping reservation detected, refunding:", session.id)
      try {
        await refundSession(session)
      } catch (err) {
        // Guest paid for dates we cannot honour and the refund failed: return 5xx so
        // Stripe retries the event and the refund is attempted again.
        console.error("CRITICAL: refund failed for overlapping reservation:", session.id, err)
        return jsonError("Refund failed", 500, { sessionId: session.id })
      }
      return jsonError("Date non più disponibili, rimborso effettuato.", 409)
    }

    const { error } = await supabase.from("reservations").insert({
      room_id: metadata.roomId,
      check_in: metadata.checkIn,
      check_out: metadata.checkOut,
      guests,
      total_price: totalPrice,
      status: "paid",
      guest_name: metadata.name ?? "",
      guest_email: metadata.email ?? session.customer_email ?? "",
      stripe_session_id: session.id,
    })

    if (error) {
      // A concurrent delivery of the same event already inserted this reservation.
      if (error.code === UNIQUE_VIOLATION) {
        console.warn("Reservation already inserted concurrently:", session.id)
        return NextResponse.json({ received: true, duplicate: true })
      }

      // The exclusion constraint is the last line of defence against double booking:
      // the dates were taken between the check above and the insert.
      if (error.code === EXCLUSION_VIOLATION) {
        console.error("Exclusion constraint rejected reservation, refunding:", session.id, error)
        try {
          await refundSession(session)
        } catch (refundError) {
          console.error("CRITICAL: refund failed after exclusion violation:", session.id, refundError)
          return jsonError("Refund failed", 500, { sessionId: session.id })
        }
        return jsonError("Date non più disponibili, rimborso effettuato.", 409)
      }

      console.error("Failed to insert reservation:", error)
      return jsonError("Database Error", 500)
    }

    const guestEmail = metadata.email ?? session.customer_email ?? ""

    if (!guestEmail) {
      console.error("Reservation has no guest email, confirmation not sent:", session.id)
    }

    // The reservation is already persisted, so email failures must not fail the webhook
    // (Stripe would retry and hit the dedup path) — but they must be visible in the logs.
    const emailResults = await Promise.allSettled([
      guestEmail
        ? sendGuestConfirmation({
            name: metadata.name ?? "",
            email: guestEmail,
            roomName: metadata.roomName ?? "",
            checkIn: formatDate(metadata.checkIn),
            checkOut: formatDate(metadata.checkOut),
            total: metadata.totalPrice,
            sessionId: session.id,
          })
        : Promise.resolve(),
      sendStaffNotification({
        guestName: metadata.name ?? "",
        guestEmail,
        roomName: metadata.roomName ?? "",
        checkIn: formatDate(metadata.checkIn),
        checkOut: formatDate(metadata.checkOut),
        total: metadata.totalPrice,
      }),
    ])

    const emailLabels = ["guest confirmation", "staff notification"] as const
    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`Failed to send ${emailLabels[i]} for ${session.id}:`, result.reason)
      }
    })
  }

  return NextResponse.json({ received: true })
}
