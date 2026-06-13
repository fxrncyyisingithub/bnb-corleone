import { createClient } from "@/lib/supabase/server"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from "date-fns"
import { it } from "date-fns/locale/it"

export default async function OccupancyCalendar({
  month,
  baseParams: bp,
}: {
  month: string
  baseParams: Record<string, string>
}) {
  const filterRoom = bp.room || ""
  const filterDal = bp.dal || ""
  const filterAl = bp.al || ""

  const [year, m] = month.split("-").map(Number)
  const date = new Date(year, m - 1)

  let days: Date[]
  let headerLabel: string

  if (filterDal && filterAl) {
    days = eachDayOfInterval({ start: parseISO(filterDal), end: parseISO(filterAl) })
    headerLabel = `${format(parseISO(filterDal), "d MMM", { locale: it })} - ${format(parseISO(filterAl), "d MMM yyyy", { locale: it })}`
  } else {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    headerLabel = format(date, "MMMM yyyy", { locale: it })
  }

  const rangeStart = days[0]
  const rangeEnd = days[days.length - 1]

  const supabase = await createClient()

  let roomsQuery = supabase.from("rooms").select("id, slug, name").order("name")
  if (filterRoom) roomsQuery = roomsQuery.eq("id", filterRoom)

  let reservationsQuery = supabase
    .from("reservations")
    .select("room_id, check_in, check_out")
    .eq("status", "paid")
    .lte("check_in", format(rangeEnd, "yyyy-MM-dd"))
    .gte("check_out", format(rangeStart, "yyyy-MM-dd"))
  if (filterRoom) reservationsQuery = reservationsQuery.eq("room_id", filterRoom)

  const [{ data: rooms }, { data: reservations }] = await Promise.all([
    roomsQuery,
    reservationsQuery,
  ])

  if (!rooms?.length) return null

  const bookedSet = new Set<string>()
  for (const res of reservations ?? []) {
    const start = new Date(res.check_in)
    const end = new Date(res.check_out)
    const d = new Date(start)
    while (d < end) {
      bookedSet.add(`${res.room_id}_${format(d, "yyyy-MM-dd")}`)
      d.setDate(d.getDate() + 1)
    }
  }

  const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-x-auto mb-8">
      <div className="p-4 border-b border-outline-variant flex items-center justify-between">
        <h2 className="text-label-sm uppercase tracking-widest text-secondary">
          {headerLabel}
        </h2>
        <div className="flex gap-4 text-[10px] uppercase tracking-widest">
          {filterDal && filterAl ? (
            <a
              href={`/admin/reservations?${new URLSearchParams({ ...bp, dal: "", al: "" }).toString()}`}
              className="text-primary hover:opacity-70 transition-opacity"
            >
              Vista mese completo →
            </a>
          ) : (
            <>
              <a
                href={`/admin/reservations?${new URLSearchParams({ ...bp, month: format(new Date(year, m - 2), "yyyy-MM") }).toString()}`}
                className="text-primary hover:opacity-70 transition-opacity"
              >
                ← Mese prec.
              </a>
              <a
                href={`/admin/reservations?${new URLSearchParams({ ...bp, month: format(new Date(year, m), "yyyy-MM") }).toString()}`}
                className="text-primary hover:opacity-70 transition-opacity"
              >
                Mese succ. →
              </a>
            </>
          )}
        </div>
      </div>
      <div className="p-2" style={{ minWidth: days.length * 32 + 120 }}>
        <div className="flex" style={{ marginLeft: 120 }}>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="text-center text-[9px] uppercase tracking-widest text-secondary py-1"
              style={{ width: 32, flexShrink: 0 }}
            >
              <span className="block">{dayNames[getDay(day)]}</span>
              <span className="block font-semibold text-primary">
                {format(day, "d")}
              </span>
            </div>
          ))}
        </div>
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center">
            <div
              className="text-label-sm uppercase tracking-widest text-secondary shrink-0 pr-3 text-right"
              style={{ width: 120 }}
            >
              {room.name}
            </div>
            {days.map((day) => {
              const key = `${room.id}_${format(day, "yyyy-MM-dd")}`
              const booked = bookedSet.has(key)
              return (
                <div
                  key={key}
                  className="border border-surface"
                  style={{ width: 32, height: 28, flexShrink: 0 }}
                >
                  <div
                    className={`w-full h-full ${
                      booked
                        ? "bg-[#fecaca]"
                        : "bg-[#e6f4ea]"
                    }`}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="px-4 pb-3 flex gap-4 text-[10px] text-secondary">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-[#e6f4ea]" />
          Libero
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-[#fecaca]" />
          Occupato
        </div>
      </div>
    </div>
  )
}
