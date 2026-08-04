import { NextResponse } from "next/server"

export function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
  init?: { headers?: Record<string, string> }
) {
  return NextResponse.json({ error: message, ...extra }, { status, ...init })
}

export const INTERNAL_ERROR = "Internal Server Error"
