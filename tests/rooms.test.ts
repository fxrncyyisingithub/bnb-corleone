import { beforeEach, describe, expect, it, vi } from "vitest"

const createClientMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/supabase/server", () => ({ createClient: createClientMock }))

const { ROOM_IMAGES, ROOM_OCCUPANCY, getRooms } = await import("@/lib/rooms")

type RoomRow = {
  id: string
  slug: string
  name: string
  image_url: string | null
}

function mockSupabase(result: { data: RoomRow[] | null; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result)
  const select = vi.fn(() => ({ order }))
  const from = vi.fn(() => ({ select }))
  createClientMock.mockResolvedValue({ from })
  return { from, select, order }
}

describe("room constants", () => {
  it("defines occupancy presets and images for every room", () => {
    expect(Object.keys(ROOM_OCCUPANCY)).toEqual(["101", "102", "103", "104"])
    for (const slug of Object.keys(ROOM_OCCUPANCY)) {
      expect(ROOM_IMAGES[slug].length).toBeGreaterThan(0)
      for (const url of ROOM_IMAGES[slug]) {
        expect(url).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/rooms\//)
        expect(url).toContain(`/rooms/${slug}/`)
      }
    }
  })

  it("keeps occupancy options within the room capacity", () => {
    for (const options of Object.values(ROOM_OCCUPANCY)) {
      for (const option of options) {
        expect(option.adults).toBeGreaterThanOrEqual(1)
        expect(option.bambini).toBeGreaterThanOrEqual(0)
      }
    }
  })
})

describe("getRooms", () => {
  beforeEach(() => createClientMock.mockReset())

  it("maps rows from Supabase", async () => {
    mockSupabase({
      data: [
        { id: "a", slug: "101", name: "101", image_url: "https://cdn.example.com/a.jpg" },
      ],
      error: null,
    })

    await expect(getRooms()).resolves.toEqual([
      { id: "a", slug: "101", name: "101", image: "https://cdn.example.com/a.jpg" },
    ])
  })

  it("queries the rooms table ordered by name", async () => {
    const { from, select, order } = mockSupabase({ data: [], error: null })
    await getRooms()
    expect(from).toHaveBeenCalledWith("rooms")
    expect(select).toHaveBeenCalledWith("id, slug, name, image_url")
    expect(order).toHaveBeenCalledWith("name")
  })

  it("falls back to the bundled image when image_url is null", async () => {
    mockSupabase({
      data: [{ id: "a", slug: "103", name: "103", image_url: null }],
      error: null,
    })

    const rooms = await getRooms()
    expect(rooms[0].image).toContain("/rooms/103/head.jpeg")
  })

  it("falls back to the first room image for unknown slugs", async () => {
    mockSupabase({
      data: [{ id: "a", slug: "999", name: "999", image_url: null }],
      error: null,
    })

    const rooms = await getRooms()
    expect(rooms[0].image).toContain("/rooms/101/head.jpeg")
  })

  it("returns the fallback rooms on query error or empty result", async () => {
    mockSupabase({ data: null, error: new Error("boom") })
    const onError = await getRooms()
    expect(onError.map((room) => room.slug)).toEqual(["101", "102", "103", "104"])

    mockSupabase({ data: [], error: null })
    const onEmpty = await getRooms()
    expect(onEmpty).toEqual(onError)
  })
})
