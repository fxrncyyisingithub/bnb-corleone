import { createClient } from "@/lib/supabase/server"

export default async function StatsCards() {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
  const today = now.toISOString().split("T")[0]

  const [revenueRes, activeRes, checkinRes, checkoutRes] = await Promise.all([
    supabase
      .from("reservations")
      .select("total_price")
      .eq("status", "paid")
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("check_in", today),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .eq("check_out", today),
  ])

  const monthlyRevenue = (revenueRes.data ?? []).reduce(
    (sum, r) => sum + Number(r.total_price),
    0
  )
  const activeCount = activeRes.count ?? 0
  const checkinCount = checkinRes.count ?? 0
  const checkoutCount = checkoutRes.count ?? 0

  const months = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ]
  const monthLabel = months[now.getMonth()]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-5">
        <p className="text-label-sm uppercase tracking-widest text-secondary mb-1">
          {monthLabel}
        </p>
        <p className="text-[28px] font-bold text-primary">€{monthlyRevenue.toFixed(0)}</p>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-5">
        <p className="text-label-sm uppercase tracking-widest text-secondary mb-1">
          Prenotazioni attive
        </p>
        <p className="text-[28px] font-bold text-primary">{activeCount}</p>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-5">
        <p className="text-label-sm uppercase tracking-widest text-secondary mb-1">
          Check-in oggi
        </p>
        <p className="text-[28px] font-bold text-primary">{checkinCount}</p>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded p-5">
        <p className="text-label-sm uppercase tracking-widest text-secondary mb-1">
          Check-out oggi
        </p>
        <p className="text-[28px] font-bold text-primary">{checkoutCount}</p>
      </div>
    </div>
  )
}
