import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { differenceInDays } from "date-fns"
import { checkoutSchema } from "@/lib/validation/checkout"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter"
import { getBaseUrl } from "@/lib/base-url"
import { findOverlappingReservations } from "@/lib/reservations"
import { INTERNAL_ERROR, jsonError } from "@/lib/api-response"

const baseUrl = getBaseUrl()

export async function POST(req: Request) {
  const rateLimitResult = await checkRateLimit(req)
  if (rateLimitResult.limited) {
    return jsonError("Troppe richieste. Riprova tra qualche secondo.", 429, undefined, {
      headers: getRateLimitHeaders(rateLimitResult),
    })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError("Corpo della richiesta non valido", 400)
  }

  try {
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return jsonError("Dati non validi", 400, {
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const { roomId, checkIn, checkOut, adults, bambini, name, email, locale } = parsed.data
    const supabase = await createClient()

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single()

    // PGRST116 = no rows returned by .single(); anything else is a real failure
    // and must not be reported to the guest as "room not found".
    if (roomError && roomError.code !== "PGRST116") {
      console.error("Failed to load room:", roomId, roomError)
      return jsonError("Errore durante il caricamento della camera", 500)
    }

    if (!room) {
      return jsonError("Camera non trovata", 404)
    }

    if (adults > room.capacity) {
      return jsonError(`Questa camera accetta al massimo ${room.capacity} adulti`, 400)
    }

    const { data: conflicts, error: conflictError } = await findOverlappingReservations(
      supabase,
      { roomId, checkIn, checkOut }
    )

    if (conflictError) {
      console.error("Availability check failed:", roomId, conflictError)
      return jsonError("Errore durante il controllo della disponibilità", 500)
    }

    if (conflicts && conflicts.length > 0) {
      return jsonError("Le date selezionate non sono più disponibili.", 400)
    }

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (nights < 1) {
      return jsonError("Seleziona almeno una notte", 400)
    }

    const totalPrice = nights * Number(room.price) * adults
    const guests = adults + bambini

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Prenotazione: Camera ${room.name}`,
              description: `${new Date(checkIn).toLocaleDateString(locale)} - ${new Date(checkOut).toLocaleDateString(locale)} (${adults} adulti${bambini ? `, ${bambini} bambini` : ""})`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/${locale}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/camere/${room.slug}`,
      customer_email: email,
      metadata: {
        roomId,
        roomName: room.name,
        checkIn,
        checkOut,
        adults: adults.toString(),
        bambini: bambini.toString(),
        guests: guests.toString(),
        name,
        email,
        totalPrice: totalPrice.toString(),
      },
    })

    if (!session.url) {
      console.error("Stripe session created without a checkout URL:", session.id)
      return jsonError("Impossibile avviare il pagamento. Riprova.", 502)
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return jsonError("Impossibile avviare il pagamento. Riprova.", 502)
    }

    return jsonError(INTERNAL_ERROR, 500)
  }
}
