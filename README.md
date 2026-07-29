# Macro Tracker

A calorie and protein tracker built as a PWA, so it installs to the iPhone home
screen with no App Store and no Apple Developer account. A household of a few
people share one deployment; each person keeps their own entries, favorites and
goals, and sees nobody else's.

Manual entry only — no food database, no barcode scanning. You type the numbers
you actually trust, and the foods you eat daily become one-tap quick-adds.

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | Neon Postgres via Prisma |
| Charts | Recharts |
| Auth | Hand-rolled: name + 4-digit PIN, HMAC-signed cookie |
| PWA | Hand-rolled manifest + service worker (no `next-pwa`) |
| Hosting | Vercel |

## Getting started

**1. Install**

```bash
npm install
```

**2. Create a Neon database**

At [neon.tech](https://neon.tech), create a project and copy the connection
string twice — once with pooling on, once off. Both are on the same page; it's
a toggle, not two databases.

**3. Configure**

```bash
cp .env.example .env
```

Fill in three values:

```bash
# Pooled host (contains -pooler). Used by the app at runtime.
# pgbouncer=true is required: without it Prisma's prepared statements
# collide on a pooled connection.
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"

# Direct host (no -pooler). Used by prisma migrate and prisma studio,
# because pgbouncer cannot run DDL reliably.
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/neondb?sslmode=require"

# Signs the identity cookie. Changing it signs every device out.
SESSION_SECRET="…"   # openssl rand -hex 32
```

`.env` is gitignored. Never commit it.

**4. Migrate and run**

```bash
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000. With an empty database you land on `/who` to create
the first person.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate && prisma migrate deploy && next build` |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx prisma studio` | Browse the database |

`build` applies pending migrations, so every Vercel deploy migrates the
database. This needs `DIRECT_URL` present in the build environment.

## Deploying

1. Push to GitHub, import the repo into Vercel
2. Add `DATABASE_URL`, `DIRECT_URL` and `SESSION_SECRET` under Settings →
   Environment Variables, for **Production and Preview**
3. Redeploy — env vars don't apply to builds that already ran
4. On iPhone: open the deployed URL in **Safari** (not an in-app browser) →
   Share → Add to Home Screen
5. Open the installed icon and pick your name. An installed PWA has its own
   cookie jar, so signing in beforehand in Safari does not carry over

## How identity works

There is no email, no password and no OAuth. First launch on a phone asks
"Whose phone is this?" — pick a name, enter that person's 4-digit PIN, and the
device stays signed in for a year. Adding someone new is a name and a PIN from
the same screen.

Under the hood: PINs are hashed with scrypt (`node:crypto`, `salt:hash`), the
session is the user id plus an HMAC-SHA256 signature in an `HttpOnly`,
`SameSite=Lax`, `Secure` cookie, and five wrong PINs lock that person out for
five minutes. Every query is scoped by `userId`; `PATCH`/`DELETE` routes use
`updateMany`/`deleteMany` filtered by `{ id, userId }`, so an id belonging to
someone else matches nothing and returns 404.

**What this is not.** Four digits is 10,000 combinations, and anyone with the
URL can see the list of names. It separates household members and stops a
casual passer-by; it is not protection against a determined attacker. There is
also **no PIN reset** — no email on file to send one to. A forgotten PIN means
that person's log is reachable only from the database.

## Routes

| Route | Purpose |
|---|---|
| `/` | Today — Daily Values panel, quick-add, meal-grouped entries |
| `/log` | Add an entry (name, calories, protein, carbs, fat, note, meal, save-as-favorite) |
| `/history` | Last 14 days — calorie bars, protein line, dashed goal lines, averages |
| `/settings` | Daily goals, favorites, change PIN, switch person |
| `/who` | Pick your name and enter your PIN, or add a person |

API: `/api/entries`, `/api/entries/[id]`, `/api/favorites`,
`/api/favorites/[id]`, `/api/profile`, `/api/session`, `/api/users`,
`/api/users/pin`. Every route requires a valid session and returns 401 without
one.

## Project layout

```
app/            Routes and API handlers
components/     One component per file — MacroGauge, MacroPanel, MealList,
                QuickAddBar, PinPad, WhoPicker, AccountPanel, BottomNav …
lib/
  prisma.ts     Prisma singleton
  session.ts    Cookie signing, currentUser() for routes, requireUser() for pages
  auth.ts       scrypt PIN hashing and lockout math (server only)
  pin.ts        PIN shape — the one auth file safe to import from client code
  day.ts        Day boundaries and date formatting
  format.ts     Figure formatting
prisma/         Schema and migrations
public/         Manifest, icons, service worker
```

Server components read through Prisma directly; client components mutate
through `/api/*` and then call `router.refresh()`.

## Design

The visual system is documented in [DESIGN.md](DESIGN.md), with a
machine-readable sidecar at `.impeccable/design.json`. Short version: a kitchen
scale, printed rather than rendered. Warm paper stock, near-black ink, square
corners everywhere, no shadows, and rule weights that mean something (4px
section header, 2px instrument, 1px row). Two accent colors total — amber for
calories, green for protein — and a red reserved strictly for numeric state.

The signature element is the day's `MacroGauge`: a 44px to-go figure over a
progress strip segmented one block per logged entry, with printed ruler
graduations beneath, so the bar shows what made up the day as well as how far
along it is.

Product context — who this is for and what must not change — is in
[PRODUCT.md](PRODUCT.md). Repo conventions are in [CLAUDE.md](CLAUDE.md).

## Known limits

- **Dark mode is specified but not implemented.** Tokens and rules are settled
  in DESIGN.md; the Tailwind config and components still ship light-only.
- **The calorie ceiling is undecided.** Going under a goal is the failure state,
  and calories are meant to carry a soft upper band as well — its width is an
  open product decision, so calories currently flip to the over color at exactly
  the goal.
- **No offline writes.** iOS gives PWAs no background sync, so the app doesn't
  pretend to queue entries. The service worker caches static assets only; HTML
  and API calls always hit the network, because a cached page would survive
  "Switch person" and show one person's day to another.
- **No gym tracking yet.** Out of scope for now; the schema leaves room for a
  `WorkoutSession` model later.
- **SQLite won't work in production.** Vercel's filesystem is read-only and
  per-instance. Neon Postgres is used in local dev too, so both environments
  behave the same.

## Troubleshooting

**`P1002 — timed out acquiring an advisory lock`** on migrate. A migration ran
through the pooled connection at some point and pgbouncer is holding that
session's lock. Confirm `prisma.config.ts` points at `DIRECT_URL`, then
terminate the idle backend:

```sql
SELECT pg_terminate_backend(l.pid)
FROM pg_locks l JOIN pg_stat_activity a ON a.pid = l.pid
WHERE l.locktype = 'advisory' AND a.state = 'idle';
```

**`prepared statement "s0" already exists`.** `pgbouncer=true` is missing from
`DATABASE_URL`.

**Signed out unexpectedly.** `SESSION_SECRET` changed, or iOS evicted the
cookie. Pick your name again — one tap, nothing is lost.

**The app won't start in production.** `SESSION_SECRET` is unset; it throws
deliberately rather than falling back to a dev default.
