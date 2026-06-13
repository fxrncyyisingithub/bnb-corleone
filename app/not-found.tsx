import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] text-center gap-6 px-6">
      <h1 className="text-[120px] md:text-[180px] font-bold text-primary leading-none tracking-tighter">
        404
      </h1>
      <p className="text-body-lg text-secondary max-w-md">
        Pagina non trovata.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary px-8 py-3 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        Torna alla Home
      </Link>
    </div>
  )
}
