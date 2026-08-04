import { NextResponse } from "next/server"
import Stripe from "stripe"
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

  const authClient = await createClient()
  const { data: { user }, error: authError } = await authClient.auth.getUser()

  if (authError) {
    console.error("Failed to verify admin session:", authError)
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corpo della richiesta non valido" }, { status: 400 })
  }

  const reservationId = (body as { reservationId?: unknown } | null)?.reservationId

  if (!reservationId || typeof reservationId !== "string") {
    return NextResponse.json({ error: "Missing reservationId" }, { status: 400 })
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
    return NextResponse.json(
      { error: "Errore nel caricamento della prenotazione" },
      { status: 500 }
    )
  }

  if (!reservation) {
    return NextResponse.json({ error: "Prenotazione non trovata" }, { status: 404 })
  }

  if (reservation.status !== "paid") {
    return NextResponse.json({ error: "Solo prenotazioni pagate possono essere rimborsate" }, { status: 400 })
  }

  let refunded = false

  if (reservation.stripe_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id)
      const paymentIntent = session.payment_intent

      if (typeof paymentIntent === "string") {
        await stripe.refunds.create({ payment_intent: paymentIntent })
        refunded = true
      } else {
        console.error(
          "Reservation has no payment intent, refund skipped:",
          reservationId,
          reservation.stripe_session_id
        )
        return NextResponse.json(
          { error: "Pagamento non rimborsabile automaticamente. Rimborsa da Stripe." },
          { status: 502 }
        )
      }
    } catch (error) {
      console.error("Stripe refund failed:", reservationId, error)
      const message =
        error instanceof Stripe.errors.StripeError
          ? `Rimborso Stripe non riuscito: ${error.message}`
          : "Rimborso Stripe non riuscito"
      // The reservation is left untouched so the refund can be retried.
      return NextResponse.json({ error: message }, { status: 502 })
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
    return NextResponse.json(
      {
        error: refunded
          ? "Rimborso effettuato, ma la prenotazione non è stata eliminata. Riprova."
          : "Errore nell'eliminazione della prenotazione",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, refunded })
}
