import BookingForm from "@/app/components/BookingForm"
import ImageGallery from "@/app/components/ImageGallery"
import { PRICE_PER_ADULT } from "@/lib/constants"
import { User, CreditCard } from "lucide-react"

type Room = {
  id: string
  name: string
  price: number
  capacity: number
}

export default function MobileRoomDetail({
  room,
  images,
  bookedDates,
}: {
  room: Room
  images: string[]
  bookedDates: string[]
}) {
  return (
    <div className="flex-grow pb-20 px-margin-mobile w-full pt-6">
      <ImageGallery images={images} name={room.name} />
      <h1 className="text-headline-md font-bold text-primary mb-3 mt-6">
        Camera {room.name}
      </h1>

      <div className="flex flex-col gap-3 border-y border-outline-variant py-4 mb-8">
        <div className="flex items-center gap-2 text-secondary">
          <User className="w-5 h-5" aria-hidden />
          <span className="text-body-md font-semibold">Max {room.capacity} ospiti</span>
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <CreditCard className="w-5 h-5" aria-hidden />
          <span className="text-body-md font-semibold">
            €{PRICE_PER_ADULT} a persona / notte
          </span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-3 min-w-0">
        <h2 className="text-[22px] font-semibold text-primary mb-6">Prenota Ora</h2>
        <BookingForm room={room} bookedDates={bookedDates} />
      </div>
    </div>
  )
}
