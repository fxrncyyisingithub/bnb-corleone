import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return true
  const host = req.headers.get("host")
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Origine non consentita" }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

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

    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("id", reservationId)

    if (deleteError) {
      return NextResponse.json({ error: "Errore nell'eliminazione della prenotazione" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel reservation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
