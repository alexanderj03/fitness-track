# Macro Tracker

A personal calorie and protein tracker, similar in spirit to MyFitnessPal Pro,
built as a PWA so it installs to the iPhone home screen with no App Store
and no Apple Developer account. A household of a few people share one
deployment; each person has their own entries, favorites and goals, and sees
nobody else's.

Gym tracking is a planned second feature but is explicitly **out of scope**
for this pass — don't build it yet, just don't make choices that would make
it hard to add later (e.g. it's fine to eventually add a `WorkoutSession`
model alongside the ones below).

## Tech stack

- **Next.js 14, App Router, TypeScript**
- **Tailwind CSS** for styling
- **Prisma** as the ORM, on **Neon Postgres** (`provider = "postgresql"`) for
  both local dev and production — one database, no SQLite anywhere. SQLite
  cannot run on Vercel: the filesystem is read-only and per-instance.
  - `DATABASE_URL` — Neon **pooled** host (`-pooler`), used by the app. Must
    carry `?sslmode=require&pgbouncer=true`; without `pgbouncer=true` Prisma's
    prepared statements collide on a pooled connection
  - `DIRECT_URL` — same database, **direct** host (no `-pooler`), used by
    `prisma migrate` and `prisma studio`. Set in `prisma.config.ts`, since
    that file's `datasource.url` wins over the schema's for CLI commands
  - Want isolation between local and production data? Create a Neon **branch**
    and point local `.env` at it — free and instant. Don't reintroduce SQLite
- **Recharts** for the history trend chart
- Hand-rolled PWA setup (manifest + service worker) rather than the
  `next-pwa` package — it has had rough edges with the App Router, and a
  ~30 line service worker is easy to own directly
- No auth library (NextAuth etc.). Identity is hand-rolled and deliberately
  small: a name, a 4-digit PIN hashed with `node:crypto` scrypt, and an
  HMAC-signed `HttpOnly` cookie that lasts a year. No email, no password, no
  OAuth, no session that expires on its own — a returning phone opens straight
  onto today

## Data model

```prisma
enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

// One person sharing this deployment. No email, no password reset.
model User {
  id          String    @id @default(cuid())
  name        String    @unique
  pinHash     String    // scrypt, stored as "salt:hash"
  failedPins  Int       @default(0)
  lockedUntil DateTime? // 5 wrong PINs => locked for 5 minutes
  createdAt   DateTime  @default(now())

  profile   Profile?
  entries   FoodEntry[]
  favorites FavoriteFood[]
}

// Daily targets, one row per user, editable from Settings
model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  calorieGoal Int      @default(2200)
  proteinGoal Int      @default(160)
  carbGoal    Int?
  fatGoal     Int?
  updatedAt   DateTime @updatedAt
}

model FoodEntry {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  calories  Int
  protein   Float
  carbs     Float?
  fat       Float?
  note      String?  // e.g. "1.5 cups", "2 scoops"
  mealType  MealType @default(SNACK)
  loggedAt  DateTime @default(now())
  createdAt DateTime @default(now())

  @@index([userId, loggedAt])
}

// Quick-add presets for things eaten often (protein shake, usual breakfast, etc.)
model FavoriteFood {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  calories  Int
  protein   Float
  carbs     Float?
  fat       Float?
  note      String?
  createdAt DateTime @default(now())

  @@index([userId])
}
```

**Every query is scoped by `userId`.** A page or route that reads or writes
entries, favorites or a profile without it is a bug, not a shortcut.

## Pages & routes

Mobile-first, bottom tab nav with four tabs:

| Route        | Purpose                                                            |
|--------------|---------------------------------------------------------------------|
| `/`          | Dashboard — today's goal panel, meal-grouped entry list, quick-add  |
| `/log`       | Form to add a food entry (name, calories, protein, carbs, fat, note, meal, optional "save as favorite") |
| `/history`   | Last 14 days as a chart — calorie bars + protein line, with dashed goal reference lines, plus averages |
| `/settings`  | Edit daily goals, manage/delete favorites, change PIN, switch person |

Plus one pre-identity route, outside the tab nav (`BottomNav` renders nothing
there):

| Route  | Purpose                                                                  |
|--------|--------------------------------------------------------------------------|
| `/who` | Pick your name and enter your PIN, or create a new person. Redirects to `/` once signed in |

Every page calls `requireUser()` from `lib/session.ts`, which redirects to
`/who` when the cookie is missing or its signature does not verify. All pages
are `dynamic = "force-dynamic"` — they depend on cookies and on today's data,
and must never be prerendered.

## API routes

- `GET/POST /api/entries` — list today's entries (or `?rangeDays=N` for history), create an entry
- `PATCH/DELETE /api/entries/[id]` — edit or remove a single entry
- `GET/POST /api/favorites` — list/create quick-add presets
- `DELETE /api/favorites/[id]` — remove a preset
- `GET/PUT /api/profile` — read/update the goals
- `POST/DELETE /api/session` — sign in with `{ userId, pin }`; delete to switch person
- `POST /api/users` — create a person with `{ name, pin }`, signs the device in
- `PUT /api/users/pin` — change PIN with `{ currentPin, newPin }`

Every route calls `currentUser()` first and returns 401 when there is no
session. The `[id]` routes use `updateMany` / `deleteMany` scoped by
`{ id, userId }` and return 404 on `count === 0`, so an id belonging to someone
else simply matches nothing — never `update({ where: { id } })` alone.

Dashboard and history pages fetch directly via Prisma in server components
(no need to round-trip through the API for reads). Client components
(quick-add, delete buttons, forms) call the API routes for mutations, then
`router.refresh()`.

**Pages read in one round trip.** Use `requireUserId()` (cookie only, no query)
and fold the existence check into a single nested `user.findUnique` that selects
the profile, entries and favorites together; redirect to `/who` when it returns
null. Don't stack `requireUser()` plus separate `profile.upsert` /
`foodEntry.findMany` / `favoriteFood.findMany` calls — that was four round trips
to Sydney for one screen. `lib/goals.ts` supplies the defaults when a profile
row is somehow absent, so rendering never blocks on a write.

Every route has a `loading.tsx` built from `components/Skeleton.tsx`. They are
not decoration: navigation is a server round trip, and without them a tap paints
nothing until the data lands, which reads as a dead button. Keep them structural
(real frames, rules and eyebrow labels; only values blank) and keep them in sync
when a page's shape changes.

## Design direction

Not another gradient-rings fitness app. Think **nutrition facts label**,
reinterpreted as a live dashboard: bold rules, an eyebrow-style all-caps
label above each row, tabular numerals for the big remaining-amount figure,
a simple bar that fills as you approach the goal.

**Colors**
| Token      | Hex       | Use                                  |
|------------|-----------|---------------------------------------|
| `paper`    | `#FAFAF7` | background                            |
| `ink`      | `#14140F` | text, rules, borders                  |
| `line`     | `#D8D6CC` | hairline dividers                     |
| `calorie`  | `#C97A2E` | calorie bar/accent                    |
| `protein`  | `#3F6B3E` | protein bar/accent                    |
| `over`     | `#B23A2E` | over-budget state (calories only —    |
|            |           | protein/carbs/fat going over goal is  |
|            |           | fine and should NOT read as an error) |

**Type**: system font stack only (no Google Fonts / `next/font/google`) —
avoids an external font fetch at build time and works everywhere with zero
setup. Get the "label" feel from weight, tracking, and `font-variant-numeric:
tabular-nums` rather than a condensed display face. If a custom font is
wanted later, it's safe to add on Vercel (unlike a fully offline dev sandbox,
Vercel's build environment can reach Google Fonts fine).

**Signature element**: the day's `MacroPanel` — a bordered card headed
"Daily Values" with a thick rule under it, then a `MacroGauge` for calories
and one for protein. Each gauge shows the eyebrow label top-left,
`consumed / goal · %` top-right, a 44px to-go figure, a "Goal met" stamp once
reached, a 16px day strip **segmented one block per logged entry**, and
printed ruler graduations beneath. Carbs and fat sit below a 2px rule as quiet
`GoalBar` rows. Calories flips to the `over` color past goal; protein, carbs
and fat never do, since going over on those isn't a failure state.

Full token spec, named rules and component anatomy live in `DESIGN.md` — it is
the authority for anything visual, and this section is only the summary. Goal
semantics (under-target is the failure state; the calorie ceiling band is still
undecided) live in `PRODUCT.md`.

## PWA requirements

- `public/manifest.json` — name, `display: standalone`, `theme_color` /
  `background_color` matching `paper`, icons at 192/512 in both `any` and
  `maskable` purposes
- `public/apple-touch-icon.png` (180×180) — iOS looks for this specifically
- `public/sw.js` — **static assets only** (`/_next/static/*`, manifest, icons).
  HTML documents and `/api/*` always go to the network. Since pages are
  per-person, a cached document would survive "Switch person" and show one
  person's day to another, and would also bypass the sign-in redirect. Do not
  reintroduce app-shell caching for HTML
- Root layout needs `manifest: "/manifest.json"`, `appleWebApp: { capable:
  true, statusBarStyle: "default" }`, and a viewport with `viewportFit:
  "cover"`. **Not `black-translucent`** — that forces white status-bar glyphs,
  which disappear against `paper`, and it extends the canvas under the Dynamic
  Island where the masthead then hides behind it
- Safe areas are handled **once**, in the root layout's wrapper
  (`padding-top/left/right: env(safe-area-inset-*)`), not per page. Pages just
  use their normal `pt-6`
- Bottom nav pads for the home indicator with
  `max(calc(env(safe-area-inset-bottom) - 14px), 8px)`, not the raw inset: the
  full 34px under a single 11px label reads as dead space. Tap targets stay
  44px and end clear of the home-indicator gesture zone. The content wrapper's
  `pb-20` is sized to that nav height

### iOS-specific constraints to design around

- No automatic install prompt — user must do Share → Add to Home Screen
  manually. Only works from actual Safari, not an in-app browser/webview.
- iOS can evict cached storage (Cache API, IndexedDB, service worker cache)
  after roughly 7 days of disuse. Don't rely on client-side storage as the
  source of truth — Neon Postgres via Prisma already is, which is correct.
- No background sync. Any offline-added entries won't quietly sync later —
  out of scope for v1, don't build fake offline-write support that can't
  actually deliver on it.
- Push notifications work (iOS 16.4+, outside the EU) but are not needed for
  this app and shouldn't be added speculatively.

## Icon

Simple mark: `ink` background, three ascending bars (a faint paper-tinted
one, then `calorie` amber, then `protein` green) with a short paper-colored
baseline rule underneath — a minimal "daily progress" glyph. Keep all
content within the center ~80% of the canvas so it isn't clipped by iOS's
icon mask (maskable safe zone).

## Conventions

- Keep components small and single-purpose: `MacroGauge` (one hero macro:
  figure, segmented day strip, graduations), `GoalBar` (the quiet carbs/fat
  row), `MacroPanel` (composes them), `MealList`, `QuickAddBar`, `BottomNav`,
  `PinPad`, `WhoPicker`, `AccountPanel`, `DayWindow` are separate files, not
  one giant dashboard component.
- `DayWindow` under the panel prints the server's clock, the zone abbreviation
  (`AEST`/`AEDT`, so a wrong offset is visible) and the exact window "today"
  covers; its `title` carries the UTC instants. Entry rows print their stored
  `loggedAt`. Keep both — they're how a timezone regression gets noticed.
- Server components for data reads, client components only where
  interactivity/mutation is needed.
- Day boundaries and formatting live in `lib/day.ts` (`startOfDay`,
  `endOfDay`, `dayKey`, `last7Days`, `shortWeekday`, `dateStamp`) — don't
  reimplement date math inline in pages. Figure formatting lives in
  `lib/format.ts` (`num`, `pct`).
- `lib/day.ts` computes every boundary in **`APP_TIME_ZONE`** (default
  `Australia/Sydney`) using `Intl`, never in the host's local time — so a UTC
  Vercel function and a local machine agree. Don't reintroduce `setHours` or
  `getDate` for day math: those read the host zone, and on Vercel that starts
  "today" at 10am Sydney. `lastNDays` steps the calendar rather than
  subtracting 24h, so DST changes can't drop or duplicate a day.
- If people in different timezones ever share a deployment, the zone becomes a
  `User` column and the day helpers take it as an argument. One env-level
  default is only correct for a single-household deployment.
- `lib/prisma.ts` singleton pattern to avoid connection exhaustion in dev —
  standard Next.js/Prisma pattern, same as other projects.
- Identity lives in three small files: `lib/pin.ts` (PIN shape, safe to import
  from client code), `lib/auth.ts` (scrypt hashing, lockout math — server
  only, imports `node:crypto`), `lib/session.ts` (cookie signing,
  `currentUser()` for routes, `requireUser()` for pages). Never import
  `lib/auth.ts` or `lib/session.ts` from a `"use client"` component.
- The full visual system is documented in `DESIGN.md` (tokens, rules,
  component anatomy) with a machine-readable sidecar at
  `.impeccable/design.json`. Read it before adding UI.

## Deploy

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (Neon pooled),
   `DIRECT_URL` (Neon direct) and `SESSION_SECRET` (`openssl rand -hex 32`)
3. `npx prisma migrate dev` — applies migrations to Neon over `DIRECT_URL`
4. `npm run dev` to check locally
5. Push to GitHub, import into Vercel
6. Add the three env vars in Vercel (Production **and** Preview), then
   redeploy; env vars don't apply to builds that already ran. The app throws
   on boot without `SESSION_SECRET`; changing it later signs every device out.
   No `TZ` needed — `lib/day.ts` does its own zone math. Also set the project's
   function region to the one nearest the Neon database (`syd1` for
   `ap-southeast-2`), or every query crosses an ocean
7. `npm run build` runs `prisma generate && prisma migrate deploy && next
   build`, so Vercel applies pending migrations on every deploy. This needs
   `DIRECT_URL` present in the build environment
8. On iPhone: open the deployed URL in Safari → Share → Add to Home Screen,
   then open the installed icon and pick your name. The installed app has its
   own cookie jar, so signing in beforehand in Safari does not carry over