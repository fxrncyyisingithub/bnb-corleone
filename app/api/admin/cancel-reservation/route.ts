import { NextResponse } from "next/server"
import { refundCheckoutSession, stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { INTERNAL_ERROR, jsonError } from "@/lib/api-response"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return jsonError("Non autorizzato", 401)
  }

  try {
    const { reservationId } = await req.json()

    if (!reservationId || typeof reservationId !== "string") {
      return jsonError("Missing reservationId", 400)
    }

    const supabase = createAdminClient()

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .single()

    if (fetchError || !reservation) {
      return jsonError("Prenotazione non trovata", 404)
    }

    if (reservation.status !== "paid") {
      return jsonError("Solo prenotazioni pagate possono essere rimborsate", 400)
    }

    if (reservation.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id)
      await refundCheckoutSession(session)
    }

    const { error: deleteError } = await supabase
      .from("reservations")
      .delete()
      .eq("id", reservationId)

    if (deleteError) {
      return jsonError("Errore nell'eliminazione della prenotazione", 500)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel reservation error:", error)
    return jsonError(INTERNAL_ERROR, 500)
  }
}
