import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { differenceInDays } from "date-fns"
import { PRICE_PER_ADULT } from "@/lib/constants"
import { checkoutSchema } from "@/lib/validation/checkout"

export async function POST(req: Request) {
  try {
    const body = await req.json()
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

    if (roomError || !room) {
      return NextResponse.json({ error: "Camera non trovata" }, { status: 404 })
    }

    if (adults > room.capacity) {
      return NextResponse.json(
        { error: `Questa camera accetta al massimo ${room.capacity} adulti` },
        { status: 400 }
      )
    }

    const { data: conflicts, error: conflictError } = await supabase
      .from("reservations")
      .select("id")
      .eq("room_id", roomId)
      .eq("status", "paid")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)

    if (conflictError) {
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

    const totalPrice = nights * PRICE_PER_ADULT * adults
    const guests = adults + bambini

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Prenotazione: Camera ${room.name}`,
              description: `${new Date(checkIn).toLocaleDateString("it-IT")} - ${new Date(checkOut).toLocaleDateString("it-IT")} (${adults} adulti${bambini ? `, ${bambini} bambini` : ""})`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/camere/${room.slug}`,
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

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
