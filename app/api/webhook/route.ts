import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendGuestConfirmation, sendStaffNotification } from "@/lib/email"
import { format } from "date-fns"

export const maxDuration = 30

// PostgreSQL error codes surfaced by PostgREST
const UNIQUE_VIOLATION = "23505"
const EXCLUSION_VIOLATION = "23P01"

async function refundSession(session: Stripe.Checkout.Session): Promise<void> {
  const paymentIntent = session.payment_intent

  if (typeof paymentIntent !== "string") {
    throw new Error(`No payment intent on session ${session.id}: cannot refund automatically`)
  }

  await stripe.refunds.create({ payment_intent: paymentIntent })
}

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook signature verification failed:", message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (!metadata?.roomId || !metadata.checkIn || !metadata.checkOut || !metadata.guests || !metadata.totalPrice) {
      console.error("Webhook missing required metadata:", session.id)
      return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 })
    }

    const guests = Number.parseInt(metadata.guests, 10)
    const totalPrice = Number.parseFloat(metadata.totalPrice)

    if (!Number.isFinite(guests) || !Number.isFinite(totalPrice)) {
      console.error("Webhook has non-numeric metadata:", session.id, {
        guests: metadata.guests,
        totalPrice: metadata.totalPrice,
      })
      return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 })
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
      return NextResponse.json({ error: "Database Error" }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const { data: conflicts, error: conflictError } = await supabase
      .from("reservations")
      .select("id")
      .eq("room_id", metadata.roomId)
      .eq("status", "paid")
      .lt("check_in", metadata.checkOut)
      .gt("check_out", metadata.checkIn)

    if (conflictError) {
      console.error("Failed to check overlapping reservations:", session.id, conflictError)
      return NextResponse.json({ error: "Database Error" }, { status: 500 })
    }

    if (conflicts && conflicts.length > 0) {
      console.error("Overlapping reservation detected, refunding:", session.id)
      try {
        await refundSession(session)
      } catch (err) {
        // Guest paid for dates we cannot honour and the refund failed: return 5xx so
        // Stripe retries the event and the refund is attempted again.
        console.error("CRITICAL: refund failed for overlapping reservation:", session.id, err)
        return NextResponse.json({ error: "Refund failed", sessionId: session.id }, { status: 500 })
      }
      return NextResponse.json({ error: "Date non più disponibili, rimborso effettuato." }, { status: 409 })
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
          return NextResponse.json({ error: "Refund failed", sessionId: session.id }, { status: 500 })
        }
        return NextResponse.json({ error: "Date non più disponibili, rimborso effettuato." }, { status: 409 })
      }

      console.error("Failed to insert reservation:", error)
      return NextResponse.json({ error: "Database Error" }, { status: 500 })
    }

    const fmtDate = (d: string) => format(new Date(d), "dd/MM/yyyy")
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
            checkIn: fmtDate(metadata.checkIn),
            checkOut: fmtDate(metadata.checkOut),
            total: metadata.totalPrice,
            sessionId: session.id,
          })
        : Promise.resolve(),
      sendStaffNotification({
        guestName: metadata.name ?? "",
        guestEmail,
        roomName: metadata.roomName ?? "",
        checkIn: fmtDate(metadata.checkIn),
        checkOut: fmtDate(metadata.checkOut),
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
