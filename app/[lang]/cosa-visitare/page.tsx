import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { POINTS_OF_INTEREST } from "@/lib/pois";
import { ArrowRight } from "lucide-react";
import { localeMetadata, resolveLocalePage, type LocaleParams } from "@/lib/page-locale";
import MobileCosaVisitare from "@/app/components/mobile/CosaVisitare";

export function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return localeMetadata(params, (dict) => ({ title: dict.cosaVisitare.title }));
}

export default async function CosaVisitare({ params }: { params: LocaleParams }) {
  const { lang, dict, isMobile } = await resolveLocalePage(params);

  if (isMobile) {
    return <MobileCosaVisitare dict={dict.cosaVisitare} lang={lang} />;
  }

  return (
    <>
      <header className="px-margin-desktop py-24 max-w-container-max mx-auto text-center border-b border-surface-variant w-full">
        <h1 className="text-display text-primary font-bold mb-6">
          {dict.cosaVisitare.title}
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {dict.cosaVisitare.description}
        </p>
      </header>

      <main className="max-w-container-max mx-auto w-full">
        {POINTS_OF_INTEREST.map((poi, index) => {
          const poiDict = dict.cosaVisitare.poi[poi.id as keyof typeof dict.cosaVisitare.poi];
          return (
            <section
              key={poi.id}
              className={`flex ${index % 2 === 1 ? "flex-row-reverse" : "flex-row"} border-b border-surface-variant`}
            >
              <div className="w-1/2 aspect-[4/3] bg-surface-container-high overflow-hidden relative">
                <Image
                  src={poi.image}
                  alt={poiDict?.title ?? poi.id}
                  fill
                  className="object-cover grayscale-hover"
                />
              </div>
              <div className="w-1/2 px-margin-desktop py-12 flex flex-col justify-center">
                <span className="inline-block bg-surface-container-high text-primary px-3 py-1 text-label-sm font-semibold uppercase tracking-widest mb-4 w-fit">
                  {poiDict?.category ?? ""}
                </span>
                <h2 className="text-headline-md font-semibold text-primary mb-4">
                  {poiDict?.title ?? ""}
                </h2>
                <p className="text-body-md text-on-surface-variant mb-6">
                  {poiDict?.description ?? ""}
                </p>
                <Link
                  href={poi.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary text-label-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity w-fit group"
                >
                  {dict.cosaVisitare.scopriDiPiu}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
                </Link>
              </div>
            </section>
          );
        })}

        <section className="px-margin-desktop py-20 text-center bg-surface-container-low">
          <h3 className="text-headline-md font-semibold text-primary mb-6">
            {dict.cosaVisitare.readyTitle}
          </h3>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
            {dict.cosaVisitare.readyDescription}
          </p>
          <Link
            href={`/${lang}/camere`}
            className="inline-block bg-primary text-on-primary px-8 py-4 text-label-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            {dict.cosaVisitare.readyCta}
          </Link>
        </section>
      </main>
    </>
  );
}
