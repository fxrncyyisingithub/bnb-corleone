import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { format } from "date-fns"
import { CheckCircle } from "lucide-react"
import { getDictionary } from "@/lib/dictionary"
import { isLocale } from "@/lib/locales"

export async function generateMetadata({ params }: { params: Promise<{ lang: string; session_id: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const dict = await getDictionary(locale);
  return { title: dict.success.title };
}

export default async function Success({
  params,
}: {
  params: Promise<{ lang: string; session_id: string }>
}) {
  const { lang, session_id } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch (error) {
    // Only an unknown session id is a 404; a Stripe outage must surface as an error
    // instead of telling a paying guest their booking does not exist.
    if (error instanceof Stripe.errors.StripeError && error.type === "StripeInvalidRequestError") {
      notFound()
    }
    console.error("Failed to retrieve Stripe session:", session_id, error)
    throw error
  }

  if (session.payment_status !== "paid") {
    notFound()
  }

  const metadata = session.metadata
  const checkIn = metadata?.checkIn ? new Date(metadata.checkIn) : null
  const checkOut = metadata?.checkOut ? new Date(metadata.checkOut) : null

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-20 flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
      <CheckCircle className="w-16 h-16 text-primary" aria-hidden />
      <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">
        {dict.success.title}
      </h1>
      <p className="text-body-lg text-secondary max-w-md">
        {dict.success.description}
      </p>
      {metadata?.name && (
        <div className="text-body-md text-secondary max-w-sm space-y-1">
          <p>
            <span className="font-semibold text-primary">{dict.success.guest}</span> {metadata.name}
          </p>
          {checkIn && checkOut && (
            <p>
              <span className="font-semibold text-primary">{dict.success.dates}</span>{" "}
              {format(checkIn, "dd/MM/yyyy")} – {format(checkOut, "dd/MM/yyyy")}
            </p>
          )}
        </div>
      )}
      <Link
        href={`/${lang}`}
        className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        {dict.success.backHome}
      </Link>
    </div>
  )
}
