import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { refundCheckoutSession, stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendGuestConfirmation, sendStaffNotification } from "@/lib/email"
import { formatDate } from "@/lib/format"
import { findOverlappingReservations } from "@/lib/reservations"
import { jsonError } from "@/lib/api-response"

export const maxDuration = 30

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

    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from("reservations")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    const { data: conflicts } = await findOverlappingReservations(supabase, {
      roomId: metadata.roomId,
      checkIn: metadata.checkIn,
      checkOut: metadata.checkOut,
    })

    if (conflicts && conflicts.length > 0) {
      console.error("Overlapping reservation detected, refunding:", session.id)
      await refundCheckoutSession(session).catch((e) => console.error("Refund failed:", e))
      return jsonError("Date non più disponibili, rimborso effettuato.", 409)
    }

    const { error } = await supabase.from("reservations").insert({
      room_id: metadata.roomId,
      check_in: metadata.checkIn,
      check_out: metadata.checkOut,
      guests: parseInt(metadata.guests, 10),
      total_price: parseFloat(metadata.totalPrice),
      status: "paid",
      guest_name: metadata.name ?? "",
      guest_email: metadata.email ?? session.customer_email ?? "",
      stripe_session_id: session.id,
    })

    if (error) {
      console.error("Failed to insert reservation:", error)
      return jsonError("Database Error", 500)
    }

    const guestEmail = metadata.email ?? session.customer_email ?? ""

    if (guestEmail) {
      void sendGuestConfirmation({
        name: metadata.name ?? "",
        email: guestEmail,
        roomName: metadata.roomName ?? "",
        checkIn: formatDate(metadata.checkIn),
        checkOut: formatDate(metadata.checkOut),
        total: metadata.totalPrice,
        sessionId: session.id,
      })
    }

    void sendStaffNotification({
      guestName: metadata.name ?? "",
      guestEmail,
      roomName: metadata.roomName ?? "",
      checkIn: formatDate(metadata.checkIn),
      checkOut: formatDate(metadata.checkOut),
      total: metadata.totalPrice,
    })
  }

  return NextResponse.json({ received: true })
}
