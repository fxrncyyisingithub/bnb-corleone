import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const limitMock = vi.hoisted(() => vi.fn())
const slidingWindowMock = vi.hoisted(() => vi.fn(() => "sliding-window"))
const redisCtor = vi.hoisted(() => vi.fn())

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(config: unknown) {
      redisCtor(config)
    }
  },
}))

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = slidingWindowMock
    limit = limitMock
  }
  return { Ratelimit }
})

async function importRateLimiter() {
  vi.resetModules()
  return import("@/lib/rate-limiter")
}

function requestWith(headers: Record<string, string>) {
  return new Request("https://example.com/api/checkout", { method: "POST", headers })
}

const REDIS_ENV = {
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "token",
}

describe("checkRateLimit", () => {
  beforeEach(() => {
    limitMock.mockReset()
    redisCtor.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("fails open when Upstash env vars are missing", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "")
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "")
    const { checkRateLimit } = await importRateLimiter()

    await expect(
      checkRateLimit(requestWith({ "x-forwarded-for": "1.2.3.4" }))
    ).resolves.toEqual({ limited: false })
    expect(limitMock).not.toHaveBeenCalled()
  })

  it("allows a request under the limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", REDIS_ENV.UPSTASH_REDIS_REST_URL)
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", REDIS_ENV.UPSTASH_REDIS_REST_TOKEN)
    limitMock.mockResolvedValue({ success: true, remaining: 4, reset: 123 })
    const { checkRateLimit } = await importRateLimiter()

    await expect(
      checkRateLimit(requestWith({ "x-forwarded-for": "1.2.3.4" }))
    ).resolves.toEqual({ limited: false })
    expect(limitMock).toHaveBeenCalledWith("1.2.3.4")
  })

  it("reports a limited request with remaining and reset", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", REDIS_ENV.UPSTASH_REDIS_REST_URL)
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", REDIS_ENV.UPSTASH_REDIS_REST_TOKEN)
    limitMock.mockResolvedValue({ success: false, remaining: 0, reset: 999 })
    const { checkRateLimit } = await importRateLimiter()

    await expect(
      checkRateLimit(requestWith({ "x-real-ip": "5.6.7.8" }))
    ).resolves.toEqual({ limited: true, remaining: 0, reset: 999 })
  })

  it("resolves the client ip by header priority", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", REDIS_ENV.UPSTASH_REDIS_REST_URL)
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", REDIS_ENV.UPSTASH_REDIS_REST_TOKEN)
    limitMock.mockResolvedValue({ success: true, remaining: 4, reset: 1 })
    const { checkRateLimit } = await importRateLimiter()

    await checkRateLimit(
      requestWith({
        "x-forwarded-for": " 9.9.9.9 , 10.0.0.1",
        "x-real-ip": "5.6.7.8",
        "x-vercel-forwarded-for": "7.7.7.7",
      })
    )
    expect(limitMock).toHaveBeenLastCalledWith("9.9.9.9")

    await checkRateLimit(
      requestWith({ "x-real-ip": "5.6.7.8", "x-vercel-forwarded-for": "7.7.7.7" })
    )
    expect(limitMock).toHaveBeenLastCalledWith("5.6.7.8")

    await checkRateLimit(requestWith({ "x-vercel-forwarded-for": "7.7.7.7" }))
    expect(limitMock).toHaveBeenLastCalledWith("7.7.7.7")
  })

  it("fails open when no ip header is present", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", REDIS_ENV.UPSTASH_REDIS_REST_URL)
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", REDIS_ENV.UPSTASH_REDIS_REST_TOKEN)
    const { checkRateLimit } = await importRateLimiter()

    await expect(checkRateLimit(requestWith({}))).resolves.toEqual({ limited: false })
    expect(limitMock).not.toHaveBeenCalled()
  })

  it("fails open when Redis throws", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", REDIS_ENV.UPSTASH_REDIS_REST_URL)
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", REDIS_ENV.UPSTASH_REDIS_REST_TOKEN)
    limitMock.mockImplementation(async () => {
      throw new Error("redis down")
    })
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const { checkRateLimit } = await importRateLimiter()

    await expect(
      checkRateLimit(requestWith({ "x-forwarded-for": "1.2.3.4" }))
    ).resolves.toEqual({ limited: false })
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

describe("getRateLimitHeaders", () => {
  it("builds Retry-After from the reset timestamp", async () => {
    const now = Date.now()
    vi.spyOn(Date, "now").mockReturnValue(now)
    const { getRateLimitHeaders } = await importRateLimiter()

    expect(
      getRateLimitHeaders({ limited: true, remaining: 0, reset: now + 4200 })
    ).toEqual({
      "Retry-After": "5",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(now + 4200),
    })
    vi.restoreAllMocks()
  })
})
