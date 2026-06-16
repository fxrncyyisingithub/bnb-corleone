import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Metadata } from "next"
import CancelButton from "./CancelButton"
import StatsCards from "./StatsCards"
import OccupancyCalendar from "./OccupancyCalendar"

export const metadata: Metadata = {
  title: "Prenotazioni | Corleone Guesthouse",
}

const PAGE_SIZE = 15

export default async function AdminReservations({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; room?: string; month?: string; dal?: string; al?: string }>
}) {
  const sp = await searchParams
  const currentPage = Math.max(1, Number(sp.page) || 1)
  const rangeFrom = (currentPage - 1) * PAGE_SIZE
  const rangeTo = rangeFrom + PAGE_SIZE - 1
  const filterRoom = sp.room || ""
  const filterDal = sp.dal || ""
  const filterAl = sp.al || ""

  const now = new Date()
  const calendarMonth = sp.month || format(now, "yyyy-MM")

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, slug, name")
    .order("name")

  let countQuery = supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })

  let dataQuery = supabase
    .from("reservations")
    .select(`
      *,
      rooms ( name )
    `)
    .order("created_at", { ascending: false })
    .range(rangeFrom, rangeTo)

  if (filterRoom) {
    countQuery = countQuery.eq("room_id", filterRoom)
    dataQuery = dataQuery.eq("room_id", filterRoom)
  }
  if (filterDal && filterAl) {
    countQuery = countQuery.lt("check_in", filterAl).gt("check_out", filterDal)
    dataQuery = dataQuery.lt("check_in", filterAl).gt("check_out", filterDal)
  } else if (filterDal) {
    countQuery = countQuery.gt("check_out", filterDal)
    dataQuery = dataQuery.gt("check_out", filterDal)
  } else if (filterAl) {
    countQuery = countQuery.lt("check_in", filterAl)
    dataQuery = dataQuery.lt("check_in", filterAl)
  }

  const [{ count: total }, { data: reservations, error }] = await Promise.all([
    countQuery,
    dataQuery,
  ])

  const totalPages = Math.ceil((total ?? 0) / PAGE_SIZE)

  const qs = (extra: Record<string, string>) => {
    const params = new URLSearchParams()
    if (filterRoom) params.set("room", filterRoom)
    if (filterDal) params.set("dal", filterDal)
    if (filterAl) params.set("al", filterAl)
    if (sp.month) params.set("month", sp.month)
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v)
      else params.delete(k)
    }
    const s = params.toString()
    return `/admin/reservations${s ? `?${s}` : ""}`
  }

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-10 md:pt-20 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-headline-md font-bold text-primary">Gestione Prenotazioni</h1>
      </div>

      <StatsCards />

      <details className="mb-8 group" {...(filterRoom || filterDal || filterAl || sp.month ? { open: true } : {})}>
        <summary className="text-label-sm uppercase tracking-widest text-secondary cursor-pointer hover:text-primary transition-colors">
          Filtri e calendario
        </summary>
        <div className="mt-4">
          <form method="GET" action="/admin/reservations" className="flex flex-wrap gap-3 items-end mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary">Camera</label>
              <select
                name="room"
                defaultValue={filterRoom}
                className="p-2 border border-outline-variant bg-surface text-primary text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Tutte</option>
                {rooms?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary">Dal</label>
              <input
                type="date"
                name="dal"
                defaultValue={filterDal}
                className="p-2 border border-outline-variant bg-surface text-primary text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary">Al</label>
              <input
                type="date"
                name="al"
                defaultValue={filterAl}
                className="p-2 border border-outline-variant bg-surface text-primary text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-on-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Applica
            </button>
            {(filterRoom || filterDal || filterAl) && (
              <Link
                href="/admin/reservations"
                className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
              >
                Cancella filtri
              </Link>
            )}
            <input type="hidden" name="month" value={calendarMonth} />
          </form>

          <OccupancyCalendar month={calendarMonth} baseParams={
            Object.fromEntries(
              Object.entries({ room: filterRoom, dal: filterDal, al: filterAl })
                .filter(([, v]) => v)
            )
          } />
        </div>
      </details>

      {error && <p className="text-error mb-4">Errore nel caricamento delle prenotazioni.</p>}

      <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-label-sm uppercase tracking-widest text-secondary bg-surface-container-low">
              <th className="p-4">Data</th>
              <th className="p-4">Ospite</th>
              <th className="p-4">Camera</th>
              <th className="p-4">Check-in / Check-out</th>
              <th className="p-4">Importo</th>
              <th className="p-4">Stato</th>
              <th className="p-4">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {reservations?.map((res) => (
              <tr key={res.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="p-4 text-body-md text-primary">
                  {format(new Date(res.created_at), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="p-4">
                  <div className="text-body-md font-semibold text-primary">{res.guest_name}</div>
                  <div className="text-body-sm text-secondary">{res.guest_email}</div>
                </td>
                <td className="p-4 text-body-md text-primary">{res.rooms?.name}</td>
                <td className="p-4 text-body-md text-primary">
                  {format(new Date(res.check_in), "dd/MM/yyyy")} - {format(new Date(res.check_out), "dd/MM/yyyy")}
                </td>
                <td className="p-4 text-body-md text-primary font-semibold">€{res.total_price}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-[#e6f4ea] text-[#137333]">
                    {res.status}
                  </span>
                </td>
                <td className="p-4">
                  {res.status === "paid" && <CancelButton reservationId={res.id} />}
                </td>
              </tr>
            ))}
            {reservations?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-body-md text-secondary">Nessuna prenotazione trovata.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-body-sm text-secondary">
          {total !== null ? `${total} totali` : ""}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-4">
            {currentPage > 1 ? (
              <a
                href={qs({ page: String(currentPage - 1) })}
                className="text-label-sm uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
              >
                ← Precedente
              </a>
            ) : (
              <span className="text-label-sm uppercase tracking-widest text-outline">← Precedente</span>
            )}
            <span className="text-body-sm text-secondary">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
              <a
                href={qs({ page: String(currentPage + 1) })}
                className="text-label-sm uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
              >
                Successiva →
              </a>
            ) : (
              <span className="text-label-sm uppercase tracking-widest text-outline">Successiva →</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
