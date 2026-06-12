import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingForm from '@/app/components/BookingForm'
import Image from 'next/image'

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch room details
  let { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (roomError || !room) {
    // Fallback to mock data if DB is not connected yet
    console.warn("DB Error, falling back to mock room data:", roomError)
    room = {
      id: "mock-id-" + slug,
      slug: slug,
      name: slug === 'suite-1' ? 'Suite No. 1' : slug === 'suite-2' ? 'Suite No. 2' : slug === 'superior' ? 'Camera Superior' : 'Attico Panoramico',
      description: 'Descrizione temporanea della camera mentre il database non è connesso.',
      price: 250,
      capacity: 2
    }
  }

  // Fetch paid reservations for this room to get booked dates
  const { data: reservations } = await supabase
    .from('reservations')
    .select('check_in, check_out')
    .eq('room_id', room.id)
    .eq('status', 'paid')

  // Generate list of booked dates
  const bookedDates: string[] = []
  reservations?.forEach((res) => {
    let current = new Date(res.check_in)
    const end = new Date(res.check_out)
    while (current < end) {
      bookedDates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  })

  // Provide hardcoded image for design based on original data
  const images: Record<string, string> = {
    'suite-1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo64f2tdD04CVHNwYNxEj32KeVlnX75Abw0TOzFK90u8ZMmNIWkNYNVG1MJJM8N3OlO9Aosql9v9rpLhDp4QiW5yeoDVbjPbNnXTnGtP3hClhI3nBZmR5iMfHGc0TBL9UL6TqYMAXuZbuLk1TMm1z503cCsnjS4c1_-FxTyIAY4juzjPS9An85Z9vQLJ-gJFaEG3HDJEjwV5G5S_U7Dd9mdj2KKlX4B_6NklNvAoaoB9qn4wjQ93NueRS937DJbuvl0lKdkyjKKmw',
    'suite-2': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCchw9pE3C5PdG9BV-Bz3NieIUgVvaVeVrqygPAwJCgfDmmQ10SFb9KjHfFCnWMgByKNz3NbXQ9_nStArSqQfrofoBF0SVYSGGr1WfyRr9fCgHTXOFWMe0wimp1FP2cSxafV_6nM5rH-uhuMhS8D4t8Rlr-0Jn_3iu2MiWID9ndEC2QYAvFG4xGbSkJrcIGj8OKr7Khf3Rmr08Jcu5HLBJ7LWHy8GYKENcimkR-xT0j9tTM0ul37eCmCe2gk_sf9_pSW3NwQj-HMGo',
    'superior': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nPqA4DNaN5iudLawzJOcSAZvzUMfFJcF_RtQdqKjWlhct_aNH2NcdQwmAITvAv8ZSFOUO0AUweXBtb63FjAOExOQyI4euf3nlAGcEf0vXYifAdYzEhgVBZsSsDb_MPLd_TF7w2vG_K53ZiHxI0Hwe1LxThdGnkdJfDhsMj21a6SVow731KUz8anQVMRkFLFNJ2Wb8z5z2auqHWRsw8nXUv4p0YypPoeYSadzKGpyhSGHB1xseNFl5x7AsY2bj2Cs7NGXOuQXoFM',
    'attico': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHKez_jbCq2VtVPv1x_1yIvrgtuoDZQeHNTBErTvB4RWv1HC5Y3-p_cU0roWwocz2cb_3xF5hElKUl2faaxYkA6FQSK-c3sKxytJoL8gc22trY8AisiYVlUNgFm1q8g5vLC_2CLk7DSYoVxsQWH-gvzegLuFzoCwx2BULiXmD3FGxMIyUsb5UbiS_IgadwMHiBlzQxNTWqsZqBAW_gfcOjQj2TWkMXikXBpt8d0pWvUGylv470JkZXcJwM8j1Ua5D7lGHM5NXyExs'
  }

  return (
    <div className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full pt-10 md:pt-20">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="relative w-full aspect-[4/3] bg-surface-container-high mb-6 overflow-hidden">
            <Image
              src={images[room.slug]}
              alt={room.name}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-headline-md font-bold text-primary mb-4">{room.name}</h1>
          <p className="text-body-lg text-secondary mb-8">{room.description}</p>
          <div className="flex gap-6 border-y border-outline-variant py-4">
             <div className="flex items-center gap-2 text-secondary">
               <span className="material-symbols-outlined">person</span>
               <span className="text-body-md font-semibold">Max {room.capacity} Ospiti</span>
             </div>
             <div className="flex items-center gap-2 text-secondary">
               <span className="material-symbols-outlined">payments</span>
               <span className="text-body-md font-semibold">€{room.price} / Notte</span>
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
