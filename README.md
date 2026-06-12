# Corleone Guesthouse

Sito web per la guesthouse con prenotazioni online, pagamenti Stripe e area admin.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase (auth + database)
- Stripe Checkout + webhooks
- BotId (protezione anti-bot sul checkout)

## Setup

1. Copia le variabili d'ambiente:

```bash
cp .env.example .env.local
```

2. Compila `.env.local` con le credenziali Supabase e Stripe.

3. Avvia il dev server:

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Script

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Build di produzione |
| `npm run start` | Server di produzione |
| `npm run lint` | ESLint |

## Struttura

```
app/              Pagine e componenti UI
app/components/mobile/   UI dedicata per smartphone (rilevata via User-Agent)
lib/              Client Supabase/Stripe, validazione, dati condivisi
proxy.ts          Auth admin + device detection + refresh sessione Supabase
```

## Versione mobile

Su smartphone il proxy imposta l'header `x-device-type: mobile` e le pagine pubbliche renderizzano componenti dedicati in `app/components/mobile/`. Tablet e desktop ricevono la versione desktop. I dati (camere, contatti, POI) sono condivisi da `lib/` — niente duplicazione dei contenuti.

## Flusso prenotazione

1. L'ospite seleziona date e dati nella pagina camera
2. `POST /api/checkout` valida input, controlla disponibilità e crea sessione Stripe
3. Stripe webhook (`POST /api/webhook`) salva la prenotazione su Supabase
4. Pagina `/success/[session_id]` verifica il pagamento con Stripe

## Admin

- Login: `/admin/login`
- Prenotazioni: `/admin/reservations` (protetta da auth Supabase)

## Deploy

Configura le variabili d'ambiente su Vercel (o altro host) e imposta il webhook Stripe su:

```
https://<tuo-dominio>/api/webhook
```

Evento richiesto: `checkout.session.completed`
