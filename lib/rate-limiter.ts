import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp
  const vercel = req.headers.get("x-vercel-forwarded-for")
  if (vercel) return vercel
  return "unknown"
}

function createRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    prefix: "ratelimit:checkout",
  })
}

const ratelimit = createRatelimit()

export async function checkRateLimit(
  req: Request
): Promise<
  { limited: false } | { limited: true; remaining: number; reset: number }
> {
  if (!ratelimit) return { limited: false }

  const ip = getIp(req)
  const result = await ratelimit.limit(ip)

  if (!result.success) {
    return { limited: true, remaining: result.remaining, reset: result.reset }
  }

  return { limited: false }
}

export function getRateLimitHeaders(result: {
  limited: true
  remaining: number
  reset: number
}): Record<string, string> {
  return {
    "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  }
}
