import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingForm from '@/app/components/BookingForm'
import ImageGallery from '@/app/components/ImageGallery'

const roomImages: Record<string, string[]> = {
  '101': [
    'https://picsum.photos/seed/101a/800/600',
    'https://picsum.photos/seed/101b/800/600',
    'https://picsum.photos/seed/101c/800/600',
  ],
  '102': [
    'https://picsum.photos/seed/102a/800/600',
    'https://picsum.photos/seed/102b/800/600',
    'https://picsum.photos/seed/102c/800/600',
  ],
  '103': [
    'https://picsum.photos/seed/103a/800/600',
    'https://picsum.photos/seed/103b/800/600',
    'https://picsum.photos/seed/103c/800/600',
  ],
  '104': [
    'https://picsum.photos/seed/104a/800/600',
    'https://picsum.photos/seed/104b/800/600',
    'https://picsum.photos/seed/104c/800/600',
  ],
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  let { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (roomError || !room) {
    console.warn("DB Error, falling back to mock room data:", roomError)
    room = {
      id: "mock-id-" + slug,
      slug: slug,
      name: slug,
      description: 'Descrizione temporanea della camera mentre il database non è connesso.',
      price: 40,
      capacity: 2
    }
  }

  const { data: reservations } = await supabase
    .from('reservations')
    .select('check_in, check_out')
    .eq('room_id', room.id)
    .eq('status', 'paid')

  const bookedDates: string[] = []
  reservations?.forEach((res) => {
    let current = new Date(res.check_in)
    const end = new Date(res.check_out)
    while (current < end) {
      bookedDates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  })

  const images = roomImages[room.slug] || roomImages['101']

  return (
    <div className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full pt-10 md:pt-20">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <ImageGallery images={images} name={room.name} />
          <h1 className="text-headline-md font-bold text-primary mb-4">Camera {room.name}</h1>
          <div className="flex gap-6 border-y border-outline-variant py-4">
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined">person</span>
              <span className="text-body-md font-semibold">Max {room.capacity} Ospiti</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-body-md font-semibold">€40 a persona / notte</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded self-start sticky top-24">
          <h2 className="text-[24px] font-semibold text-primary mb-6">Prenota Ora</h2>
          <BookingForm room={room} bookedDates={bookedDates} />
        </div>
      </div>
    </div>
  )
}
