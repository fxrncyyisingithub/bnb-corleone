import { describe, expect, it, vi } from "vitest"
import { CONTACTS } from "@/lib/contacts"

vi.mock("@/immagini/cosa-visitare/due-rocche.png", () => ({ default: { src: "/due-rocche.png" } }))
vi.mock("@/immagini/cosa-visitare/cidma.png", () => ({ default: { src: "/cidma.png" } }))
vi.mock("@/immagini/cosa-visitare/chiesa-madre.png", () => ({ default: { src: "/chiesa-madre.png" } }))

const { POINTS_OF_INTEREST } = await import("@/lib/pois")

describe("CONTACTS", () => {
  it("exposes phone numbers in international format without symbols", () => {
    expect(CONTACTS.length).toBeGreaterThan(0)
    for (const contact of CONTACTS) {
      expect(contact.name.trim()).toBe(contact.name)
      expect(contact.phone).toMatch(/^\d{10,15}$/)
    }
  })
})

describe("POINTS_OF_INTEREST", () => {
  it("has unique ids and complete, linkable entries", () => {
    const ids = POINTS_OF_INTEREST.map((poi) => poi.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const poi of POINTS_OF_INTEREST) {
      expect(poi.title).toBeTruthy()
      expect(poi.category).toBeTruthy()
      expect(poi.description.length).toBeGreaterThan(20)
      expect(poi.image).toBeTruthy()
      expect(poi.link).toMatch(/^https:\/\//)
    }
  })
})
