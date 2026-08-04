import { NextResponse } from "next/server"
import Stripe from "stripe"
import { refundCheckoutSession, stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { jsonError } from "@/lib/api-response"

export async function POST(req: Request) {
  const authClient = await createClient()
  const { data: { user }, error: authError } = await authClient.auth.getUser()

  if (authError) {
    console.error("Failed to verify admin session:", authError)
    return jsonError("Non autorizzato", 401)
  }

  if (!user) {
    return jsonError("Non autorizzato", 401)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError("Corpo della richiesta non valido", 400)
  }

  const reservationId = (body as { reservationId?: unknown } | null)?.reservationId

  if (!reservationId || typeof reservationId !== "string") {
    return jsonError("Missing reservationId", 400)
  }

  const supabase = createAdminClient()

  const { data: reservation, error: fetchError } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .single()

  // PGRST116 = no rows returned; any other error is a backend failure.
  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Failed to load reservation:", reservationId, fetchError)
    return jsonError("Errore nel caricamento della prenotazione", 500)
  }

  if (!reservation) {
    return jsonError("Prenotazione non trovata", 404)
  }

  if (reservation.status !== "paid") {
    return jsonError("Solo prenotazioni pagate possono essere rimborsate", 400)
  }

  let refunded = false

  if (reservation.stripe_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id)
      refunded = await refundCheckoutSession(session)

      if (!refunded) {
        console.error(
          "Reservation has no payment intent, refund skipped:",
          reservationId,
          reservation.stripe_session_id
        )
        return jsonError(
          "Pagamento non rimborsabile automaticamente. Rimborsa da Stripe.",
          502
        )
      }
    } catch (error) {
      console.error("Stripe refund failed:", reservationId, error)
      const message =
        error instanceof Stripe.errors.StripeError
          ? `Rimborso Stripe non riuscito: ${error.message}`
          : "Rimborso Stripe non riuscito"
      // The reservation is left untouched so the refund can be retried.
      return jsonError(message, 502)
    }
  }

  const { error: deleteError } = await supabase
    .from("reservations")
    .delete()
    .eq("id", reservationId)

  if (deleteError) {
    console.error(
      refunded
        ? `CRITICAL: refund succeeded but reservation ${reservationId} could not be deleted:`
        : `Failed to delete reservation ${reservationId}:`,
      deleteError
    )
    return jsonError(
      refunded
        ? "Rimborso effettuato, ma la prenotazione non è stata eliminata. Riprova."
        : "Errore nell'eliminazione della prenotazione",
      500
    )
  }

  return NextResponse.json({ success: true, refunded })
}
