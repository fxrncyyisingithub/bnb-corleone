import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getRooms } from "@/lib/rooms";
import { getRequestDeviceType, isMobileDevice } from "@/lib/device";
import MobileCamere from "@/app/components/mobile/Camere";

export const metadata: Metadata = {
  title: "Camere",
};

export default async function Camere() {
  const rooms = await getRooms();
  const deviceType = await getRequestDeviceType();

  if (isMobileDevice(deviceType)) {
    return <MobileCamere rooms={rooms} />;
  }

  return (
    <div className="flex-grow pb-16 px-margin-desktop max-w-container-max mx-auto w-full pt-20">
      <div className="mb-12">
        <h1 className="text-headline-lg text-primary font-bold mb-2">
          Seleziona la tua camera
        </h1>
        <p className="text-body-md text-secondary">
          Scopri le nostre soluzioni esclusive per un soggiorno indimenticabile a Corleone.
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
                  href={`/camere/${room.slug}`}
                  className="block w-full bg-primary text-on-primary text-body-md font-semibold uppercase tracking-widest py-3 hover:opacity-70 transition-opacity duration-300 text-center"
                >
                  Prenota Ora
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
