import { beforeEach, describe, expect, it, vi } from "vitest"

const headersMock = vi.hoisted(() => vi.fn())

vi.mock("next/headers", () => ({ headers: headersMock }))

const { getRequestDeviceType, isMobileDevice } = await import("@/lib/device")

function mockHeader(value: string | null) {
  headersMock.mockResolvedValue({ get: () => value })
}

describe("getRequestDeviceType", () => {
  beforeEach(() => headersMock.mockReset())

  it("returns the device type set by the proxy", async () => {
    mockHeader("mobile")
    await expect(getRequestDeviceType()).resolves.toBe("mobile")

    mockHeader("tablet")
    await expect(getRequestDeviceType()).resolves.toBe("tablet")
  })

  it("defaults to desktop when the header is absent", async () => {
    mockHeader(null)
    await expect(getRequestDeviceType()).resolves.toBe("desktop")
  })
})

describe("isMobileDevice", () => {
  it("is true only for mobile", () => {
    expect(isMobileDevice("mobile")).toBe(true)
    expect(isMobileDevice("tablet")).toBe(false)
    expect(isMobileDevice("desktop")).toBe(false)
  })
})
