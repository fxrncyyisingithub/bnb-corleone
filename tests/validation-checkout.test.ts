import { describe, expect, it } from "vitest"
import { checkoutSchema } from "@/lib/validation/checkout"

function isoInDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const validInput = () => ({
  roomId: "101",
  checkIn: isoInDays(1),
  checkOut: isoInDays(3),
  adults: 2,
  bambini: 1,
  name: "Mario Rossi",
  email: "mario@example.com",
  locale: "it",
})

function errorPaths(input: unknown): string[] {
  const result = checkoutSchema.safeParse(input)
  expect(result.success).toBe(false)
  return result.error!.issues.map((issue) => issue.path.join("."))
}

describe("checkoutSchema", () => {
  it("accepts a valid payload", () => {
    const result = checkoutSchema.safeParse(validInput())
    expect(result.success).toBe(true)
  })

  it("defaults bambini to 0 and locale to it", () => {
    const { bambini, locale, ...rest } = validInput()
    void bambini
    void locale
    const result = checkoutSchema.parse(rest)
    expect(result.bambini).toBe(0)
    expect(result.locale).toBe("it")
  })

  it("trims name and email", () => {
    const result = checkoutSchema.parse({
      ...validInput(),
      name: "  Mario Rossi  ",
      email: "  mario@example.com  ",
    })
    expect(result.name).toBe("Mario Rossi")
    expect(result.email).toBe("mario@example.com")
  })

  it("rejects check-out on or before check-in", () => {
    const sameDay = isoInDays(2)
    expect(errorPaths({ ...validInput(), checkIn: sameDay, checkOut: sameDay })).toContain(
      "checkOut"
    )
    expect(
      errorPaths({ ...validInput(), checkIn: isoInDays(5), checkOut: isoInDays(4) })
    ).toContain("checkOut")
  })

  it("rejects a check-in in the past", () => {
    expect(
      errorPaths({ ...validInput(), checkIn: isoInDays(-1), checkOut: isoInDays(2) })
    ).toContain("checkIn")
  })

  it("accepts a check-in earlier today", () => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const result = checkoutSchema.safeParse({
      ...validInput(),
      checkIn: today.toISOString(),
      checkOut: isoInDays(2),
    })
    expect(result.success).toBe(true)
  })

  it("rejects malformed dates", () => {
    expect(errorPaths({ ...validInput(), checkIn: "2026-01-01" })).toContain("checkIn")
  })

  it("enforces occupancy bounds", () => {
    expect(errorPaths({ ...validInput(), adults: 0 })).toContain("adults")
    expect(errorPaths({ ...validInput(), adults: 11 })).toContain("adults")
    expect(errorPaths({ ...validInput(), adults: 1.5 })).toContain("adults")
    expect(errorPaths({ ...validInput(), bambini: -1 })).toContain("bambini")
    expect(errorPaths({ ...validInput(), bambini: 7 })).toContain("bambini")
  })

  it("enforces guest identity constraints", () => {
    expect(errorPaths({ ...validInput(), roomId: "" })).toContain("roomId")
    expect(errorPaths({ ...validInput(), name: "M" })).toContain("name")
    expect(errorPaths({ ...validInput(), name: "M".repeat(101) })).toContain("name")
    expect(errorPaths({ ...validInput(), email: "not-an-email" })).toContain("email")
    expect(errorPaths({ ...validInput(), locale: "ita" })).toContain("locale")
  })
})
