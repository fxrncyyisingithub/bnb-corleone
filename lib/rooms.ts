import { createClient } from "@/lib/supabase/server"

const ROOM_IMAGE_BASE = "https://ntwzgepxzdtndrtcmidd.supabase.co/storage/v1/object/public/rooms"

export type RoomListItem = {
  id: string
  slug: string
  name: string
  image: string
}

const FALLBACK_ROOMS: RoomListItem[] = [
  {
    id: "101",
    slug: "101",
    name: "101",
    image: `${ROOM_IMAGE_BASE}/101/head.jpeg`,
  },
  {
    id: "102",
    slug: "102",
    name: "102",
    image: `${ROOM_IMAGE_BASE}/102/head.jpeg`,
  },
  {
    id: "103",
    slug: "103",
    name: "103",
    image: `${ROOM_IMAGE_BASE}/103/head.jpeg`,
  },
  {
    id: "104",
    slug: "104",
    name: "104",
    image: `${ROOM_IMAGE_BASE}/104/head.jpeg`,
  },
]

export type OccupancyOption = {
  adults: number
  bambini: number
}

export const ROOM_OCCUPANCY: Record<string, OccupancyOption[]> = {
  "101": [
    { adults: 2, bambini: 1 },
    { adults: 1, bambini: 2 },
  ],
  "102": [
    { adults: 3, bambini: 0 },
    { adults: 2, bambini: 1 },
    { adults: 1, bambini: 2 },
  ],
  "103": [
    { adults: 3, bambini: 0 },
    { adults: 2, bambini: 1 },
    { adults: 1, bambini: 2 },
  ],
  "104": [
    { adults: 2, bambini: 0 },
    { adults: 1, bambini: 1 },
  ],
}

export function maxAdults(occupancy: OccupancyOption[]): number {
  return Math.max(...occupancy.map((option) => option.adults))
}

const img = (slug: string, file: string) => `${ROOM_IMAGE_BASE}/${slug}/${file}`

export const ROOM_IMAGES: Record<string, string[]> = {
  "101": [
    img("101", "head.jpeg"),
    img("101", "bagno.jpeg"),
    img("101", "bagno2.jpeg"),
    img("101", "whatsapp_image_2026-06-12_at_21.41.05.jpeg"),
  ],
  "102": [
    img("102", "head.jpeg"),
    img("102", "bagno.jpeg"),
    img("102", "whatsapp_image_2026-06-12_at_21.41.06.jpeg"),
    img("102", "whatsapp_image_2026-06-12_at_21.41.07_3.jpeg"),
  ],
  "103": [
    img("103", "head.jpeg"),
    img("103", "whatsapp_image_2026-06-12_at_21.41.06_1.jpeg"),
    img("103", "whatsapp_image_2026-06-12_at_21.41.07.jpeg"),
    img("103", "whatsapp_image_2026-06-12_at_21.41.09.jpeg"),
  ],
  "104": [
    img("104", "head.jpeg"),
    img("104", "whatsapp_image_2026-06-12_at_21.41.07_1.jpeg"),
    img("104", "whatsapp_image_2026-06-12_at_21.41.08_2.jpeg"),
    img("104", "312331110.png"),
  ],
}

const FALLBACK_IMAGES = FALLBACK_ROOMS.map((room) => ({
  slug: room.slug,
  image: room.image,
}))

export async function getRooms(): Promise<RoomListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("rooms")
    .select("id, slug, name, image_url")
    .order("name")

  if (error || !data?.length) {
    return FALLBACK_ROOMS
  }

  return data.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    image:
      room.image_url ??
      FALLBACK_IMAGES.find((item) => item.slug === room.slug)?.image ??
      FALLBACK_ROOMS[0].image,
  }))
}
