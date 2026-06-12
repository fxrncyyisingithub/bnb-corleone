import "server-only"
import type { Locale } from "@/lib/locales"

type Dictionary = typeof import("@/dictionaries/it.json")

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("@/dictionaries/it.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  de: () => import("@/dictionaries/de.json").then((m) => m.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]()
