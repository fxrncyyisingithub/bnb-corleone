import type { SupabaseClient } from "@supabase/supabase-js"

export type DateRangeInput = {
  roomId: string
  checkIn: string
  checkOut: string
}

export type ReservationNights = {
  check_in: string
  check_out: string
}

/** Nights covered by a stay: check-in included, check-out excluded. */
export function eachNightBetween(checkIn: string | Date, checkOut: string | Date): Date[] {
  const current = new Date(checkIn)
  const end = new Date(checkOut)
  const nights: Date[] = []

  while (current < end) {
    nights.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return nights
}

/** `yyyy-MM-dd` strings for every booked night, as consumed by the booking calendar. */
export function getBookedDates(reservations: ReservationNights[] | null | undefined): string[] {
  return (reservations ?? []).flatMap((reservation) =>
    eachNightBetween(reservation.check_in, reservation.check_out).map(
      (night) => night.toISOString().split("T")[0]
    )
  )
}

export type ReservationFilters = {
  roomId?: string
  /** Inclusive lower bound of the stay window (`dal`). */
  from?: string
  /** Exclusive upper bound of the stay window (`al`). */
  to?: string
}

interface FilterableQuery {
  eq(column: string, value: string): FilterableQuery
  lt(column: string, value: string): FilterableQuery
  gt(column: string, value: string): FilterableQuery
}

/**
 * Applies the admin room/date filters to a reservations query builder.
 * Kept structurally typed: resolving the generic against the Supabase
 * builder types blows up TypeScript's instantiation depth.
 */
export function applyReservationFilters<T extends object>(
  query: T,
  { roomId, from, to }: ReservationFilters
): T {
  let filtered = query as FilterableQuery
  if (roomId) filtered = filtered.eq("room_id", roomId)
  if (to) filtered = filtered.lt("check_in", to)
  if (from) filtered = filtered.gt("check_out", from)
  return filtered as T
}

/** Paid reservations of a room whose stay overlaps the requested range. */
export function findOverlappingReservations(
  supabase: SupabaseClient,
  { roomId, checkIn, checkOut }: DateRangeInput
) {
  return supabase
    .from("reservations")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "paid")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn)
}
