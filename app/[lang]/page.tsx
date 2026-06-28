import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import hero from "@/immagini/corleone.png";
import { getRequestDeviceType, isMobileDevice } from "@/lib/device";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/locales";
import { notFound } from "next/navigation";
import MobileHome from "@/app/components/mobile/Home";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "it";
  const dict = await getDictionary(locale);
  return {
    title: dict.site.name,
    description: dict.site.description,
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const deviceType = await getRequestDeviceType();

  if (isMobileDevice(deviceType)) {
    return <MobileHome dict={dict.home} lang={lang} />;
  }

  return (
    <>
      <section className="relative h-[80vh] w-full flex flex-col justify-end p-margin-desktop">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <Image
            src={hero}
            alt="Architettura minimalista"
            fill
            priority
            className="object-cover filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="z-10 text-on-primary mb-8 max-w-container-max mx-auto w-full">
          <h1 className="text-display font-black mb-4">
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
