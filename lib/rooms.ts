import { createClient } from "@/lib/supabase/server"

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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCo64f2tdD04CVHNwYNxEj32KeVlnX75Abw0TOzFK90u8ZMmNIWkNYNVG1MJJM8N3OlO9Aosql9v9rpLhDp4QiW5yeoDVbjPbNnXTnGtP3hClhI3nBZmR5iMfHGc0TBL9UL6TqYMAXuZbuLk1TMm1z503cCsnjS4c1_-FxTyIAY4juzjPS9An85Z9vQLJ-gJFaEG3HDJEjwV5G5S_U7Dd9mdj2KKlX4B_6NklNvAoaoB9qn4wjQ93NueRS937DJbuvl0lKdkyjKKmw",
  },
  {
    id: "102",
    slug: "102",
    name: "102",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCchw9pE3C5PdG9BV-Bz3NieIUgVvaVeVrqygPAwJCgfDmmQ10SFb9KjHfFCnWMgByKNz3NbXQ9_nStArSqQfrofoBF0SVYSGGr1WfyRr9fCgHTXOFWMe0wimp1FP2cSxafV_6nM5rH-uhuMhS8D4t8Rlr-0Jn_3iu2MiWID9ndEC2QYAvFG4xGbSkJrcIGj8OKr7Khf3Rmr08Jcu5HLBJ7LWHy8GYKENcimkR-xT0j9tTM0ul37eCmCe2gk_sf9_pSW3NwQj-HMGo",
  },
  {
    id: "103",
    slug: "103",
    name: "103",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nPqA4DNaN5iudLawzJOcSAZvzUMfFJcF_RtQdqKjWlhct_aNH2NcdQwmAITvAv8ZSFOUO0AUweXBtb63FjAOExOQyI4euf3nlAGcEf0vXYifAdYzEhgVBZsSsDb_MPLd_TF7w2vG_K53ZiHxI0Hwe1LxThdGnkdJfDhsMj21a6SVow731KUz8anQVMRkFLFNJ2Wb8z5z2auqHWRsw8nXUv4p0YypPoeYSadzKGpyhSGHB1xseNFl5x7AsY2bj2Cs7NGXOuQXoFM",
  },
  {
    id: "104",
    slug: "104",
    name: "104",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHKez_jbCq2VtVPv1x_1yIvrgtuoDZQeHNTBErTvB4RWv1HC5Y3-p_cU0roWwocz2cb_3xF5hElKUl2faaxYkA6FQSK-c3sKxytJoL8gc22trY8AisiYVlUNgFm1q8g5vLC_2CLk7DSYoVxsQWH-gvzegLuFzoCwx2BULiXmD3FGxMIyUsb5UbiS_IgadwMHiBlzQxNTWqsZqBAW_gfcOjQj2TWkMXikXBpt8d0pWvUGylv470JkZXcJwM8j1Ua5D7lGHM5NXyExs",
  },
]

export const ROOM_IMAGES: Record<string, string[]> = {
  "101": [
    "https://picsum.photos/seed/101a/800/600",
    "https://picsum.photos/seed/101b/800/600",
    "https://picsum.photos/seed/101c/800/600",
  ],
  "102": [
    "https://picsum.photos/seed/102a/800/600",
    "https://picsum.photos/seed/102b/800/600",
    "https://picsum.photos/seed/102c/800/600",
  ],
  "103": [
    "https://picsum.photos/seed/103a/800/600",
    "https://picsum.photos/seed/103b/800/600",
    "https://picsum.photos/seed/103c/800/600",
  ],
  "104": [
    "https://picsum.photos/seed/104a/800/600",
    "https://picsum.photos/seed/104b/800/600",
    "https://picsum.photos/seed/104c/800/600",
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
