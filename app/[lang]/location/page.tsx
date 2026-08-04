import type { Metadata } from "next";
import { localeMetadata, resolveLocalePage, type LocaleParams } from "@/lib/page-locale";
import MobileLocation from "@/app/components/mobile/Location";

export function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return localeMetadata(params, (dict) => ({ title: dict.location.title }));
}

export default async function Location({ params }: { params: LocaleParams }) {
  const { dict, isMobile } = await resolveLocalePage(params);

  if (isMobile) {
    return <MobileLocation dict={dict.location} />;
  }

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-20 flex flex-col gap-10 min-h-[80vh]">
      <section className="flex flex-col gap-4">
        <h1 className="text-headline-lg font-bold text-primary">{dict.location.title}</h1>
      </section>

      <div className="text-center">
        <p className="text-body-lg text-primary font-semibold">
          {dict.location.address}
        </p>
      </div>

      <div className="w-full aspect-[16/9] bg-surface-container-high overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8669756845466!2d13.292902011765444!3d37.81658470963309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131a1c77b1d6621f%3A0xa4ad251039a8e7da!2sCorleone%20Guesthouse!5e0!3m2!1sit!2sit!4v1781263887065!5m2!1sit!2sit"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
