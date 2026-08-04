import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import Negotiator from "negotiator"
import { match } from "@formatjs/intl-localematcher"
import { getDeviceType } from "./lib/detect-device"
import { locales, defaultLocale, isLocale } from "./lib/locales"
import { requireEnv } from "./lib/env"

const LOCALE_COOKIE = "NEXT_LOCALE"

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLang = request.headers.get("accept-language") || ""
  const headers = { "accept-language": acceptLang }
  const languages = new Negotiator({ headers })
    .languages()
    .filter((l) => l !== "*")

  if (languages.length === 0) return defaultLocale

  try {
    return match(languages, [...locales], defaultLocale)
  } catch {
    return defaultLocale
  }
}

function withHeaders(response: NextResponse, deviceType: string) {
  response.headers.set("x-device-type", deviceType)
  return response
}

const PUBLIC_FILE_PATTERN = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get("user-agent") || ""
  const deviceType = getDeviceType(ua)

  // -- Locale detection & redirect --
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/admin") &&
    !PUBLIC_FILE_PATTERN.test(pathname)
  ) {
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
      const locale = getLocale(request)
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname}`
      const response = NextResponse.redirect(url)
      response.cookies.set(LOCALE_COOKIE, locale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      })
      return withHeaders(response, deviceType)
    }
  }

  // -- Supabase auth --
  let supabaseResponse = withHeaders(NextResponse.next({ request }), deviceType)

  const supabase = createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = withHeaders(NextResponse.next({ request }), deviceType)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Auth failures leave `user` null, which fails closed on /admin — log them so an
  // outage is not mistaken for an expired session.
  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error("Supabase auth check failed in proxy:", authError)
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname === "/admin/login" && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/reservations"
    return NextResponse.redirect(url)
  }

  // Set locale cookie on the final response
  const currentLocale =
    locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ||
    defaultLocale
  supabaseResponse.cookies.set(LOCALE_COOKIE, currentLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  })

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
