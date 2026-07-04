<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Corleone Guesthouse — repo guide

## Regole per agenti AI

- Quando comunichi con altri agenti, DEVI identificarti come agente (es. "Dev 🛠️, Agente Dev") e MAI impersonare Francy.
- Nelle comunicazioni cross-agent, usa il tuo nome agente + emoji + ruolo.

## Framework quirks (Next.js 16)

- **`proxy.ts` replaces `middleware.ts`** — request interception lives in `proxy.ts` (root), NOT `middleware.ts`. Export `export async function proxy(request: NextRequest)`. Using `middleware.ts` will fail silently.
- **async `params`** — route handler and page props use `params: Promise<{...}>`, must be `await`ed before use.
- **`createServerClient` from `@supabase/ssr`** — `cookies()` is async: `const cookieStore = await cookies()`.

## Supabase clients — three variants

| Module | When to use | Bypasses RLS? |
|--------|-------------|---------------|
| `lib/supabase/server.ts` | Server Components, Route Handlers (read-side, e.g. room listing, booking check) | No (anon key) |
| `lib/supabase/client.ts` | Client components (browser-side auth, e.g. admin login form) | No (anon key) |
| `lib/supabase/admin.ts` | Webhooks, admin API routes (server-side writes) | Yes (service_role key) |

**Rule of thumb**: use `admin` client for DB inserts/updates from API routes (`/api/webhook`, `/api/admin/*`). Use `server` client for reads.

## Project structure

```
proxy.ts              ← locale redirect, device detection, admin auth guard
app/
  [lang]/             ← public pages (locale-prefixed)
  admin/              ← admin panel (no locale prefix, Italian)
  api/
    checkout/         ← creates Stripe Checkout Session
    webhook/          ← Stripe event handler (inserts reservation, sends email)
    admin/
      cancel-reservation/  ← refund + set status=cancelled
  components/
    mobile/           ← dedicated UI rendered when x-device-type=mobile
lib/
  supabase/           ← client factories (server, client, admin)
  rooms.ts            ← room images, occupancy presets, getRooms()
  email.ts            ← Resend email templates (fire-and-forget)
  validation/         ← Zod schemas
dictionaries/         ← {it,en,de}.json (i18n via lib/dictionary.ts)
```

## Device-aware rendering

`proxy.ts` sets `x-device-type` (mobile/tablet/desktop) via User-Agent parsing.
Server components read it with `getRequestDeviceType()` from `lib/device.ts`.
Public pages branch conditionally: `isMobileDevice() ? <MobileComponent> : <DesktopComponent>`.
Data logic lives in `lib/` — components only handle rendering.

## Booking flow

1. **Client** → `BookingForm` (calendar + occupancy dropdown) → `POST /api/checkout`
2. **`/api/checkout`** → Zod validation, availability check (against `status=paid` reservations), create Stripe Session → return `{ url }`
3. **Stripe** → user pays → fires `checkout.session.completed` to `/api/webhook`
4. **`/api/webhook`** → verify signature, dedup by `stripe_session_id`, re-check overlap (auto-refund if conflict), insert reservation, fire-and-forget emails
5. **`/[lang]/success/[session_id]`** → retrieve Stripe session, verify `payment_status=paid`, show confirmation

## Admin panel

- Login at `/admin/login` (Supabase Auth email/password).
- `/admin/reservations` is guarded by `proxy.ts` (redirects to `/admin/login` if no session).
- Auth check is duplicated in the page component as defense-in-depth.
- Admin routes are NOT locale-prefixed (forced to Italian).
- Cancel/reservation refund: `POST /api/admin/cancel-reservation` with `{ reservationId }`.

## Email (Resend)

- `sendGuestConfirmation` and `sendStaffNotification` are fire-and-forget (prefixed with `void`).
- `RESEND_API_KEY`, `STAFF_EMAIL` env vars.
- Dev mode only sends to account owner (FROM is `onboarding@resend.dev`).
- `STAFF_EMAIL` supports comma-separated recipients.

## Room images

- Hosted on Supabase Storage bucket `rooms` at `ROOM_IMAGE_BASE`. URLs are hardcoded in `lib/rooms.ts`.
- `remotePatterns: [{ hostname: "*.supabase.co" }]` in `next.config.ts`.

## BotId (anti-bot)

- `withBotId()` wrapper in `next.config.ts` handles protection at the server level.
- **Do NOT add `BotIdClient` component in layouts** — it's redundant and loads JS on every page.

## Rate limiter (checkout)

`lib/rate-limiter.ts` uses `@upstash/ratelimit` with sliding window (5 req / 10s per IP).
Centralized in Redis via `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`.
**Safe fallback**: if env vars are missing, `checkRateLimit()` returns `{ limited: false }` — payments never blocked.
IP extracted from `x-forwarded-for` → `x-real-ip` → `x-vercel-forwarded-for` → `"unknown"`.

## Commands

```sh
npm run dev      # local dev (needs .env.local)
npm run build    # typecheck + production build
npm run lint     # ESLint
```

## Key env vars (`.env.local`)

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_URL`, `RESEND_API_KEY`, `STAFF_EMAIL`,
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## DB schema (`supabase/schema.sql`)

- `rooms` (id, slug, name, description, price DECIMAL, capacity, image_url, created_at)
- `reservations` (id, room_id FK, check_in, check_out, guests, total_price, status CHECK pending/paid/cancelled, guest_name, guest_email, stripe_session_id UNIQUE, created_at)
- GIST exclusion constraint `no_overlapping_reservation` on overlapping daterange WHERE status=paid.
- Seed SQL inserts 4 rooms at €40/adult/night.

**`room.price` is DECIMAL** — PostgREST returns it as a string. Cast with `Number()` in server components before passing to typed client props.

## RLS policies

- Rooms: SELECT public, ALL for authenticated.
- Reservations: SELECT only `status=paid` for public, ALL for authenticated.
- Service role (webhook) bypasses RLS entirely.
