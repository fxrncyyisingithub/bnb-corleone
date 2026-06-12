import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { roomId, checkIn, checkOut, guests, name, email, phone, totalPrice } = body

    const supabase = await createClient()

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Camera non trovata' }, { status: 404 })
    }

    // Verify availability to prevent double booking
    // Conflicts happen if an existing paid reservation overlaps with the requested dates.
    // Overlap condition: existing.check_in < requested.checkOut AND existing.check_out > requested.checkIn
    const { data: conflicts, error: conflictError } = await supabase
      .from('reservations')
      .select('id')
      .eq('room_id', roomId)
      .eq('status', 'paid')
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    if (conflictError) {
      return NextResponse.json({ error: 'Errore durante il controllo della disponibilità' }, { status: 500 })
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Le date selezionate non sono più disponibili.' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Prenotazione: ${room.name}`,
              description: `${new Date(checkIn).toLocaleDateString('it-IT')} - ${new Date(checkOut).toLocaleDateString('it-IT')} (${guests} Ospiti)`,
            },
            unit_amount: totalPrice * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/camere/${room.slug}`,
      customer_email: email,
      metadata: {
        roomId,
        checkIn,
        checkOut,
        guests: guests.toString(),
        name,
        email,
        phone,
        totalPrice: totalPrice.toString()
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
