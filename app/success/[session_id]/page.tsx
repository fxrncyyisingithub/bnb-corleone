import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { stripe } from "@/lib/stripe"
import { format } from "date-fns"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Pagamento Completato",
}

export default async function Success({
  params,
}: {
  params: Promise<{ session_id: string }>
}) {
  const { session_id } = await params

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    notFound()
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
        Pagamento Completato!
      </h1>
      <p className="text-body-lg text-secondary max-w-md">
        Grazie per la tua prenotazione. Riceverai una conferma via email.
      </p>
      {metadata?.name && (
        <div className="text-body-md text-secondary max-w-sm space-y-1">
          <p>
            <span className="font-semibold text-primary">Ospite:</span> {metadata.name}
          </p>
          {checkIn && checkOut && (
            <p>
              <span className="font-semibold text-primary">Date:</span>{" "}
              {format(checkIn, "dd/MM/yyyy")} – {format(checkOut, "dd/MM/yyyy")}
            </p>
          )}
        </div>
      )}
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        Torna alla Home
      </Link>
    </div>
  )
}
