"use client"

import { useState } from "react"
import { DayPicker, DateRange, Matcher } from "react-day-picker"
import { differenceInDays } from "date-fns"
import { it } from "date-fns/locale"
import "react-day-picker/style.css"
import { PRICE_PER_ADULT } from "@/lib/constants"

type Room = {
  id: string
  name: string
  price: number
  capacity: number
}

export default function BookingForm({ room, bookedDates }: { room: Room; bookedDates: string[] }) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [adults, setAdults] = useState(1)
  const [bambini, setBambini] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabledDays: Matcher[] = [
    ...bookedDates.map((d) => new Date(d)),
    { before: new Date() },
  ]

  const days = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0
  const totalPrice = days > 0 ? days * PRICE_PER_ADULT * adults : 0

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!range?.from || !range?.to || days <= 0) {
      setError("Seleziona date valide per il check-in e check-out (almeno 1 notte)")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          adults,
          bambini,
          name,
          email,
          phone,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Errore durante il checkout")
        setLoading(false)
      }
    } catch {
      setError("Errore di connessione")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCheckout} className="flex flex-col gap-6 w-full min-w-0">
      <div className="w-full min-w-0 border border-outline-variant p-2 sm:p-4 bg-surface rounded">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={it}
          disabled={disabledDays}
          min={1}
          className="booking-calendar m-0 w-full"
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleDateString("it-IT", { weekday: "narrow" }),
          }}
          modifiersStyles={{
            selected: { backgroundColor: "#1d1d1d", color: "#fff" },
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            Adulti
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          >
            {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            Bambini
          </label>
          <select
            value={bambini}
            onChange={(e) => setBambini(Number(e.target.value))}
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          >
            {Array.from({ length: 6 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            Nome e Cognome
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
            Telefono
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
          Email
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

      <div className="flex flex-col gap-4 border-t border-outline-variant pt-6 mt-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-label-sm font-semibold text-secondary uppercase tracking-widest">
            €{PRICE_PER_ADULT} x {adults} adulti {days > 0 ? `x ${days} notti` : ""}
          </div>
          <div className="text-[24px] font-bold text-primary">€{totalPrice}</div>
          {bambini > 0 && (
            <div className="text-label-sm text-secondary">
              {bambini} bambino{bambini > 1 ? "ni" : ""} gratis
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || totalPrice === 0}
          className="bg-primary text-on-primary py-3 px-8 font-semibold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity w-full sm:w-auto shrink-0"
        >
          {loading ? "Attendere..." : "Paga Ora"}
        </button>
      </div>
    </form>
  )
}
