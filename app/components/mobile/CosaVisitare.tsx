import Image from "next/image"
import Link from "next/link"
import { POINTS_OF_INTEREST } from "@/lib/pois"
import { ArrowRight } from "lucide-react"
import type { Locale } from "@/lib/locales"

type Dict = {
  title: string
  descriptionMobile: string
  scopriDiPiu: string
  readyTitle: string
  readyDescriptionMobile: string
  readyCta: string
  poi: Record<string, { category: string; title: string; description: string }>
}

export default function MobileCosaVisitare({ dict, lang }: { dict: Dict; lang: Locale }) {
  return (
    <>
      <header className="px-margin-mobile py-14 text-center border-b border-surface-variant w-full">
        <h1 className="text-headline-lg-mobile text-primary font-bold mb-5">
          {dict.title}
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          {dict.descriptionMobile}
        </p>
      </header>

      <main className="w-full">
        {POINTS_OF_INTEREST.map((poi) => {
          const poiDict = dict.poi[poi.id as keyof typeof dict.poi];
          return (
            <section key={poi.id} className="flex flex-col border-b border-surface-variant">
              <div className="w-full aspect-[4/3] bg-surface-container-high overflow-hidden relative">
                <Image
                  src={poi.image}
                  alt={poiDict?.title ?? poi.id}
                  fill
                  className="object-cover grayscale-hover"
                />
              </div>
              <div className="px-margin-mobile py-10 flex flex-col">
                <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
                  {poiDict?.category ?? ""}
                </span>
                <h2 className="text-headline-md font-semibold text-primary mb-3">{poiDict?.title ?? ""}</h2>
                <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  {poiDict?.description ?? ""}
                </p>
                <Link
                  href={poi.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest active:opacity-70 w-fit"
                >
                  {dict.scopriDiPiu}
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
                </Link>
              </div>
            </section>
          );
        })}

        <section className="px-margin-mobile py-16 text-center bg-surface-container-low">
          <h3 className="text-headline-md font-semibold text-primary mb-5">
            {dict.readyTitle}
          </h3>
          <p className="text-body-md text-on-surface-variant mb-8">
            {dict.readyDescriptionMobile}
          </p>
          <Link
            href={`/${lang}/camere`}
            className="block w-full bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest active:scale-95 transition-transform"
          >
            {dict.readyCta}
          </Link>
        </section>
      </main>
    </>
  )
}
