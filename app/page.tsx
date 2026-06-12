import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import hero from "@/immagini/corleone.png"

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex flex-col justify-end p-margin-mobile md:p-margin-desktop">
        {/* Background Image */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <Image
            src={hero}
            alt="Architettura minimalista"
            fill
            priority
            className="object-cover filter grayscale contrast-125 brightness-90"
          /> 
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="z-10 text-on-primary mb-8 max-w-container-max mx-auto w-full">
          <h1 className="text-headline-lg-mobile md:text-display font-bold mb-4">
            Vivi la Sicilia come non l'hai mai vissuta
          </h1>
          <p className="text-body-md max-w-sm text-surface-dim mb-8">
            L'essenza del minimalismo architettonico nel cuore della città. Un rifugio esclusivo dove ogni dettaglio è sottratto fino alla perfezione.
          </p>
          <Link
            href="/camere"
            className="inline-block py-4 px-8 bg-surface text-primary text-label-sm uppercase tracking-widest hover:bg-surface-dim transition-colors"
          >
            Esplora le Camere
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-[80px] px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="flex flex-col gap-6 max-w-container-max mx-auto">
          <h2 className="text-headline-md text-primary font-semibold">Un'Estetica della Sottrazione.</h2>
          <div className="w-12 h-px bg-primary"></div>
          <p className="text-body-md text-secondary max-w-3xl">
            A Corleone Guesthouse, crediamo che il vero lusso risieda nello spazio e nella luce. I nostri ambienti sono progettati come gallerie d'arte, dove il mobilio essenziale e le texture pure permettono alla mente di riposare. Nessun eccesso, solo pura presenza architettonica.
          </p>
        </div>
      </section>
    </>
  );
}