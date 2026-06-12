import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const metadata = session.metadata

    // Use service role key to insert securely
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from('reservations').insert({
      room_id: metadata.roomId,
      check_in: metadata.checkIn,
      check_out: metadata.checkOut,
      guests: parseInt(metadata.guests),
      total_price: parseFloat(metadata.totalPrice),
      status: 'paid',
      guest_name: metadata.name,
      guest_email: metadata.email,
      guest_phone: metadata.phone,
      stripe_session_id: session.id
    })

    if (error) {
      console.error('Failed to insert reservation:', error)
      return NextResponse.json({ error: 'Database Error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
