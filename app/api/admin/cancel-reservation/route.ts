import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { reservationId } = await req.json()

    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json({ error: "Missing reservationId" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: "Prenotazione non trovata" }, { status: 404 })
    }

    if (reservation.status !== "paid") {
      return NextResponse.json({ error: "Solo prenotazioni pagate possono essere rimborsate" }, { status: 400 })
    }

    if (reservation.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id)

      const paymentIntent = session.payment_intent
      if (typeof paymentIntent === "string") {
        await stripe.refunds.create({
          payment_intent: paymentIntent,
        })
      }
    }

    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservationId)

    if (updateError) {
      return NextResponse.json({ error: "Errore nell'aggiornamento della prenotazione" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel reservation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
