import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pagamento Completato",
}

export default async function Success({
  params,
}: {
  params: Promise<{ session_id: string }>
}) {
  const { session_id } = await params

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-20 flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
      <span className="material-symbols-outlined text-[64px] text-primary">check_circle</span>
      <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Pagamento Completato!</h1>
      <p className="text-body-lg text-secondary max-w-md">
        Grazie per la tua prenotazione. Riceverai una conferma via email.
      </p>
      <p className="text-body-md text-secondary font-mono text-xs break-all max-w-sm">
        {session_id}
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        Torna alla Home
      </Link>
    </div>
  )
}