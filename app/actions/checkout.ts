"use server"

import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createStripeCheckout(roomPriceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: roomPriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    })

    if (session.url) {
      redirect(session.url)
    }
  } catch (error) {
    console.error("Stripe Checkout Error:", error)
    throw new Error("Impossibile avviare il checkout. Controlla le API keys.")
  }
}
