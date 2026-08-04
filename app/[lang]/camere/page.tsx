import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getRooms } from "@/lib/rooms";
import { localeMetadata, resolveLocalePage, type LocaleParams } from "@/lib/page-locale";
import MobileCamere from "@/app/components/mobile/Camere";

export function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  return localeMetadata(params, (dict) => ({ title: dict.camere.title }));
}

export default async function Camere({ params }: { params: LocaleParams }) {
  const { lang, dict, isMobile } = await resolveLocalePage(params);
  const rooms = await getRooms();

  if (isMobile) {
    return <MobileCamere rooms={rooms} dict={dict.camere} lang={lang} />;
  }

  return (
    <div className="flex-grow pb-16 px-margin-desktop max-w-container-max mx-auto w-full pt-20">
      <div className="mb-12">
        <h1 className="text-headline-lg text-primary font-bold mb-2">
          {dict.camere.subtitle}
        </h1>
        <p className="text-body-md text-secondary">
          {dict.camere.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex flex-col group cursor-pointer"
          >
            <div className="relative w-full aspect-[4/3] bg-surface-container-high mb-6 overflow-hidden">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <h2 className="text-headline-md font-semibold text-primary">
                {room.name}
              </h2>
              <div className="mt-auto pt-4">
                <Link
                  href={`/${lang}/camere/${room.slug}`}
                  className="block w-full bg-primary text-on-primary text-body-md font-semibold uppercase tracking-widest py-3 hover:opacity-70 transition-opacity duration-300 text-center"
                >
                  {dict.camere.cta}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
// i just made this comment for fun idk maybe i'll remove it later, it was to trigger build soo 
// why is cursor so full of ai, its supposed to be an IDE, not a chatbot am i right?