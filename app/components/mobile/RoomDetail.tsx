import BookingForm from "@/app/components/BookingForm"
import ImageGallery from "@/app/components/ImageGallery"
import { User, CreditCard } from "lucide-react"
import type { Locale } from "@/lib/locales"
import type { OccupancyOption } from "@/lib/rooms"

type Room = {
  id: string
  name: string
  price: number
  capacity: number
}

type Dict = {
  cameraLabel: string
  maxGuestsMobile: string
  pricePerPerson: string
  title: string
}

type BookingDict = {
  adulti: string
  nome: string
  email: string
  dateError: string
  payNow: string
  waiting: string
  nights: string
  adultiLabel: string
  adultSingular: string
  childSingular: string
  childPlural: string
  connectionError: string
  checkoutError: string
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
  room: Room
  occupancy: OccupancyOption[]
  images: string[]
  bookedDates: string[]
  roomDict: Dict
  bookingDict: BookingDict
  lang: Locale
}) {
  const maxCapacity = Math.max(...occupancy.map(o => o.adults))
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
