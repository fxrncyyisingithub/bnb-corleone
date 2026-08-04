import "server-only"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDictionary } from "@/lib/dictionary"
import { getRequestDeviceType, isMobileDevice } from "@/lib/device"
import { defaultLocale, isLocale, type Locale } from "@/lib/locales"

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export type LocaleParams = Promise<{ lang: string }>

/** Metadata for a locale-prefixed page, falling back to the default locale dictionary. */
export async function localeMetadata(
  params: LocaleParams,
  build: (dict: Dictionary) => Metadata
): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(isLocale(lang) ? lang : defaultLocale)
  return build(dict)
}

/** Validates the locale segment and loads its dictionary. */
export async function resolveLocale(
  params: LocaleParams
): Promise<{ lang: Locale; dict: Dictionary }> {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return { lang, dict: await getDictionary(lang) }
}

/** Same as `resolveLocale`, plus the device branch used by device-aware pages. */
export async function resolveLocalePage(
  params: LocaleParams
): Promise<{ lang: Locale; dict: Dictionary; isMobile: boolean }> {
  const { lang, dict } = await resolveLocale(params)
  const deviceType = await getRequestDeviceType()

  return { lang, dict, isMobile: isMobileDevice(deviceType) }
}
