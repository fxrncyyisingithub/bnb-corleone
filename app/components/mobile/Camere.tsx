import Image from "next/image"
import Link from "next/link"
import type { RoomListItem } from "@/lib/rooms"
import type { Locale } from "@/lib/locales"

type Dict = {
  subtitle: string
  description: string
  cta: string
}

export default function MobileCamere({ rooms, dict, lang }: { rooms: RoomListItem[]; dict: Dict; lang: Locale }) {
  return (
    <div className="flex-grow pb-16 px-margin-mobile w-full pt-8">
      <div className="mb-10">
        <h1 className="text-headline-lg-mobile text-primary font-bold mb-2">
          {dict.subtitle}
        </h1>
        <p className="text-body-md text-secondary">
          {dict.description}
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex flex-col group border-b border-outline-variant pb-10 last:border-0 last:pb-0"
          >
            <div className="relative w-full aspect-[4/3] bg-surface-container-high mb-5 overflow-hidden rounded">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover active:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-headline-md font-semibold text-primary">{room.name}</h2>
              <Link
                href={`/${lang}/camere/${room.slug}`}
                className="block w-full bg-primary text-on-primary text-body-md font-semibold uppercase tracking-widest py-4 active:scale-95 transition-transform text-center"
              >
                {dict.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
