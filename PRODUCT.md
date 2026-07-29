# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A small, known group — a household, not an audience. Each person logs their own food
on their own iPhone against one shared deployment, and sees only their own entries,
favorites and goals. Nobody is a coach, nobody reviews anyone else's day, nothing is
shared between people by design.

The owner is the primary user; a second or third person is added by name from any
phone. The primary scene is unchanged and applies to everyone: **immediately after
eating** — phone in hand at the table or in the kitchen, often one-handed, with a few
seconds of attention. Entry has to survive that scene; anything that needs two hands,
a search flow, or patience does not get used.

## Product Purpose

Track calories and protein per day against personal daily targets, with enough
history to see the trend. Success is a day that gets fully logged without effort,
and a week of days that shows whether intake actually hit the targets.

The user is currently **bulking**: eating enough is the job. Calorie and protein
goals are floors to reach, not budgets to protect — with a soft upper bound on
calories (see below).

## Positioning

A tracker the user owns outright. Same job as MyFitnessPal, minus the part where
basics sit behind a subscription and personal history lives in someone else's
account. The whole database is a Prisma schema the user deploys; entries are typed
by hand rather than pulled from a crowd-sourced food database, which trades a
lookup for accuracy the user actually trusts.

## Operating Context

- Installed to the iPhone home screen via Safari → Share → Add to Home Screen.
  Runs standalone, so it must behave like an app: safe-area aware, no browser chrome
  to fall back on.
- **First launch on a phone asks "Whose phone is this?"** — pick a name, enter that
  person's 4-digit PIN, and the device stays signed in for a year. A home-screen PWA
  has its own storage container, so this happens inside the installed app, not in
  Safari beforehand.
- Logging happens throughout the day, right after each meal, in short bursts.
- The same foods recur constantly (shakes, usual breakfast) — favorites/quick-add is
  the main input path, not a side feature.
- Deployed on Vercel; Neon Postgres in both local dev and production (no SQLite).

## Capabilities and Constraints

Confirmed today:

- Manual food entry: name, calories, protein, optional carbs/fat, note, meal type.
- Favorites as quick-add presets; editable and deletable.
- Dashboard for today, 14-day history chart with averages, editable daily goals.
- Multiple people on one deployment, each with their own entries, favorites and goals.
  Identity is a name plus a 4-digit PIN; anyone can add a new person from the picker.
- Next.js 14 App Router, TypeScript, Tailwind, Prisma, Recharts. Server components
  read via Prisma; client components mutate through `/api/*` then `router.refresh()`.

Non-negotiable — future work must not break these:

- **Own the data.** Self-hosted Prisma/Postgres, exportable, no third-party tracking
  service or SaaS account in the data path.
- **Identity is one tap, once per device.** A name and a 4-digit PIN, a year-long
  signed cookie, no email, no password, no third-party auth provider, no session that
  expires on its own. Never add a login the user has to repeat.
- **Each person sees only their own data.** Every query is scoped by `userId`, and
  ownership is checked server-side on every mutation. There is no shared view, no
  sharing feature, and no admin who can read another person's log.
- **Home-screen PWA only.** No App Store build, no native wrapper, no push
  notifications.
- **Type your own numbers.** No food database, no barcode scanning. Manual entry plus
  favorites is the entire input model.

What the PIN is and is not:

- It separates household members from each other and stops a casual passer-by who
  knows the URL. Five wrong attempts locks that person out for 5 minutes.
- It is **not** protection against a determined attacker: four digits is 10,000
  combinations, and anyone with the URL can see the list of names.
- There is **no PIN reset** — no email on file to send one to. A forgotten PIN means
  that person's log is reachable only from the database. Any future recovery flow is a
  product decision, not an implementation detail to invent.

Goal semantics (supersedes the older "over = error" reading in CLAUDE.md):

- **Falling short is the failure state** for both calories and protein.
- Calories also have a **soft upper bound** worth flagging — a target range, not a
  single number. *Undecided:* how wide that band is and whether it is stored as a
  field or derived from `calorieGoal`. Do not invent a number without asking.
- Protein, carbs, and fat over goal is never an error state.

Out of scope for now, but the data model should not foreclose it: gym / workout
tracking (e.g. a future `WorkoutSession` model). Do not build it yet.

Offline writes are explicitly out of scope — iOS gives no background sync, so the app
must not fake offline-write support it cannot deliver.

## Brand Commitments

- Name: **Macro Tracker**.
- The existing icon is binding: ink background, three ascending bars (paper-tinted,
  calorie amber, protein green) over a short paper baseline rule, content inside the
  center ~80% for the iOS maskable safe zone.
- System font stack only — no Google Fonts, no `next/font/google`.

## Evidence on Hand

- Working implementation: `app/`, `components/`, `lib/`, `prisma/schema.prisma`.
- PWA assets already shipped: `public/manifest.json`, `public/sw.js`,
  `public/apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.
- Real user data lives in Neon Postgres (`ap-southeast-2`), reached through the
  pooled connection at runtime.
- No testimonials, no customers, no benchmarks, no pricing — this is a personal tool.
  Future work must not fabricate any.

## Product Principles

1. **One entry, one moment.** Logging happens seconds after eating, one-handed. Every
   added tap is a day that goes unlogged.
2. **Repeats are the norm.** The same foods recur daily; the fast path is recalling a
   favorite, not describing food from scratch.
3. **Reaching the goal is the win.** Under-target is the state worth surfacing; over
   is fine except for a soft calorie ceiling.
4. **The user owns the stack.** No paywall, no vendor between a person and their own
   history. Accounts exist only to keep two people's days apart, never to gate access.
5. **Sign in once, then never again.** Identity is a tap and four digits on first
   launch. A returning user opens the app straight onto today.
6. **Honest about what it can't do.** No offline-write theater, no invented food data,
   no PIN-recovery promise there is no email to deliver, no features borrowed from apps
   with more surface than this one needs.

## Accessibility & Inclusion

No product-specific standard established. Baseline still applies: one-handed thumb
reach on iPhone, targets large enough to hit without looking, and color never the sole
carrier of goal state (bulk semantics depend on it).
