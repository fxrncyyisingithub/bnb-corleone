"use client"

import { useState } from "react"
import { DayPicker, DateRange, Matcher } from "react-day-picker"
import { differenceInDays } from "date-fns"
import { it } from "date-fns/locale/it"
import { enUS } from "date-fns/locale/en-US"
import { de } from "date-fns/locale/de"
import "react-day-picker/style.css"
import type { Locale } from "@/lib/locales"
import type { OccupancyOption } from "@/lib/rooms"
import { postJson } from "@/lib/http"

export type BookableRoom = {
  id: string
  name: string
  price: number
  capacity: number
}

export type BookingDict = {
  adulti: string
  nome: string
  email: string
  dateError: string
  payNow: string
  waiting: string
  nights: string
  adultiLabel: string
  adultSingular: string
  childSingular: string
  childPlural: string
  connectionError: string
  checkoutError: string
}

const dateLocales: Record<string, object> = {
  it,
  en: enUS,
  de,
}

export default function BookingForm({ room, occupancy, bookedDates, dict, lang }: { room: BookableRoom; occupancy: OccupancyOption[]; bookedDates: string[]; dict: BookingDict; lang: Locale }) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [selected, setSelected] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabledDays: Matcher[] = [
    ...bookedDates.map((d) => new Date(d)),
    { before: new Date() },
  ]

  const days = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0
  const occ = occupancy[selected]
  const totalPrice = days > 0 ? days * room.price * occ.adults : 0

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!range?.from || !range?.to || days <= 0) {
      setError(dict.dateError)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const data = await postJson<{ url?: string; error?: string }>("/api/checkout", {
        roomId: room.id,
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        adults: occ.adults,
        bambini: occ.bambini,
        name,
        email,
        locale: lang,
      })
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || dict.checkoutError)
        setLoading(false)
      }
    } catch {
      setError(dict.connectionError)
      setLoading(false)
    }
  }

  const dateLocale = dateLocales[lang] ?? it

  const occLabel = (opt: OccupancyOption) => {
    const a = `${opt.adults} ${opt.adults === 1 ? dict.adultSingular : dict.adultiLabel}`
    if (opt.bambini === 0) return a
    return `${a} + ${opt.bambini} ${opt.bambini === 1 ? dict.childSingular : dict.childPlural}`
  }

  return (
    <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-6 w-full min-w-0">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            {dict.adulti}
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          >
            {occupancy.map((opt, i) => (
              <option key={i} value={i}>{occLabel(opt)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            {dict.nome}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            {dict.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          />
        </div>

        {error && <div className="text-error bg-error-container p-3 text-sm">{error}</div>}

        <div className="flex flex-col gap-4 border-t border-outline-variant pt-6 mt-auto">
          <div>
            <div className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
              €{room.price} x {occ.adults} {dict.adultiLabel} {days > 0 ? `x ${days} ${dict.nights}` : ""}
            </div>
            <div className="text-[24px] font-bold text-primary">€{totalPrice}</div>
          </div>
          <button
            type="submit"
            disabled={loading || totalPrice === 0}
            className="bg-primary text-on-primary py-3 px-8 font-semibold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity w-full shrink-0"
          >
            {loading ? dict.waiting : dict.payNow}
          </button>
        </div>
      </div>

      <div className="lg:w-[280px] shrink-0 border border-outline-variant p-1.5 sm:p-2 bg-surface rounded self-start">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={dateLocale}
          disabled={disabledDays}
          min={1}
          className="booking-calendar m-0 w-full"
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleDateString(lang, { weekday: "narrow" }),
          }}
          modifiers={{ booked: bookedDates.map((d) => new Date(d)) }}
          modifiersStyles={{
            booked: { backgroundColor: "#fecaca", color: "#991b1b", textDecoration: "line-through" },
          }}
        />
      </div>
    </form>
  )
}
