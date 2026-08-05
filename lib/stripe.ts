import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing. Please set the environment variable.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

/** Refunds the payment behind a checkout session. Returns false when nothing was charged. */
export async function refundCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const paymentIntent = session.payment_intent;
  if (typeof paymentIntent !== "string") return false;

  await stripe.refunds.create({ payment_intent: paymentIntent });
  return true;
}
