import { describe, expect, it } from "vitest"
import { requireEnv } from "@/lib/env"

describe("requireEnv", () => {
  it("returns the value when set", () => {
    expect(requireEnv("SOME_KEY", "value")).toBe("value")
  })

  it("throws naming the variable when unset or empty", () => {
    expect(() => requireEnv("SOME_KEY", undefined)).toThrow(
      "Missing required environment variable: SOME_KEY"
    )
    expect(() => requireEnv("SOME_KEY", "")).toThrow("SOME_KEY")
  })
})
