# Corleone Guesthouse

Sito web di prenotazione camere per una guesthouse a Corleone (Sicilia), con checkout Stripe, pannello admin Supabase, email Resend, supporto multilingua (IT/EN/DE) e UI device-aware.

**Deploy live**: [Corleone Guesthouse](https://corleoneguesthouse.com)  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL + Auth + Storage) · Stripe Checkout · Resend · Upstash Redis

---

## ✨ Funzionalità principali

| Area | Dettagli |
|------|----------|
| **Prenotazioni** | Calendar + occupancy picker → disponibilità real-time → Stripe Checkout → webhook `checkout.session.completed` → insert DB + email conferma ospite + notifica staff |
| **Pagamenti** | Stripe Checkout (test/live), webhook idempotente, rimborso automatico in caso di conflitto date (exclusion constraint DB) |
| **Admin panel** | `/admin/login` (Supabase Auth email/password) · `/admin/reservations` lista + rimborso/cancellazione (chiamata API dedicata) |
| **Multilingua** | IT / EN / DE con dizionari JSON + `Accept-Language` auto-detect + cookie persistente |
| **Device-aware** | User-Agent parsing nel proxy → header `x-device-type` → branch rendering mobile/desktop senza duplicare logica dati |
| **Anti-bot** | BotId integrato a livello server (`withBotId()` in `next.config.ts`) |
| **Rate limiting** | Sliding window 5 req/10s per IP su `/api/checkout` (Upstash Redis, fallback safe se mancano env) |
| **Email** | Resend fire-and-forget (guest confirmation + staff notification), supporto multi-recipient via `STAFF_EMAIL` |
| **Immagini camere** | Supabase Storage bucket `rooms`, CDN via `*.supabase.co` |
| **SEO/Analytics** | Vercel Analytics, sitemap generato, meta tags per locale |

---

## 🏗 Architettura

```
proxy.ts                    # Middleware: locale redirect, device detection, admin auth guard
app/
  [lang]/                   # Pagine pubbliche (prefisso locale)
    page.tsx                # Home
    camere/                 # Lista + dettaglio camera
    success/[session_id]/   # Conferma post-pagamento
    contatti/               # WhatsApp CTA
    cosa-visitare/          # POI (Cascate Due Rocche, CIDMA, Chiesa Madre)
    location/               # Indirizzo + mappa
  admin/                    # Pannello admin (solo IT, no locale prefix)
    login/page.tsx          # Supabase Auth
    reservations/page.tsx   # Lista prenotazioni + rimborso
  api/
    checkout/route.ts       # Valida → check disponibilità → crea Stripe Session
    webhook/route.ts        # Verify sig → dedup → re-check overlap → insert reservation → email
    admin/cancel-reservation/route.ts  # Refund Stripe + status=cancelled
  components/
    mobile/                 # UI alternativa per smartphone (stessi dati)
    BookingForm.tsx         # Calendar + occupancy + submit
    RoomCard.tsx            # Desktop card camera
    Header.tsx / Footer.tsx # Nav + language switcher
    ...
lib/
  supabase/
    server.ts               # Server Component reads (RLS anon)
    client.ts               # Client Component (browser auth)
    admin.ts                # Service role (webhook, admin API writes)
  rooms.ts                  # Room data, images, occupancy presets, getRooms()
  email.ts                  # Resend templates (void fire-and-forget)
  validation/               # Zod schemas (booking, webhook, admin)
  rate-limiter.ts           # Upstash sliding window
  detect-device.ts          # UA parsing → mobile/tablet/desktop
  device.ts                 # getRequestDeviceType() per Server Components
  dictionary.ts             # loadDictionary(locale) → typed dict
  locales.ts                # [it,en,de], defaultLocale, isLocale
  pois.ts                   # Points of Interest data
  contacts.ts               # WhatsApp number, address
  stripe.ts                 # Stripe client factory
  constants.ts              # Room price, currency, etc.
dictionaries/
  it.json / en.json / de.json
supabase/
  schema.sql                # Tables, RLS, GIST exclusion constraint, seed
```

---

## 🔐 Supabase — tre client

| Modulo | Uso | Chiave | Bypass RLS |
|--------|-----|--------|------------|
| `lib/supabase/server.ts` | Server Components, Route Handlers (read) | `anon` | ❌ |
| `lib/supabase/client.ts` | Client Components (browser auth) | `anon` | ❌ |
| `lib/supabase/admin.ts` | Webhook, admin API (write) | `service_role` | ✅ |

> **Regola**: `admin` client per insert/update da `/api/webhook` e `/api/admin/*`. `server` client per reads pubbliche.

---

## 🗄 Database (PostgreSQL + RLS)

**Tabelle**:

```sql
rooms (
  id UUID PK,
  slug TEXT UNIQUE,
  name, description,
  price DECIMAL,      -- €/persona/notte (cast a Number() in server components)
  capacity INT,
  image_url TEXT
)

reservations (
  id UUID PK,
  room_id FK → rooms,
  check_in DATE, check_out DATE,
  guests INT,
  total_price DECIMAL,
  status CHECK ('pending','paid','cancelled'),
  guest_name, guest_email, guest_phone,
  stripe_session_id UNIQUE
)
```

**Exclusion constraint** (GIST btree) — impedisce overlap date per prenotazioni `paid`:

```sql
EXCLUDE USING GIST (
  room_id WITH =,
  daterange(check_in, check_out, '[]') WITH &&
) WHERE (status = 'paid')
```

**RLS**:
- `rooms`: SELECT public, ALL authenticated
- `reservations`: SELECT solo `status=paid` public, ALL authenticated
- `service_role` bypassa RLS (webhook)

**Seed**: 4 camere (101–104) a €40/persona/notte, capacità 2–3.

---

## 🚀 Setup locale

```bash
# 1. Clona e installa
git clone https://github.com/fxrncyyisingithub/bnb-corleone
cd bnb-corleone
pnpm install            # oppure: bun install (bun.lock è gitignorato)

# 2. Variabili d'ambiente
cp .env.example .env.local
# Compila .env.local (vedi sezione sotto)

# 3. Database
# Esegui supabase/schema.sql nell'SQL Editor del progetto Supabase

# 4. Webhook Stripe (dev)
stripe listen --forward-to http://localhost:3000/api/webhook
# Copia whsec_... in STRIPE_WEBHOOK_SECRET

# 5. Avvia
pnpm run dev            # oppure: bun run dev
```

Apri [http://localhost:3000](http://localhost:3000).

> `pnpm-lock.yaml` è l'unico lockfile tracciato ed è la fonte di verità per i
> build su Vercel: dopo aver aggiunto o aggiornato una dipendenza rigenera il
> lockfile con `pnpm install` e committalo.

---

## ⚙ Variabili d'ambiente (`.env.local`)

```bash
# App
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase (Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Stripe (Developers → API keys)
STRIPE_SECRET_KEY=sk_tes...n
# Resend (dashboard → API Keys)
RESEND_API_KEY=re_.......com   # virgola per multi-recipient

# Upstash Redis (per rate limiter checkout, opzionale ma consigliato in prod)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=***
```

> **Nota**: `room.price` è `DECIMAL` in DB → PostgREST lo restituisce come stringa. Cast con `Number()` prima di passare a component tipizzati.

---

## 🛠 Comandi

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Dev server con Turbopack |
| `npm run build` | Typecheck + build produzione |
| `npm run start` | Production server |
| `npm run lint` | ESLint (Next.js config) |

---

## 📦 Deploy (Vercel consigliato)

1. **Importa repo** su Vercel
2. **Environment Variables** → aggiungi tutte le variabili sopra
3. **Stripe Webhook** → dashboard → `https://tuodominio.com/api/webhook` · evento `checkout.session.completed`
4. **Upstash Redis** → crea database → copia `REST_URL` e `REST_TOKEN` in env Vercel
5. **Resend** → verifica dominio per cambiare mittente da `onboarding@resend.dev` a `noreply@tuodominio.com`
6. **Supabase Storage** → bucket `rooms` pubblico → carica immagini camere (path: `rooms/101/head.jpeg`, ecc.)

---

## 🧪 Testing & Debug

```bash
# Typecheck solo
npx tsc --noEmit

# Lint
npm run lint

# Controlla build locale
npm run build && npm run start
```

**Log utili**:
- Webhook Stripe: `stripe listen --print-json` (dev)
- Rate limiter: imposta `UPSTASH_REDIS_REST_URL` per attivarlo
- Email Resend: in dev vanno solo all'account owner (FROM `onboarding@resend.dev`)

---

## 📱 Device-aware rendering

`proxy.ts` parse User-Agent → setta header `x-device-type` (`mobile`/`tablet`/`desktop`).

Server Components leggono con:

```ts
import { getRequestDeviceType } from '@/lib/device'

export default async function Page() {
  const isMobile = getRequestDeviceType() === 'mobile'
  return isMobile ? <MobileComponent /> : <DesktopComponent />
}
```

Dati (camere, POI, contatti) vivono in `lib/` — **zero duplicazione** tra mobile/desktop.

---

## 🌍 Internazionalizzazione

- **Dizionari**: `dictionaries/{it,en,de}.json` (tipizzati via `lib/dictionary.ts`)
- **Auto-detect**: `Accept-Language` → match su `locales` → cookie `NEXT_LOCALE` (1 anno)
- **Switcher**: `Header.tsx` → POST a `/[lang]` + cookie update
- **Admin**: forzato italiano, no locale prefix

---

## 🔒 Sicurezza

| Misura | Implementazione |
|--------|-----------------|
| Anti-bot | BotId (`withBotId()` in `next.config.ts`) |
| Rate limit | Upstash sliding window 5 req/10s per IP (`/api/checkout`) |
| Auth admin | Supabase Auth + `proxy.ts` guard (`/admin/*` → redirect login) |
| Webhook verify | `stripe.webhooks.constructEvent` + signature check |
| Idempotenza | `stripe_session_id` UNIQUE + dedup check in webhook |
| DP overlap | GIST exclusion constraint DB (auto-rimborso webhook se conflitto) |
| RLS | Supabase Row Level Security su tutte le tabelle |

---

## 📁 Struttura file chiave

```
bnb-corleone/
├── proxy.ts                    # Middleware Next.js 16
├── next.config.ts              # BotId, image remotePatterns, turbopack
├── supabase/schema.sql         # DDL + RLS + seed
├── .env.example                # Template variabili
├── app/
│   ├── layout.tsx              # Root layout + analytics
│   ├── globals.css             # Tailwind v4 + custom
│   ├── [lang]/
│   │   ├── layout.tsx          # Locale wrapper + font
│   │   ├── page.tsx            # Home
│   │   ├── camere/
│   │   │   ├── page.tsx        # Lista camere
│   │   │   └── [slug]/page.tsx # Dettaglio + BookingForm
│   │   ├── success/[session_id]/page.tsx
│   │   ├── contatti/page.tsx
│   │   ├── cosa-visitare/page.tsx
│   │   └── location/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── reservations/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts
│   │   ├── webhook/route.ts
│   │   └── admin/cancel-reservation/route.ts
│   └── components/
│       ├── mobile/             # Mobile-only variants
│       ├── BookingForm.tsx
│       ├── RoomCard.tsx
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LanguageSwitcher.tsx
├── lib/
│   ├── supabase/{server,client,admin}.ts
│   ├── rooms.ts
│   ├── email.ts
│   ├── validation/{booking,webhook,admin}.ts
│   ├── rate-limiter.ts
│   ├── detect-device.ts
│   ├── device.ts
│   ├── dictionary.ts
│   ├── locales.ts
│   ├── pois.ts
│   ├── contacts.ts
│   ├── stripe.ts
│   └── constants.ts
└── dictionaries/
    ├── it.json
    ├── en.json
    └── de.json
```

---

## 🐛 Known issues / TODO

- [ ] Test E2E (Playwright) per flusso prenotazione completo
- [ ] Sitemap.xml generato automaticamente
- [ ] OpenGraph images per locale
- [ ] Dark mode toggle (tailwind dark:class)
- [ ] PWA manifest + service worker per offline
- [ ] Logging strutturato (Sentry/Logtail)

---

## 📄 Licenza

MIT — usa, modifica, deploya liberamente.

---

## 🤝 Crediti

Sviluppato da [fxrncyyisingithub](https://github.com/fxrncyyisingithub) per **Corleone Guesthouse**.

**Stack**: Next.js · Supabase · Stripe · Resend · Tailwind · TypeScript · Vercel
