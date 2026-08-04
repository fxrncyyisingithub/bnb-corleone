export type JsonResponse<T> = {
  ok: boolean
  status: number
  /** `null` when the response body was empty or not valid JSON. */
  data: T | null
}

/** POSTs JSON to an internal API route without throwing on error responses. */
export async function postJson<T>(url: string, body: unknown): Promise<JsonResponse<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => null)) as T | null
  return { ok: res.ok, status: res.status, data }
}
