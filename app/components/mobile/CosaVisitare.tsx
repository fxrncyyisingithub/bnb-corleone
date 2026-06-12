import Image from "next/image"
import Link from "next/link"
import { POINTS_OF_INTEREST } from "@/lib/pois"
import { ArrowRight } from "lucide-react"

export default function MobileCosaVisitare() {
  return (
    <>
      <header className="px-margin-mobile py-14 text-center border-b border-surface-variant w-full">
        <h1 className="text-headline-lg-mobile text-primary font-bold mb-5">
          Cosa Visitare
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Scopri i tesori nascosti di Corleone, a pochi passi dalla guesthouse.
        </p>
      </header>

      <main className="w-full">
        {POINTS_OF_INTEREST.map((poi) => (
          <section key={poi.title} className="flex flex-col border-b border-surface-variant">
            <div className="w-full aspect-[4/3] bg-surface-container-high overflow-hidden relative">
              <Image
                src={poi.image}
                alt={poi.title}
                fill
                className="object-cover grayscale-hover"
              />
            </div>
            <div className="px-margin-mobile py-10 flex flex-col">
              <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
                {poi.category}
              </span>
              <h2 className="text-headline-md font-semibold text-primary mb-3">{poi.title}</h2>
              <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {poi.description}
              </p>
              <Link
                href={poi.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest active:opacity-70 w-fit"
              >
                Scopri di più
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
              </Link>
            </div>
          </section>
        ))}

        <section className="px-margin-mobile py-16 text-center bg-surface-container-low">
          <h3 className="text-headline-md font-semibold text-primary mb-5">
            Pronto per esplorare?
          </h3>
          <p className="text-body-md text-on-surface-variant mb-8">
            Prenota il tuo soggiorno e usa la guesthouse come base per le tue avventure.
          </p>
          <Link
            href="/camere"
            className="block w-full bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest active:scale-95 transition-transform"
          >
            Verifica Disponibilità
          </Link>
        </section>
      </main>
    </>
  )
}
