import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { POINTS_OF_INTEREST } from "@/lib/pois";
import { ArrowRight } from "lucide-react";
import { getRequestDeviceType, isMobileDevice } from "@/lib/device";
import MobileCosaVisitare from "@/app/components/mobile/CosaVisitare";

export const metadata: Metadata = {
  title: "Cosa Visitare",
};

export default async function CosaVisitare() {
  const deviceType = await getRequestDeviceType();

  if (isMobileDevice(deviceType)) {
    return <MobileCosaVisitare />;
  }

  return (
    <>
      <header className="px-margin-desktop py-24 max-w-container-max mx-auto text-center border-b border-surface-variant w-full">
        <h1 className="text-display text-primary font-bold mb-6">
          Cosa Visitare
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Scopri i tesori nascosti di Corleone. Un viaggio attraverso natura incontaminata, storia profonda e architettura sacra, a pochi passi dalla nostra guesthouse.
        </p>
      </header>

      <main className="max-w-container-max mx-auto w-full">
        {POINTS_OF_INTEREST.map((poi, index) => (
          <section
            key={poi.title}
            className={`flex ${index % 2 === 1 ? "flex-row-reverse" : "flex-row"} border-b border-surface-variant`}
          >
            <div className="w-1/2 aspect-[4/3] bg-surface-container-high overflow-hidden relative">
              <Image
                src={poi.image}
                alt={poi.title}
                fill
                className="object-cover grayscale-hover"
              />
            </div>
            <div className="w-1/2 px-margin-desktop py-12 flex flex-col justify-center">
              <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
                {poi.category}
              </span>
              <h2 className="text-headline-md font-semibold text-primary mb-4">
                {poi.title}
              </h2>
              <p className="text-body-md text-on-surface-variant mb-6">
                {poi.description}
              </p>
              <Link
                href={poi.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
              >
                Scopri di più
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
            </div>
          </section>
        ))}

        <section className="px-margin-desktop py-20 text-center bg-surface-container-low">
          <h3 className="text-headline-md font-semibold text-primary mb-6">
            Pronto per esplorare?
          </h3>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
            Prenota il tuo soggiorno a CORLEONE GUESTHOUSE e usa la nostra guesthouse come base perfetta per le tue avventure.
          </p>
          <Link
            href="/camere"
            className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Verifica Disponibilità
          </Link>
        </section>
      </main>
    </>
  );
}
