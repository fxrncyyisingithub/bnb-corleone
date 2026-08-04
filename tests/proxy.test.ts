import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const getUserMock = vi.hoisted(() => vi.fn())

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getUser: getUserMock } }),
}))

const { proxy } = await import("@/proxy")

function request(
  path: string,
  init: { headers?: Record<string, string>; cookies?: Record<string, string> } = {}
) {
  const headers = new Headers(init.headers)
  const cookies = Object.entries(init.cookies ?? {})
  if (cookies.length > 0) {
    headers.set("cookie", cookies.map(([k, v]) => `${k}=${v}`).join("; "))
  }
  return new NextRequest(new URL(`https://corleoneguesthouse.com${path}`), { headers })
}

function locationOf(response: Response) {
  return new URL(response.headers.get("location")!).pathname
}

beforeEach(() => {
  getUserMock.mockReset()
  getUserMock.mockResolvedValue({ data: { user: null } })
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.example.com")
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon")
})

describe("locale handling", () => {
  it("redirects an unprefixed path to the negotiated locale", async () => {
    const response = await proxy(request("/camere", { headers: { "accept-language": "de-DE,de;q=0.9" } }))
    expect(response.status).toBe(307)
    expect(locationOf(response)).toBe("/de/camere")
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("de")
  })

  it("prefers the locale cookie over Accept-Language", async () => {
    const response = await proxy(
      request("/camere", {
        headers: { "accept-language": "de-DE,de;q=0.9" },
        cookies: { NEXT_LOCALE: "en" },
      })
    )
    expect(locationOf(response)).toBe("/en/camere")
  })

  it("ignores an unsupported cookie locale", async () => {
    const response = await proxy(
      request("/camere", {
        headers: { "accept-language": "en-US,en;q=0.9" },
        cookies: { NEXT_LOCALE: "fr" },
      })
    )
    expect(locationOf(response)).toBe("/en/camere")
  })

  it("falls back to italian without Accept-Language or for unsupported languages", async () => {
    expect(locationOf(await proxy(request("/")))).toBe("/it")
    const unsupported = await proxy(
      request("/", { headers: { "accept-language": "ja-JP,ja;q=0.9" } })
    )
    expect(locationOf(unsupported)).toBe("/it")
  })

  it("does not redirect already prefixed paths", async () => {
    const response = await proxy(request("/en/camere"))
    expect(response.headers.get("location")).toBeNull()
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("en")
  })

  it("skips locale redirect for api, admin, internal and static paths", async () => {
    for (const path of ["/api/checkout", "/admin/login", "/_next/static/chunk.js", "/logo.png"]) {
      const response = await proxy(request(path))
      const location = response.headers.get("location")
      expect(location === null || !location.includes("/it/")).toBe(true)
    }
  })
})

describe("device detection", () => {
  it("propagates the detected device type as a header", async () => {
    const mobile = await proxy(
      request("/en", { headers: { "user-agent": "Mozilla/5.0 (iPhone) Mobile Safari" } })
    )
    expect(mobile.headers.get("x-device-type")).toBe("mobile")

    const desktop = await proxy(request("/en"))
    expect(desktop.headers.get("x-device-type")).toBe("desktop")
  })
})

describe("admin auth guard", () => {
  it("redirects anonymous users away from admin pages", async () => {
    const response = await proxy(request("/admin/reservations"))
    expect(locationOf(response)).toBe("/admin/login")
  })

  it("lets anonymous users reach the login page", async () => {
    const response = await proxy(request("/admin/login"))
    expect(response.headers.get("location")).toBeNull()
  })

  it("redirects authenticated users from login to reservations", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } })
    const response = await proxy(request("/admin/login"))
    expect(locationOf(response)).toBe("/admin/reservations")
  })

  it("lets authenticated users through to admin pages", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } })
    const response = await proxy(request("/admin/reservations"))
    expect(response.headers.get("location")).toBeNull()
  })
})
