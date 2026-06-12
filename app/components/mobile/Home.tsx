import Image from "next/image"
import Link from "next/link"
import hero from "@/immagini/corleone.png"

export default function MobileHome() {
  return (
    <>
      <section className="relative h-[85vh] w-full flex flex-col justify-end p-margin-mobile">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <Image
            src={hero}
            alt="Architettura minimalista"
            fill
            priority
            className="object-cover filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="z-10 text-on-primary mb-10">
          <h1 className="text-headline-lg-mobile font-bold mb-4 leading-tight">
            {"Vivi la Sicilia come non l'hai mai vissuta"}
          </h1>
          <p className="text-body-md text-surface-dim mb-8">
            {"L'essenza del minimalismo architettonico nel cuore della città. Un rifugio esclusivo dove ogni dettaglio è sottratto fino alla perfezione."}
          </p>
          <Link
            href="/camere"
            className="block w-full py-4 px-8 bg-surface text-primary text-label-sm uppercase tracking-widest text-center active:scale-95 transition-transform"
          >
            Esplora le Camere
          </Link>
        </div>
      </section>

      <section className="py-16 px-margin-mobile bg-surface">
        <div className="flex flex-col gap-6">
          <h2 className="text-headline-md text-primary font-semibold">
            {"Un'Estetica della Sottrazione."}
          </h2>
          <div className="w-12 h-px bg-primary" />
          <p className="text-body-md text-secondary leading-relaxed">
            {"A Corleone Guesthouse, crediamo che il vero lusso risieda nello spazio e nella luce. I nostri ambienti sono progettati come gallerie d'arte, dove il mobilio essenziale e le texture pure permettono alla mente di riposare. Nessun eccesso, solo pura presenza architettonica."}
          </p>
        </div>
      </section>
    </>
  )
}
