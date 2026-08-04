import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

const { getDictionary } = await import("@/lib/dictionary")
const { locales } = await import("@/lib/locales")

describe("getDictionary", () => {
  it("loads a dictionary for every locale", async () => {
    for (const locale of locales) {
      const dictionary = await getDictionary(locale)
      expect(dictionary).toBeTypeOf("object")
      expect(Object.keys(dictionary).length).toBeGreaterThan(0)
    }
  })

  it("keeps the same top-level keys across locales", async () => {
    const [it, en, de] = await Promise.all(locales.map((locale) => getDictionary(locale)))
    const keys = Object.keys(it).sort()
    expect(Object.keys(en).sort()).toEqual(keys)
    expect(Object.keys(de).sort()).toEqual(keys)
  })
})
