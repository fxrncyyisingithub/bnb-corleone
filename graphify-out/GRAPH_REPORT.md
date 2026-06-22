# Graph Report - .  (2026-06-22)

## Corpus Check
- Large corpus: 73 files · ~885,216 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 238 nodes · 424 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Public pages|Public pages]]
- [[_COMMUNITY_Booking form & rooms|Booking form & rooms]]
- [[_COMMUNITY_Header, Footer & layout|Header, Footer & layout]]
- [[_COMMUNITY_Checkout API & rate limiter|Checkout API & rate limiter]]
- [[_COMMUNITY_Dev dependencies (package.json)|Dev dependencies (package.json)]]
- [[_COMMUNITY_Dependencies (package.json)|Dependencies (package.json)]]
- [[_COMMUNITY_TypeScript config|TypeScript config]]
- [[_COMMUNITY_Admin cancel & email|Admin cancel & email]]
- [[_COMMUNITY_Documentation (AGENTSREADME)|Documentation (AGENTS/README)]]
- [[_COMMUNITY_Proxy & device detection|Proxy & device detection]]
- [[_COMMUNITY_Images & assets|Images & assets]]
- [[_COMMUNITY_Contacts & WhatsApp|Contacts & WhatsApp]]
- [[_COMMUNITY_Admin login|Admin login]]
- [[_COMMUNITY_Root layout|Root layout]]
- [[_COMMUNITY_ESLint config|ESLint config]]
- [[_COMMUNITY_Next.js config|Next.js config]]
- [[_COMMUNITY_PostCSS config|PostCSS config]]
- [[_COMMUNITY_pnpm workspace|pnpm workspace]]

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 25 edges
2. `getDictionary()` - 23 edges
3. `compilerOptions` - 16 edges
4. `createClient()` - 15 edges
5. `getRequestDeviceType()` - 13 edges
6. `isMobileDevice()` - 13 edges
7. `Corleone Guesthouse repo guide` - 10 edges
8. `NotFound()` - 9 edges
9. `Locale` - 9 edges
10. `RoomPage()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Security measures (BotId, RLS, webhook verify)` --semantically_similar_to--> `BotId anti-bot protection`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Panoramic view of Corleone town` --references--> `BNB Corleone - Guesthouse booking website`  [INFERRED]
  immagini/corleone.png → AGENTS.md
- `Facade of Chiesa Madre (Mother Church) in Corleone` --references--> `BNB Corleone - Guesthouse booking website`  [INFERRED]
  immagini/cosa-visitare/chiesa-madre.png → AGENTS.md
- `CIDMA museum exhibit on Mafia history` --references--> `BNB Corleone - Guesthouse booking website`  [INFERRED]
  immagini/cosa-visitare/cidma.png → AGENTS.md
- `Waterfall at Due Rocche natural site` --references--> `BNB Corleone - Guesthouse booking website`  [INFERRED]
  immagini/cosa-visitare/due-rocche.png → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Guesthouse booking architecture** — agents_booking_flow, agents_supabase_clients, agents_db_schema, agents_resend_email [INFERRED 0.85]

## Communities (21 total, 5 thin omitted)

### Community 0 - "Public pages"
Cohesion: 0.20
Nodes (22): NotFound(), Camere(), generateMetadata(), Contatti(), generateMetadata(), CosaVisitare(), generateMetadata(), LangLayout() (+14 more)

### Community 1 - "Booking form & rooms"
Cohesion: 0.12
Nodes (14): dateLocales, Dict, Room, FALLBACK_IMAGES, FALLBACK_ROOMS, OccupancyOption, ROOM_IMAGES, ROOM_OCCUPANCY (+6 more)

### Community 2 - "Header, Footer & layout"
Cohesion: 0.13
Nodes (13): Dict, Footer(), Dict, dictionaries, Dictionary, Locale, localeLabels, PointOfInterest (+5 more)

### Community 3 - "Checkout API & rate limiter"
Cohesion: 0.17
Nodes (13): POST(), checkRateLimit(), getIp(), getRateLimitHeaders(), ratelimit, CancelButton(), OccupancyCalendar(), AdminReservations() (+5 more)

### Community 4 - "Dev dependencies (package.json)"
Cohesion: 0.10
Nodes (20): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/negotiator, @types/node, @types/react (+12 more)

### Community 5 - "Dependencies (package.json)"
Cohesion: 0.10
Nodes (20): dependencies, botid, date-fns, @formatjs/intl-localematcher, lucide-react, negotiator, next, react (+12 more)

### Community 6 - "TypeScript config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Admin cancel & email"
Cohesion: 0.25
Nodes (11): POST(), getResend(), GuestEmailProps, guestTemplate(), sendGuestConfirmation(), sendStaffNotification(), StaffEmailProps, staffTemplate() (+3 more)

### Community 8 - "Documentation (AGENTS/README)"
Cohesion: 0.20
Nodes (15): Admin panel (Supabase Auth guarded), Booking flow (Stripe checkout to webhook), BotId anti-bot protection, Corleone Guesthouse repo guide, Database schema (rooms, reservations, RLS), Device-aware rendering (mobile/desktop), Next.js 16 framework quirks, Rate limiter (Upstash Redis) (+7 more)

### Community 9 - "Proxy & device detection"
Cohesion: 0.33
Nodes (7): DeviceType, getDeviceType(), locales, config, getLocale(), proxy(), withHeaders()

### Community 10 - "Images & assets"
Cohesion: 0.46
Nodes (8): BNB Corleone - Guesthouse booking website, Facade of Chiesa Madre (Mother Church) in Corleone, CIDMA museum exhibit on Mafia history, Waterfall at Due Rocche natural site, Panoramic view of Corleone town, Facade of Chiesa Madre (Mother Church) in Corleone (public copy), CIDMA museum exhibit on Mafia history (public copy), Waterfall at Due Rocche natural site (public copy)

### Community 11 - "Contacts & WhatsApp"
Cohesion: 0.46
Nodes (3): WhatsAppIcon(), CONTACTS, Dict

### Community 12 - "Admin login"
Cohesion: 0.43
Nodes (3): LoginForm(), metadata, createClient()

## Knowledge Gaps
- **89 isolated node(s):** `metadata`, `metadata`, `Room`, `Dict`, `dateLocales` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Checkout API & rate limiter` to `Public pages`, `Booking form & rooms`, `Admin cancel & email`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `Public pages` to `Proxy & device detection`, `Header, Footer & layout`, `Contacts & WhatsApp`, `Booking form & rooms`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `getDictionary()` connect `Public pages` to `Booking form & rooms`, `Header, Footer & layout`, `Contacts & WhatsApp`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `Room` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Booking form & rooms` be split into smaller, more focused modules?**
  _Cohesion score 0.11956521739130435 - nodes in this community are weakly interconnected._
- **Should `Header, Footer & layout` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Dev dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._