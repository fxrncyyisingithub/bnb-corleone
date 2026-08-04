import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BookingForm from "@/app/components/BookingForm"
import ImageGallery from "@/app/components/ImageGallery"
import { ROOM_IMAGES, ROOM_OCCUPANCY } from "@/lib/rooms"
import { getRequestDeviceType, isMobileDevice } from "@/lib/device"
import { getDictionary } from "@/lib/dictionary"
import { isLocale } from "@/lib/locales"
import MobileRoomDetail from "@/app/components/mobile/RoomDetail"
import { User, CreditCard } from "lucide-react"

export default async function RoomPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const supabase = await createClient()

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single()

  if (roomError || !room) {
    notFound()
  }

  room.price = Number(room.price)

  const { data: reservations } = await supabase
    .from("reservation_availability")
    .select("check_in, check_out")
    .eq("room_id", room.id)

  const bookedDates: string[] = []
  reservations?.forEach((res) => {
    const current = new Date(res.check_in)
    const end = new Date(res.check_out)
    while (current < end) {
      bookedDates.push(current.toISOString().split("T")[0])
      current.setDate(current.getDate() + 1)
    }
  })

  const images = ROOM_IMAGES[room.slug] ?? ROOM_IMAGES["101"]
  const occupancy = ROOM_OCCUPANCY[room.slug] ?? ROOM_OCCUPANCY["101"]
  const maxCapacity = Math.max(...occupancy.map(o => o.adults))
  const deviceType = await getRequestDeviceType()

  if (isMobileDevice(deviceType)) {
    return <MobileRoomDetail room={room} occupancy={occupancy} images={images} bookedDates={bookedDates} roomDict={dict.camere.roomDetail} bookingDict={dict.booking} lang={lang} />
  }

  return (
    <div className="flex-grow pb-16 px-margin-desktop max-w-container-max mx-auto w-full pt-20">
      <div className="flex flex-row gap-12">
        <div className="flex-1">
          <ImageGallery images={images} name={room.name} />
          <h1 className="text-headline-md font-bold text-primary mb-4">{dict.camere.roomDetail.cameraLabel} {room.name}</h1>
          <div className="flex gap-6 border-y border-outline-variant py-4">
            <div className="flex items-center gap-2 text-secondary">
              <User className="w-5 h-5" aria-hidden />
              <span className="text-body-md font-semibold">{dict.camere.roomDetail.maxGuests.replace("{capacity}", String(maxCapacity))}</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <CreditCard className="w-5 h-5" aria-hidden />
              <span className="text-body-md font-semibold">{dict.camere.roomDetail.pricePerPerson.replace("{price}", String(room.price))}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-lowest border border-outline-variant p-8 rounded self-start sticky top-24">
          <h2 className="text-[24px] font-semibold text-primary mb-6">{dict.camere.roomDetail.title}</h2>
          <BookingForm room={room} occupancy={occupancy} bookedDates={bookedDates} dict={dict.booking} lang={lang} />
        </div>
      </div>
    </div>
  )
}
