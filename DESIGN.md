---
name: Macro Tracker
description: A nutrition-label instrument panel for a single person eating on purpose.
colors:
  paper: "#FAFAF7"
  ink: "#14140F"
  line: "#D8D6CC"
  calorie: "#C97A2E"
  protein: "#3F6B3E"
  over: "#B23A2E"
  dark-ground: "#1C1C17"
  dark-surface: "#23231D"
  dark-ink: "#F2F1E8"
  dark-line: "#3E3E35"
  dark-calorie: "#E09A4E"
  dark-protein: "#6FA36D"
  dark-over: "#E0705E"
typography:
  hero:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 800
    lineHeight: "1"
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  readout:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: "2rem"
    fontFeature: "tabular-nums"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.12em"
    textTransform: "uppercase"
  micro:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: "1rem"
    letterSpacing: "0.14em"
    textTransform: "uppercase"
rounded:
  none: "0px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    width: "100%"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  chip-quickadd:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 8px"
    width: "100%"
  card-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px 4px"
  gauge-track:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.none}"
    height: "16px"
    width: "100%"
  goal-bar-track:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.none}"
    height: "6px"
    width: "100%"
  stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.micro}"
    rounded: "{rounded.none}"
    padding: "3px 6px"
  nav-bottom:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 0"
---

# Design System: Macro Tracker

## Overview

**Creative North Star: "The Kitchen Scale"**

A kitchen scale has one job and one face: a large number, a unit, and a bezel. No
chrome, no encouragement, no personality beyond precision. Macro Tracker is built the
same way — every screen resolves to a figure large enough to read at arm's length,
surrounded by calibration marks that exist only to make that figure legible. The
interface is the bezel. The number is the product.

The material is printed, not rendered. Warm paper stock (`paper`), near-black ink
(`ink`), and rules of three deliberate weights: a 4px bar under a panel header, a 2px
frame around an instrument, a 1px hairline between rows. Nothing is rounded, nothing
casts a shadow, nothing glows. Two chromatic voices — a baked amber for calories, a
muted field green for protein — carry the only color in the system, which is why a
2px-tall amber bar reads as information rather than decoration.

Dark mode is not an inversion trick; it is the same instrument in a dark room. A warm
charcoal ground with one tonal step up for panel surfaces, ink-colored rules that
recede rather than glare, and both accents lifted in lightness while holding their
hue. The paper warmth survives the switch — this system never goes to pure black or
pure white.

**Key Characteristics:**
- One figure dominates every view; everything else is calibration
- Zero border-radius, zero shadow, zero gradient — in both themes
- Rule weight encodes rank: 4px header, 2px object, 1px row
- Two accent hues total, both earned by data, never by decoration
- System font stack only, tabular figures everywhere a number can change
- Single 28rem column, thumb-first, bottom-anchored navigation

## Colors

An earthy, printed palette: warm off-white stock, warm near-black ink, and two food-
adjacent accents that behave like a second and third pass on a press.

### Primary
- **Toasted Amber** (`{colors.calorie}`): calories, everywhere they appear — the
  `GoalBar` fill on the Daily Values panel, the history bars, the dashed calorie goal
  reference line. This hue means *energy* and appears nowhere else.
- **Field Green** (`{colors.protein}`): protein, everywhere it appears — its `GoalBar`
  fill, the history trend line and its dots, the dashed protein reference line. This
  hue means *protein* and appears nowhere else.

### Tertiary
- **Signal Red** (`{colors.over}`): state only, never identity. Today it colors the
  over-calorie figure and bar, and form error text. Its meaning is under active
  revision (see the goal-semantics note in PRODUCT.md); its *visual* rule is fixed —
  it is loud, it is rare, and it never appears on a surface that isn't reporting a
  state.

### Neutral
- **Warm Paper** (`{colors.paper}`): the page ground, every input field, the nav bar,
  the chart tooltip. Warm enough to read as stock rather than as white.
- **Warm Ink** (`{colors.ink}`): all body and figure text, every border and rule, the
  primary button fill, chart axis lines. One ink for text and structure both — that
  identity is the system's backbone.
- **Bone Line** (`{colors.line}`): hairline row dividers and the unfilled portion of
  every progress track. Never used for text.

### Dark Theme
- **Charcoal Ground** (`{colors.dark-ground}`): page background. Warm, not neutral.
- **Charcoal Surface** (`{colors.dark-surface}`): one step up, for the Daily Values
  panel and other framed instruments, so a card still reads as an object on a ground.
- **Bone Text** (`{colors.dark-ink}`): all text and figures (~15:1 on ground).
- **Charcoal Rule** (`{colors.dark-line}`): hairlines and unfilled track.
- **Lifted Amber / Lifted Green / Lifted Signal** (`{colors.dark-calorie}`,
  `{colors.dark-protein}`, `{colors.dark-over}`): the three accents raised in
  lightness at constant hue — 7.4:1, 5.9:1 and 5.5:1 on the ground respectively. The
  light-mode accents are not reused in dark; Field Green sits at 2.1:1 there and is
  unreadable.

**Status:** the dark tokens above are a committed decision, not yet implemented in
`tailwind.config.ts`. Theme resolution follows the OS by default with a
Light / Dark / Auto override in Settings; the stored preference must be applied by an
inline script before first paint so the app never flashes paper on a dark screen.

### Named Rules

**The Two-Ink Rule.** Amber and green are the only hues the system spends. Every other
mark is paper, ink, or line. A new color requires a new *measured quantity* to justify
it — never a new mood, section, or emphasis level.

**The Earned Red Rule.** Signal Red reports a state and nothing else. It never styles a
heading, an icon, a border, or a delete affordance. If red is on screen, a number is
out of range.

**The Warm Ground Rule.** Neither theme reaches an extreme. No `#FFFFFF`, no `#000000`,
ever. The stock is always warm.

## Typography

**Display Font:** system stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`,
Roboto, Helvetica, Arial, sans-serif)
**Body Font:** the same stack
**Label/Mono Font:** none — `font-variant-numeric: tabular-nums` is set on `body`, so
figures align in columns without a second family.

**Character:** one family, doing five jobs through weight, size, case, and tracking
alone. The label feel comes from 800-weight tight-tracked headings against 600-weight
11px all-caps eyebrows, not from a condensed display face. No webfont is loaded — the
system never pays a network round-trip to render a number.

### Hierarchy
- **Hero** (800, 44px, -0.03em, tabular): the remaining-amount figure on a
  `MacroGauge` — calories and protein on the dashboard. The largest figure in the
  product, and the only place this step is allowed.
- **Display** (700, 30px/36px, tabular): large secondary figures where a hero would
  overwhelm its container.
- **Headline** (800, 20px, -0.025em): page titles — "Today", "Log Food",
  "Last 14 Days", "Settings". One per screen.
- **Title** (800, 18px, -0.025em): the "Daily Values" panel header.
- **Readout** (700, 24px, tabular): secondary large figures, e.g. the history averages.
- **Body** (400–500, 14px/20px): entry names, form fields, buttons. 12px is the floor
  for secondary numerics (per-entry kcal/protein).
- **Label** (600, 11px, +0.12em, uppercase): the eyebrow above every value, every
  section head, and the bottom nav. The most repeated type object in the system.
- **Micro** (700, 10px, +0.14em, uppercase): stamps and ruler end-labels only — the
  marks printed *onto* an instrument rather than typeset beside it. Never body copy.

### Named Rules

**The Eyebrow Rule.** Every value carries an 11px all-caps label. A number on this
surface is never left to explain itself.

**The Tabular Rule.** Any figure that changes between renders is tabular. Digits must
not shift horizontally when 999 becomes 1000 — a scale readout that jitters is a
broken scale.

**The One Headline Rule.** One 20px headline per screen, top-left, above everything.
Sub-sections step down to the 11px eyebrow — there is no 16px middle heading tier.

## Layout

A single centered column capped at 28rem (`max-w-md`, 448px), 16px side gutters, 24px
of lead above the page headline, and 80px of bottom padding to clear the fixed nav.
The device's safe areas are added once at the layout wrapper — top, left and right —
so a page never pads for the Dynamic Island itself.
There are no breakpoints and no multi-column layouts: the phone is the target device
and the column simply centers on anything wider.

Vertical rhythm runs on a 4px base — 8px between a label and its field, 12px for row
padding inside instruments, 16px between form fields, 24px between major blocks, 32px
between page sections. Density is deliberately tight inside the Daily Values panel and
loose between panels, so the instrument reads as one object.

The bottom nav is fixed, full-bleed, four equal columns of 44px targets. It clears the
home indicator with `max(calc(env(safe-area-inset-bottom) - 14px), 8px)` rather than
the raw inset: a single 11px label above 34px of empty paper reads as a mistake, and
the trimmed band still keeps every target out of the home-indicator gesture zone.
Content scrolls under it; it never scrolls away.

### Named Rules

**The 28rem Column Rule.** Everything lives in one 448px column. No sidebars, no
two-up cards, no desktop layout — a wider viewport gets more margin, not more columns.

**The Thumb Floor Rule.** Interactive targets sit in the lower two-thirds of the screen
and are at least 44px tall. Logging happens one-handed, seconds after eating.

## Elevation & Depth

There are no shadows in this system, in either theme, at any state. Depth is carried
entirely by rule weight and, in dark mode, by a single tonal step.

Light mode is strictly flat: a panel is an object because a 2px ink frame says so, and
its header is dominant because a 4px rule sits under it. Dark mode adds exactly one
device — panel surfaces sit one step lighter than the ground
(`{colors.dark-surface}` on `{colors.dark-ground}`) — because a 2px rule alone loses
its authority on a dark field. That step is the only elevation vocabulary that exists.

### Named Rules

**The Flat Paper Rule.** No `box-shadow`, no `filter: drop-shadow`, no gradient, no
blur, no glassmorphism. If something needs to separate from its background, it gets a
rule or a tonal step, not a shadow.

**The Three Weights Rule.** 4px means *section header boundary*. 2px means *this is an
instrument*. 1px means *row divider*. A rule's weight is never chosen for looks.

## Shapes

Every corner in the system is square. `border-radius: 0` on buttons, inputs, selects,
chips, cards, the progress track, the progress fill, and the chart container. Bars are
plain rectangles: no rounded caps, no inner radius, no tapering.

Form language is rectilinear and stacked. Progress bars are 8px-tall full-width
rectangles whose fill is clamped at 100% of the track — the track's edge is the goal
line, and the fill never overruns it. Delete affordances are a bare `×` glyph with no
container. The only non-rectangular marks in the system are the 3px dots on the
history protein line.

### Named Rules

**The Zero Radius Rule.** Nothing in this system is rounded, including elements a
component library would round by default. A radius anywhere reads as a foreign object.

## Components

### Buttons
- **Shape:** square (0px radius), no shadow, no transition currently defined.
- **Primary:** solid ink fill, paper text, 11px-equivalent uppercase bold label at
  14px, full-width, 12px vertical padding, 2px ink border. Used for the single
  committing action on a screen — "Save Entry", "Save Goals".
- **Outline:** paper fill, ink text, 1px ink border, 4px/12px padding, sentence case
  at 14px. Used for secondary navigation-style actions — the "+ Add" affordance on the
  dashboard.
- **Disabled:** 40% opacity, no other change; the label swaps to a present-participle
  state ("Saving…") so the button reports what it is doing.
- **Hover / Focus:** currently unspecified. Any addition must be an instant, printed
  change — an ink/paper inversion or a rule-weight step — never a lift, glow, or
  scale.

### Chips
- **Quick-add chip:** paper fill, 1px ink border, square, 8px/12px padding, two stacked
  lines — 14px medium name over a 12px tabular `kcal · protein` summary. Laid out in a
  horizontally scrolling row, each chip `shrink-0`.
- **State:** pressed chips drop to 40% opacity while their POST is in flight. There is
  no selected state; a chip is an action, not a filter.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** paper (light) / charcoal surface (dark).
- **Border:** 2px ink frame. This is the "instrument" signal — used by the Daily Values
  panel, the chart container, and the history averages block.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Internal Padding:** 16px horizontal, 12px top; row-bearing panels drop to 4px
  bottom padding so the last hairline divider does the closing.

### Inputs / Fields
- **Style:** 1px ink border, paper fill, square, 8px padding, 14px text. Numeric fields
  carry tabular figures and the correct `inputMode` (`numeric` / `decimal`) so iOS
  raises the number pad.
- **Label:** an 11px uppercase eyebrow sits above the field with 4px of separation,
  wrapped in the `<label>` element itself.
- **Focus:** currently the browser default. A defined focus state must be a visible 2px
  ink outline — never a removed outline, never a soft ring.
- **Error:** message in Signal Red at 14px, below the field group, above the submit
  button.

### Navigation
- **Style:** fixed bottom bar, paper fill, 1px ink top rule, four equal-width columns.
- **Typography:** 11px, 600 weight, uppercase, +0.025em tracking. Text only — this
  system has no icon set, and adding one is a system-level decision, not a component
  tweak.
- **States:** active is full ink; inactive is a reduced-opacity ink. The dashboard tab
  matches only the exact `/` route; every other tab matches by path prefix.
- **Safe area:** `max(calc(env(safe-area-inset-bottom) - 14px), 8px)` at the bottom,
  plus the left/right insets for landscape. The top, left and right insets are the
  layout wrapper's job, not any page's.

### The Daily Values Panel (signature)

The system's centerpiece and the direct expression of the Kitchen Scale. A 2px ink
frame, an 18px "Daily Values" title with the day's entry count opposite it, a 4px ink
rule beneath, then two `MacroGauge` rows — calories, then protein — separated by 1px
hairlines. Carbs and fat, when their goals are set, sit below a 2px ink rule as quiet
`GoalBar` rows: same panel, demoted register.

**`MacroGauge`** is a six-part fixed anatomy, and the order never changes:

1. **Eyebrow** (11px uppercase, top-left): the macro name.
2. **Ratio** (11px tabular, top-right): `consumed / goal` and the percentage.
3. **Figure** (44px hero, tabular): the amount still to go, with an inline 16px unit
   and the words "to go" or "over". The largest thing on the phone.
4. **Stamp** (10px micro, bordered, baseline-right of the figure): appears only once
   the goal is reached — "Goal met" in ink, or "Over" in Signal Red for calories.
5. **Day strip** (16px, 1px ink border): the bone track, filled with **one segment per
   logged entry** in the order eaten, each divided from the next by a 1px paper
   hairline. The day's composition is legible in the bar itself.
6. **Graduations** (ticks every 10%, taller at 0/50/100, with 10px micro end-labels):
   the printed ruler that makes a fill length readable as a quantity.

Calories may flip figure, stamp and fill to Signal Red; protein, carbs and fat never
do, because exceeding them is not a failure — protein past goal reads as a "Goal met"
stamp with the surplus stated in ink.

**`GoalBar`** is the minor row: eyebrow left, remaining figure at 14px right, then a
6px ink-tinted bar with the raw ratio beside it. It carries no hero figure, no stamp,
no graduations — the difference in register is the point.

### Named Rules

**The Day Strip Rule.** A progress fill is never one solid block. It is segmented by
entry, so the bar answers "what made up this day" as well as "how far along am I". The
track's right edge always means *goal*, never *total eaten*: segments are clipped at
the goal and the overage is reported by the figure and stamp.

**The One Hero Rule.** One 44px figure per macro, two per screen, nowhere else in the
product. If a third hero figure appears on a surface, the surface has no subject.

### Charts

Recharts, styled to the same printed rules: amber bars at 14px width, a 2px green
protein line with 3px dots, dashed 4/4 goal reference lines in each macro's own accent,
an ink axis line on the x-axis only, no grid, and a square paper tooltip with a 1px ink
border. Axis labels are 11px in ink. Chart colors are currently hard-coded hex — they
must move to tokens when dark mode lands, or the chart will keep rendering light-mode
accents on a charcoal ground.

## Do's and Don'ts

### Do:
- **Do** lead every screen with one 20px/800 headline, top-left, and step straight down
  to 11px uppercase eyebrows for everything below it.
- **Do** put `tabular-nums` on every mutable figure — the Tabular Rule is what makes
  this read as an instrument rather than a page.
- **Do** encode rank in rule weight (4px / 2px / 1px) and let a 2px frame be the only
  thing that says "this is an instrument".
- **Do** clamp progress fills at 100% of the track; report an overage with the figure
  and its color, never by overrunning the bar.
- **Do** use `ink` at 70% or darker for any text at or below 14px. The current
  `text-ink/60` eyebrows measure 3.7:1 and `text-ink/40` nav labels and `×` buttons
  measure 2.6:1 — both fail WCAG AA and should be corrected to `/70` and `/60` on a
  paper ground.
- **Do** give the two accents a non-color partner. Amber and green at 3.4:1 and 4.6:1
  on paper cannot carry meaning alone; the eyebrow label is what actually names the
  row.
- **Do** route new colors through a measured quantity. If it isn't a macro or a state,
  it is ink, paper, or line.
- **Do** keep every interactive target at least 44px tall and reachable one-handed.

### Don't:
- **Don't** add a border radius anywhere, including on elements a library rounds by
  default. Zero Radius is absolute.
- **Don't** add a shadow, gradient, blur, or glass effect in either theme. Depth is
  rules and, in dark mode, one tonal step.
- **Don't** load a webfont. The system stack is a deliberate constraint — it renders
  instantly, offline, on every device, and the label character comes from weight and
  tracking instead.
- **Don't** use Signal Red for anything that is not a numeric state. Not for delete
  buttons, not for required-field markers, not for headings.
- **Don't** color protein, carbs or fat as an error when they exceed their goal. Only
  calories carry an over-state, and its exact threshold is a product decision recorded
  in PRODUCT.md — do not invent one.
- **Don't** reuse the light accents on the dark ground. Field Green sits at 2.1:1
  there; use the lifted dark tokens.
- **Don't** invert to pure black or pure white in dark mode. The stock stays warm.
- **Don't** introduce a second layout column, a desktop breakpoint, or an icon set.
  Each is a system-level change, not a component decision.
- **Don't** hard-code chart hex values in new work. Chart accents must resolve from
  tokens so both themes render correctly.
