import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { differenceInDays } from "date-fns"
import { checkoutSchema } from "@/lib/validation/checkout"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter"

const vercelUrl = process.env.VERCEL_URL
const baseUrl = process.env.NEXT_PUBLIC_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")

export async function POST(req: Request) {
  const rateLimitResult = await checkRateLimit(req)
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra qualche secondo." },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corpo della richiesta non valido" }, { status: 400 })
  }

  try {
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: "Errore durante il caricamento della camera" },
        { status: 500 }
      )
    }

    if (!room) {
      return NextResponse.json({ error: "Camera non trovata" }, { status: 404 })
    }

    if (adults > room.capacity) {
      return NextResponse.json(
        { error: `Questa camera accetta al massimo ${room.capacity} adulti` },
        { status: 400 }
      )
    }

    const { data: conflicts, error: conflictError } = await supabase
      .from("reservation_availability")
      .select("room_id")
      .eq("room_id", roomId)
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)

    if (conflictError) {
      console.error("Availability check failed:", roomId, conflictError)
      return NextResponse.json(
        { error: "Errore durante il controllo della disponibilità" },
        { status: 500 }
      )
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: "Le date selezionate non sono più disponibili." },
        { status: 400 }
      )
    }

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (nights < 1) {
      return NextResponse.json(
        { error: "Seleziona almeno una notte" },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: "Impossibile avviare il pagamento. Riprova." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: "Impossibile avviare il pagamento. Riprova." },
        { status: 502 }
      )
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
