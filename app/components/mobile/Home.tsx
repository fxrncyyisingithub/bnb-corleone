import Image from "next/image"
import Link from "next/link"
import hero from "@/immagini/corleone.png"
import type { Locale } from "@/lib/locales"

type Dict = {
  heroTitle: string
  heroDescription: string
  heroCta: string
  sectionTitle: string
  sectionDescription: string
}

export default function MobileHome({ dict, lang }: { dict: Dict; lang: Locale }) {
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
            {dict.heroTitle}
          </h1>
          <p className="text-body-md text-surface-dim mb-8">
            {dict.heroDescription}
          </p>
          <Link
            href={`/${lang}/camere`}
            className="block w-full py-4 px-8 bg-surface text-primary text-label-sm uppercase tracking-widest text-center active:scale-95 transition-transform"
          >
            {dict.heroCta}
          </Link>
        </div>
      </section>

      <section className="py-16 px-margin-mobile bg-surface">
        <div className="flex flex-col gap-6">
          <h2 className="text-headline-md text-primary font-semibold">
            {dict.sectionTitle}
          </h2>
          <div className="w-12 h-px bg-primary" />
          <p className="text-body-md text-secondary leading-relaxed">
            {dict.sectionDescription}
          </p>
        </div>
      </section>
    </>
  )
}
