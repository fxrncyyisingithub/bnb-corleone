# Corleone Guesthouse

Sito web per la prenotazione di camere con pagamento Stripe, pannello admin e supporto multilingua (IT/EN/DE).

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Linguaggio** | TypeScript, React 19 |
| **Stile** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (admin) |
| **Pagamenti** | Stripe Checkout + Webhooks |
| **Email** | Resend |
| **Anti-bot** | BotId |
| **Date picker** | react-day-picker |

## Prerequisiti

- Node.js 20+
- Un progetto Supabase (gratuito)
- Un account Stripe (test mode)
- Un account Resend (per le email)

## Setup

```bash
# 1. Clona e installa
git clone <repo>
cd bnb-corleone
npm install

# 2. Configura le variabili d'ambiente
cp .env.example .env.local
```

Compila `.env.local` con le tue credenziali (vedi sezione **Variabili d'ambiente**).

```bash
# 3. Avvia il dev server
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

### Database

Esegui il contenuto di `supabase/schema.sql` nell'SQL Editor del tuo progetto Supabase per creare tabelle, RLS policies e seed data.

### Webhook Stripe

Per lo sviluppo locale:

```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

Copia il `STRIPE_WEBHOOK_SECRET` generato in `.env.local`.

### Admin

Crea un utente admin su Supabase Dashboard → Authentication → Users → Add User. Poi accedi su `/admin/login`.

## Variabili d'ambiente

```
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase (project dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Stripe (dashboard → Developers → API keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (dashboard → API Keys)
RESEND_API_KEY=re_...
STAFF_EMAIL=staff@example.com   # supporta destinatari multipli separati da virgola
```

## Comandi

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il dev server |
| `npm run build` | Typecheck + build di produzione |
| `npm run lint` | ESLint |

## Struttura

```
├── proxy.ts                    # Middleware Next.js 16: redirect locale, auth admin, device detection
├── supabase/schema.sql         # Schema DB + RLS + seed
├── app/
│   ├── [lang]/                 # Pagine pubbliche (con prefisso lingua)
│   ├── admin/                  # Pannello admin (login, prenotazioni)
│   ├── api/
│   │   ├── checkout/           # Crea sessione Stripe
│   │   ├── webhook/            # Gestisce eventi Stripe
│   │   └── admin/cancel-reservation/  # Rimborso + cancellazione
│   └── components/
│       └── mobile/             # UI alternativa per smartphone
├── lib/
│   ├── supabase/               # Client factory (server, client, admin)
│   ├── rooms.ts                # Dati camere, immagini, occupazione
│   ├── email.ts                # Template email Resend
│   ├── stripe.ts               # Client Stripe
│   ├── validation/             # Schema Zod
│   └── locales.ts              # Config lingue
└── dictionaries/               # File JSON {it,en,de}.json
```

## Flusso di prenotazione

```
BookingForm ─POST─> /api/checkout ─Stripe Session─> Stripe Checkout
                                                          │
                                                    pagamento ok
                                                          │
                                                     /api/webhook
                                                          │
                                               insert reservation
                                                          │
                                          email conferma + notifica staff
```

1. L'ospite seleziona date e occupazione nella pagina camera
2. `POST /api/checkout` valida i dati, controlla la disponibilità e crea una sessione Stripe
3. Stripe reindirizza l'ospite al checkout di Stripe per il pagamento
4. Il webhook `checkout.session.completed` inserisce la prenotazione in DB e invia le email
5. La pagina `/success/[session_id]` mostra la conferma

Il sistema rileva automaticamente i conflitti di date: se due persone prenotano le stesse date, la seconda riceve un rimborso automatico.

## Admin

| Pagina | Descrizione |
|--------|-------------|
| `/admin/login` | Login con Supabase Auth |
| `/admin/reservations` | Elenco prenotazioni con possibilità di rimborsare |

Le route admin sono protette da `proxy.ts`: redirect a `/admin/login` se non autenticati.

## Device-aware

Il proxy rileva il dispositivo dallo User-Agent e setta l'header `x-device-type`. Le pagine pubbliche renderizzano componenti da `app/components/mobile/` su smartphone. I dati (camere, contatti, POI) sono condivisi — nessuna duplicazione.

## API Routes

| Route | Metodo | Descrizione |
|-------|--------|-------------|
| `POST /api/checkout` | - | Crea sessione Stripe Checkout (rate-limited: 5 req/min per IP) |
| `POST /api/webhook` | Stripe | Gestisce `checkout.session.completed` |
| `POST /api/admin/cancel-reservation` | Admin | Rimborsa e cancella una prenotazione |

## Deploy

1. Imposta le variabili d'ambiente sul tuo host (Vercel consigliato)
2. Configura il webhook Stripe su `https://tuodominio.com/api/webhook` con evento `checkout.session.completed`
3. (Opzionale) Sostituisci il rate-limiter in-memory con Redis/Upstash per ambienti serverless multi-instanza
4. Verifica il dominio su Resend per cambiare il mittente email da `onboarding@resend.dev` a `noreply@iltuodominio.com`
