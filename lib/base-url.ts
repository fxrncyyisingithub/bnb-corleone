export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_URL
  if (explicit) return explicit

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`

  return "http://localhost:3000"
}
