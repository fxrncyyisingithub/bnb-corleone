import BookingForm from "@/app/components/BookingForm"
import type { BookableRoom, BookingDict } from "@/app/components/BookingForm"
import ImageGallery from "@/app/components/ImageGallery"
import { User, CreditCard } from "lucide-react"
import type { Locale } from "@/lib/locales"
import { maxAdults, type OccupancyOption } from "@/lib/rooms"

type Dict = {
  cameraLabel: string
  maxGuestsMobile: string
  pricePerPerson: string
  title: string
}

export default function MobileRoomDetail({
  room,
  occupancy,
  images,
  bookedDates,
  roomDict,
  bookingDict,
  lang,
}: {
  room: BookableRoom
  occupancy: OccupancyOption[]
  images: string[]
  bookedDates: string[]
  roomDict: Dict
  bookingDict: BookingDict
  lang: Locale
}) {
  const maxCapacity = maxAdults(occupancy)
  return (
    <div className="flex-grow pb-20 px-margin-mobile w-full pt-6">
      <ImageGallery images={images} name={room.name} />
      <h1 className="text-headline-md font-bold text-primary mb-3 mt-6">
        {roomDict.cameraLabel} {room.name}
      </h1>

      <div className="flex flex-col gap-3 border-y border-outline-variant py-4 mb-8">
        <div className="flex items-center gap-2 text-secondary">
          <User className="w-5 h-5" aria-hidden />
          <span className="text-body-md font-semibold">{roomDict.maxGuestsMobile.replace("{capacity}", String(maxCapacity))}</span>
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <CreditCard className="w-5 h-5" aria-hidden />
          <span className="text-body-md font-semibold">
            {roomDict.pricePerPerson.replace("{price}", String(room.price))}
          </span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-3 min-w-0">
        <h2 className="text-[22px] font-semibold text-primary mb-6">{roomDict.title}</h2>
        <BookingForm room={room} occupancy={occupancy} bookedDates={bookedDates} dict={bookingDict} lang={lang} />
      </div>
    </div>
  )
}
