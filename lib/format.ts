import { format } from "date-fns"

export const DATE_FORMAT = "dd/MM/yyyy"
export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm"

export function formatDate(value: Date | string): string {
  return format(typeof value === "string" ? new Date(value) : value, DATE_FORMAT)
}

export function formatDateTime(value: Date | string): string {
  return format(typeof value === "string" ? new Date(value) : value, DATE_TIME_FORMAT)
}
