"use client"

import { useState } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { format, differenceInDays } from 'date-fns'
import { it } from 'date-fns/locale'
import "react-day-picker/style.css"

type Room = {
  id: string
  name: string
  price: number
  capacity: number
}

export default function BookingForm({ room, bookedDates }: { room: Room, bookedDates: string[] }) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabledDays = bookedDates.map(d => new Date(d))
  // Also disable past dates
  disabledDays.push({ before: new Date() } as any)

  const days = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0
  const totalPrice = days > 0 ? days * room.price : 0

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!range?.from || !range?.to || days <= 0) {
      setError("Seleziona date valide per il check-in e check-out (almeno 1 notte)")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
          name,
          email,
          phone,
          totalPrice
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Errore durante il checkout")
        setLoading(false)
      }
    } catch (err) {
      setError("Errore di connessione")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCheckout} className="flex flex-col gap-6">
      <div className="flex justify-center border border-outline-variant p-4 bg-surface rounded">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={it}
          disabled={disabledDays}
          min={1}
          className="m-0"
          modifiersStyles={{
            selected: { backgroundColor: '#1d1d1d', color: '#fff' }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Ospiti</label>
          <select 
            value={guests} 
            onChange={e => setGuests(Number(e.target.value))}
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
          >
            {Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Ospite' : 'Ospiti'}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Telefono</label>
          <input 
            type="tel" 
            value={phone} onChange={e => setPhone(e.target.value)} required
            className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Nome e Cognome</label>
        <input 
          type="text" 
          value={name} onChange={e => setName(e.target.value)} required
          className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Email</label>
        <input 
          type="email" 
          value={email} onChange={e => setEmail(e.target.value)} required
          className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
        />
      </div>

      {error && <div className="text-error bg-error-container p-3 text-sm">{error}</div>}

      <div className="flex items-center justify-between border-t border-outline-variant pt-6 mt-2">
        <div>
          <div className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Totale Soggiorno</div>
          <div className="text-[24px] font-bold text-primary">€{totalPrice}</div>
        </div>
        <button 
          type="submit" 
          disabled={loading || totalPrice === 0}
          className="bg-primary text-on-primary py-3 px-8 font-semibold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Attendere...' : 'Paga Ora'}
        </button>
      </div>
    </form>
  )
}
