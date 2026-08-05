import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { localeMetadata, resolveLocalePage, type LocaleParams } from "@/lib/page-locale";
import MobileHome from "@/app/components/mobile/Home";

const heroSrc = "/immagini/corleone";

export function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return localeMetadata(params, (dict) => ({
    title: dict.site.name,
    description: dict.site.description,
  }));
}

export default async function Home({ params }: { params: LocaleParams }) {
  const { lang, dict, isMobile } = await resolveLocalePage(params);

  if (isMobile) {
    return <MobileHome dict={dict.home} lang={lang} />;
  }

  return (
    <>
      <section className="relative h-[80vh] w-full flex flex-col justify-end p-margin-desktop">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <Image
            src={heroSrc}
            alt="Architettura minimalista"
            fill
            priority
            className="object-cover filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="z-10 text-on-primary mb-8 max-w-container-max mx-auto w-full">
          <h1 className="text-display font-bold mb-4">
            {dict.home.heroTitle}
          </h1>
          <p className="text-body-md max-w-sm text-surface-dim mb-8">
            {dict.home.heroDescription}
          </p>
          <Link
            href={`/${lang}/camere`}
            className="inline-block py-4 px-8 bg-surface text-primary text-label-sm uppercase tracking-widest hover:bg-surface-dim transition-colors"
          >
            {dict.home.heroCta}
          </Link>
        </div>
      </section>

      <section className="py-[80px] px-margin-desktop bg-surface">
        <div className="flex flex-col gap-6 max-w-container-max mx-auto">
          <h2 className="text-headline-md text-primary font-semibold">
            {dict.home.sectionTitle}
          </h2>
          <div className="w-12 h-px bg-primary" />
          <p className="text-body-md text-secondary max-w-3xl">
            {dict.home.sectionDescription}
          </p>
        </div>
      </section>
    </>
  );
}
