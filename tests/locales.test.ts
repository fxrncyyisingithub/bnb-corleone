import { describe, expect, it } from "vitest"
import { defaultLocale, isLocale, localeLabels, locales } from "@/lib/locales"

describe("locales", () => {
  it("exposes it/en/de with italian as default", () => {
    expect([...locales]).toEqual(["it", "en", "de"])
    expect(defaultLocale).toBe("it")
  })

  it("has a label for every locale", () => {
    for (const locale of locales) {
      expect(localeLabels[locale]).toBeTruthy()
    }
    expect(Object.keys(localeLabels)).toHaveLength(locales.length)
  })

  it("narrows supported locale strings", () => {
    expect(isLocale("it")).toBe(true)
    expect(isLocale("de")).toBe(true)
    expect(isLocale("fr")).toBe(false)
    expect(isLocale("IT")).toBe(false)
    expect(isLocale("")).toBe(false)
  })
})
