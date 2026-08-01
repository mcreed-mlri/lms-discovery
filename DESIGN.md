---
name: The Studio
description: A calm cool-grey learning studio where colour is never decoration — only orientation or status.
colors:
  studio-blue: "#1c3fb0"
  signal-blue: "#2a5bff"
  studio-blue-tint: "#eaf0ff"
  studio-grey: "#f5f6f8"
  panel: "#eef0f4"
  surface: "#ffffff"
  surface-sunken: "#eef0f4"
  feature-surface: "#14161b"
  studio-ink: "#14161b"
  ink-muted: "#565c69"
  ink-soft: "#6a6d77"
  line: "#e4e7ed"
  line-strong: "#d3d8e0"
  line-soft: "#edeff3"
  line-control: "#83868c"
  hue-1-blue: "#2a5bff"
  hue-1-blue-tint: "#e9f0ff"
  hue-1-blue-ink: "#2a5bff"
  hue-2-violet: "#7a4fe0"
  hue-2-violet-tint: "#efeafd"
  hue-2-violet-ink: "#794ede"
  hue-3-pink: "#d24d83"
  hue-3-pink-tint: "#fce9f1"
  hue-3-pink-ink: "#b54271"
  hue-4-amber: "#c8791b"
  hue-4-amber-tint: "#fbf0dc"
  hue-4-amber-ink: "#9e5f15"
  hue-5-green: "#179a72"
  hue-5-green-tint: "#e2f4ed"
  hue-5-green-ink: "#137c5c"
  hue-6-sky: "#3a8ec9"
  hue-6-sky-tint: "#e7f3fb"
  hue-6-sky-ink: "#2f73a3"
  hue-7-indigo: "#5563d6"
  hue-7-indigo-tint: "#ebedfc"
  hue-7-indigo-ink: "#5361d2"
  hue-8-rust: "#bb573b"
  hue-8-rust-tint: "#fbe8e2"
  hue-8-rust-ink: "#ab5036"
  status-changed: "#c8493b"
  status-changed-tint: "#fbe9e6"
  status-green-ink: "#0f6e51"
  status-amber-ink: "#99610f"
typography:
  display-lg:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 720
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  display-sm:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  card-title:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  subtitle:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  reading:
    fontFamily: "'Segoe UI Variable', 'Segoe UI', Aptos, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "normal"
  meta:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  label:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.01em"
  label-sm:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  eyebrow:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  micro:
    fontFamily: "Geist, 'Segoe UI Variable', 'Segoe UI', Inter, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  badge: "6px"
  key: "7px"
  nav: "8px"
  control: "9px"
  input-prominent: "12px"
  card: "14px"
  overlay: "16px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  4xl: "40px"
  content-max: "1120px"
  rail-open: "248px"
  rail-collapsed: "68px"
components:
  button-primary:
    backgroundColor: "{colors.studio-ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.studio-ink}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.studio-ink}"
  button-secondary-active:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.studio-ink}"
  chip-suggestion:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-suggestion-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.studio-ink}"
  badge-type:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "18px"
  card-module:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "16px"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.studio-ink}"
    rounded: "{rounded.control}"
    padding: "0 16px 0 40px"
    height: "48px"
  input-search-prominent:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.studio-ink}"
    rounded: "{rounded.input-prominent}"
    padding: "0 64px 0 52px"
    height: "52px"
  select-refine:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  segment-track:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{rounded.control}"
    padding: "4px"
  segment-active:
    backgroundColor: "{colors.studio-ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.nav}"
    padding: "0 16px"
    height: "36px"
  segment-inactive:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.nav}"
    padding: "0 16px"
    height: "36px"
  nav-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
  nav-item-active:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.studio-ink}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
  feature-panel:
    backgroundColor: "{colors.feature-surface}"
    textColor: "{colors.surface}"
    rounded: "{rounded.input-prominent}"
    padding: "12px 16px"
---

# Design System: The Studio

## Overview

**Creative North Star: "The Studio"**

The Studio is a working surface, not a showpiece. A cool grey canvas holds white cards on hairline borders; typography carries the hierarchy; and colour is withheld until it has something to say. The name comes from the implementation itself — Studio Blue, the Studio canvas, `StudioShell`, `StudioRail` — and this document keeps that vocabulary rather than inventing a new one.

The system's discipline is a single decision applied everywhere: **colour is a signal, never decoration.** It speaks in exactly two languages that never mix. _Topic colour_ answers "which part of the curriculum am I in?" and appears only on small accents — a card's top rail, a parent-course pill, an icon well, a swatch in the rail. _Status colour_ answers "what state is this content in?" and always arrives with a text label beside it. The page itself stays silent: flat grey field, no gradients, no wallpaper, no illustration.

Its warmth is behavioural rather than chromatic. The surface temperature is deliberately cool and stays that way, but the system is built around someone under real pressure — an advocate with a hearing in an hour. So it never makes them decode a colour, never animates for its own sake, never rewards them for showing up. It labels things, keeps numbers tabular so they scan, dims what is secondary, and gets out of the way. Restraint is how this system is kind.

**Key Characteristics:**

- One typeface (Geist) doing every job, from 9px eyebrow to 2.15rem display
- Cool grey canvas (#f5f6f8) with pure white cards on 1px hairlines
- Two independent colour languages: topic (orientation) and status (lifecycle), never blended
- Eight matched hues at deliberately identical saturation, assigned by index so a grid reads as one family
- Flat at rest; depth is a response to interaction, not a resting state
- Full light and dark parity — every token is redefined, never filtered
- Colour never carries meaning alone; a text label is always present

## Colors

A cool, low-chroma neutral base with a single blue brand voice, plus two strictly separated signal palettes drawn from one eight-hue family.

### Primary

- **Studio Blue** (`#1c3fb0`): The brand voice at text weight — links, active nav icons, the avatar fill, the "Show more" affordance. Deep enough to read as body-adjacent text on white.
- **Signal Blue** (`#2a5bff`): The brighter sibling, used only for _fills_ — progress bars, the training-hours ring, weekly-activity squares, the accent stroke above an action section. Never used for running text.
- **Studio Blue Tint** (`#eaf0ff`): The pale wash behind "Continue"-style chips and next-up status pills.

### Secondary

The **eight-hue skill palette** — Blue, Violet, Pink, Amber, Green, Sky, Indigo, Rust — held at a deliberately matched saturation and lightness so that eight of them side by side read as one systematic family rather than a rainbow. They are assigned **by index**, wrapping after eight: the Nth skill area takes the Nth hue, and a skill area shares its hue with every course and module beneath it. That is the whole orientation mechanism.

Each hue carries **three roles**, exactly like the topic families: `solid` for strokes, swatches, and rails; `tint` for pale fills; and `ink` for text or glyphs sitting on that tint. The three-role split is not cosmetic — the saturated `solid` lands between 3.0:1 and 4.6:1 on its own pale tint, so using it for an 11px label fails WCAG 1.4.3. `ink` is the same hue darkened until it clears 4.5:1 (amber, the worst case, moves from 3.00:1 to 4.53:1). In dark mode the tints are deep enough that `ink` mirrors `solid`.

The **topic families** (Court Skills, Client Communication, Ethics, Legal Research, Drafting, Trauma-Informed Practice, Foundations) are not a separate palette. Every topic token is an alias onto a value in the eight-hue family — Court and Research both resolve to Sky, Ethics and Foundations both to Indigo, Client to Green, Drafting to Violet, Trauma to Pink. Built courses use their topic family; curriculum-generated items use an explicit hue index. Both paths land in the same eight values.

### Tertiary

The **status palette**, kept deliberately distinct in role from topic colour even where it reuses a hue value:

- **Green** (`#179a72`, ink `#0f6e51`): in progress, and completed.
- **Signal Blue** (`#2a5bff`): next up.
- **Amber** (`#c8791b`, ink `#99610f`): new, and updated.
- **Alert Red** (`#c8493b`, tint `#fbe9e6`, ink `#9c3528`): law changed or process changed — the only red in the system, and the only colour reserved for a substantive legal-content warning.
- **Grey** (`#8b909d`): later, not started, inactive.

### Neutral

- **Studio Grey** (`#f5f6f8`): the page canvas. Flat, cool, unbroken.
- **Panel / Sunken** (`#eef0f4`): section frames, segmented-control tracks, progress tracks, type badges, active-nav backgrounds.
- **Surface** (`#ffffff`): every card and raised panel. Pure white, no tint.
- **Feature Surface** (`#14161b`): the near-black inversion used for exactly one element per screen — the resume/handoff panel in the hero.
- **Studio Ink** (`#14161b`): primary text, the brand mark, and the primary-button fill.
- **Ink Muted** (`#565c69`): body copy and descriptions.
- **Ink Soft** (`#6a6d77`): metadata, captions, counts, default icon colour, placeholders. Set at the darkest of its three backgrounds (sunken, 4.53:1) because it is the smallest text in the product — never lighten it.
- **Line** (`#e4e7ed`) / **Line Strong** (`#d3d8e0`) / **Line Soft** (`#edeff3`): the hairline vocabulary — resting border, hover border, and inner divider respectively. Decorative separation only.
- **Line Control** (`#83868c`): the border of an input, select, or textarea. Visibly darker than the hairlines by necessity: a control's edge is information required to identify it, so WCAG 1.4.11 wants 3:1 (this lands at 3.65:1) where the hairlines sit near 1.2:1.

### Named Rules

**The Two Languages Rule.** Topic colour means _where_; status colour means _what state_. A single element never carries both. When a card needs both, topic goes to the rail and status goes to a labelled chip.

**The Never-Colour-Alone Rule.** No state, status, or category is communicated by hue alone. Every status pill pairs its dot with a word; every topic pill pairs its dot with the parent course name. This is a WCAG 1.4.1 obligation and it is also why the system survives being printed, dimmed, or read by someone colourblind.

**The Small-Accent Rule.** Topic colour appears only on small accents: a 4px card rail, a 2px list rail, a 9px swatch, a 6px dot, a chip fill, an icon well. It never fills a card, a section, or a page.

**The One Red Rule.** Alert Red (`#c8493b`) is reserved for substantive change notices — the law or process behind the content changed. It is never used for form validation, destructive actions, or emphasis.

**The Three Roles Rule.** Every accent colour — topic or hue — exists as `solid` / `tint` / `ink`. Strokes and rails take `solid`, fills take `tint`, and anything a person reads takes `ink`. Putting `solid` on `tint` is the one way this palette produces an accessibility failure, and it is always avoidable.

## Typography

**Display Font:** Geist (with Segoe UI Variable, Segoe UI, Inter, system-ui)
**Body Font:** Geist (same stack)
**Label Font:** Geist (same stack)
**Reading Font:** Segoe UI Variable / Segoe UI / Aptos — used only for long-form description copy

**Character:** One geometric sans doing every job. Hierarchy comes entirely from weight, size, and tracking rather than from contrast between families — display sizes pull tracking in to −0.03em and push weight to 720; labels push tracking out to +0.02em and sit at 600. The result is quiet and mechanical in a way a display-serif pairing would undercut.

### Hierarchy

A **15-step px ladder**. Every size in the product is one of these; there are no in-between values and no `rem` literals. Steps are dense at the small end, where most of the interface lives, and sparse at the display end.

`9 · 10 · 11 · 12 · 13 · 14 · 15 · 16 · 17 · 19 · 22 · 26 · 32 · 34 · 42`

- **Display LG** (42px, 700, 1.15, −0.02em): the dashboard page header.
- **Display** (34px, 720, 1.1, −0.03em): the hero greeting. One per page, and the top of the hero's `22 → 32 → 34` responsive climb.
- **Display SM** (32px, 700, 1.15): standalone page titles and the hero at `sm`.
- **Headline** (26px, 700, 1.2, −0.02em): the library section heading.
- **Title** (22px, 700, 1.2, −0.02em): section headings, and the hero at mobile width.
- **Card Title** (19px, 750, 1.2, −0.012em): the heaviest weight in the system, because a card title is the thing being scanned for.
- **Subtitle** (17px, 700, 1.25): skill-tile names, dark-panel titles.
- **Body LG** (16px, 400, 1.6): modal summaries and long-form intros.
- **Body** (15px, 400, 1.6): the app default, set on `body`.
- **Reading** (14px, 400, 1.58, Segoe UI Variable stack): card descriptions, capped at `max-w-2xl` (~65ch).
- **Meta** (13px, 600, +0.01em): the workhorse — metadata, nav links, stat labels, durations, counts. The single most-used step.
- **Label** (12px, 600): chips, badges, secondary counts.
- **Label SM** (11px, 600, +0.02em): dense chrome, keyboard hints.
- **Eyebrow** (10px, 600, +0.06em, uppercase): rail section headers.
- **Micro** (9px, 600, +0.04em, uppercase): the small caps on the dark feature panel only.

Sentence case everywhere except **Eyebrow** and **Micro**, the only two uppercase steps.

### Named Rules

**The One Family Rule.** `--font-sans`, `--font-serif`, and `--font-mono` all resolve to Geist. This is deliberate, not an oversight: the "mono" role exists for eyebrows, counts, and percentages, and a real monospace webfont rendered blurry at 9–11px. If a second family is ever introduced, it must earn its place against this rule explicitly.

**The Tabular Numbers Rule.** Every number that a user compares or watches change — durations, counts, percentages, training hours — carries `tabular-nums`. Digits must not shift width as they update.

**The Sentence-Case Rule.** Labels are sentence case. Uppercase is reserved for the 9px and 10px steps and nothing else; uppercasing a readable-size label is a regression.

**The Fifteen Steps Rule.** The ladder above is the whole scale. A new size is not a local decision — if a design genuinely needs a step that isn't there, add it here first. `rem` literals in component classes are how the scale rotted to 38 values once already.

## Layout

A **two-zone shell**: a fixed left rail and a scrolling content column. The rail is 248px expanded, 68px collapsed to icons, with the collapse preference persisted per user; it becomes an overlay drawer below `lg` and is replaced by a bottom tab bar on mobile. Content is centred in a **1120px column** with 16px / 24px / 40px horizontal padding across the small / sm / lg breakpoints. The homepage opts out of the padded column so its hero and sections can run full-bleed against the canvas.

Section rhythm is expressed as **spacing plus a hairline**, never as a nested box — `.section-panel` is a single `border-top`. Catalog grids run 2 columns at `sm`, 3 at `lg`, 4 at `xl` with a fixed 16px gap. Cards hold a minimum height (180px for modules, 252px for courses) so a row stays even, and push their footer to the bottom with `mt-auto` so metadata aligns across a row regardless of title length.

Density shifts materially at `sm`. Below it, descriptions are hidden entirely, cards drop to 12px padding, list rows replace the grid, and metadata moves up beside the type badge — the mobile view is a scannable index, not a shrunken desktop. Sticky filters offset 3.25rem on mobile and 5rem above `sm`. Safe-area insets are honoured on the skip link, bottom nav, mobile drawer, and modal padding.

Breakpoints are Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. The rail/drawer switch is at `lg`; the grid/list switch is at `sm`.

## Elevation & Depth

**Flat at rest; depth is a response, not a state.** In-page surfaces sit on a 1px hairline with a shadow so faint it reads as a seam (`0 1px 2px rgba(20,22,27,0.04)`). On hover a card gains its border-strong colour, a whisper of tint, and a soft ambient shadow — the depth arrives _because_ the user pointed at it. Default cards do not translate; only `.interactive-tile` lifts, and only by 1px.

Overlays are the deliberate exception. Modals, the global search dialog, and the mobile drawer float freely on the heaviest shadow plus a `backdrop-blur-sm` scrim over near-black at 34–40% opacity. They are a different plane, and they are allowed to look like it.

Depth otherwise comes from **tonal layering**, not shadow: sunken (`#eef0f4`) for tracks and segmented-control wells, canvas (`#f5f6f8`) for the page, surface (`#ffffff`) for cards. Three tones, three planes.

### Shadow Vocabulary

- **Seam** (`box-shadow: 0 1px 2px rgba(20,22,27,0.04)`): the resting state of every card and control. Barely visible by design.
- **Ambient** (`box-shadow: 0 1px 2px rgba(20,22,27,0.04), 0 6px 18px rgba(20,22,27,0.06)`): hover on cards and tiles, and the resting state of the prominent search field and hero panels.
- **Overlay** (`box-shadow: 0 8px 24px rgba(20,22,27,0.1), 0 2px 6px rgba(20,22,27,0.06)`): modals, dialogs, suggestion dropdowns, the mobile drawer, the skip link.

Dark mode redefines all three with black at 0.2–0.38 alpha rather than reusing the light values.

Focus is **not** part of the depth system. It is a solid 2px `brand` outline at 2px offset, applied through the `.focus-ring` / `.focus-ring-inverse` classes — never a shadow, never a translucent ring. A 15%-alpha ring measures 1.24:1 against white; the solid outline measures 6.0–8.8:1 across every surface in both themes.

### Named Rules

**The Flat-At-Rest Rule.** In-page surfaces rest on a hairline and the Seam shadow. Resting elevation above Seam is reserved for overlays and the prominent search field. If a surface looks lifted before the user touches it, it is wrong.

**The Hairline-First Rule.** Separation is a 1px line before it is ever a shadow. `line` at rest, `line-strong` on hover, `line-soft` for dividers inside a surface. Form controls are the exception and take `line-control`.

**The One Focus Rule.** Every interactive element gets `.focus-ring` (or `.focus-ring-inverse` on the dark feature panel) and nothing else. No per-component focus treatments, no translucent rings, and never `outline: none` without a replacement — the class already scopes the outline to `:focus-visible`, so pointer users never see it.

## Shapes

A **two-radius system** with a pill exception. Containers round at 14px (`--radius-card`); controls round at 9px (`--radius-control`). Small chrome tightens further — 8px for rail items and segment buttons, 7px for the keyboard-shortcut key, 6px for type and status badges. Overlays round at 16px, and on mobile the detail modal squares its bottom corners entirely to sit as a bottom sheet against the viewport edge.

Fully round (999px) is reserved for things that are conceptually _tokens_ rather than containers: suggestion chips, topic pills, primary and secondary buttons, progress tracks, dots, and the avatar. The primary CTA being a pill while its container is 14px is intentional — the action reads as a distinct object, not a region of the panel.

The recurring silhouette is the **accent rail**: a 4px bar across the top of a card, a 2px bar down the left of a list row or syllabus entry, drawn with a `::before` pseudo-element in the item's topic colour at 85% opacity. It is the system's signature and the only place topic colour appears at any scale.

Borders are 1px and universal; every surface has one. There are no borderless cards, and no card relies on shadow alone to define its edge.

## Components

Buttons, cards, and inputs are **restrained and precise**. Nothing is approximate: radii are 14px and 9px, not "rounded"; the rail is 248px, not "about 250"; card titles sit at weight 750, not 700 or 800. At rest components are nearly silent, and the whole state vocabulary is carried by border colour, a tint shift, and a shadow step.

### Buttons

- **Shape:** Fully round pill (999px) for the primary and secondary actions; 9px for utility controls like Refine.
- **Primary:** Studio Ink fill, white text, 44px tall, 20px horizontal padding, bold, with a leading 16px icon. Hover reduces opacity to 90% rather than shifting hue.
- **Secondary:** White fill, 1px `line` border, muted ink text, same 44px height. Hover moves the border to `line-strong` and the text to full ink. Its selected state (an item already saved) swaps to a sunken fill with a `line-strong` border.
- **Focus:** `.focus-ring` — a solid 2px `brand` outline at 2px offset, on `:focus-visible`. The system's single focus treatment; buttons, links, inputs, chips, nav items, and cards all use the same class.
- **On the dark feature panel:** white fill, near-black text, and `.focus-ring-inverse`, because brand blue has too little separation from `#14161b`.

### Chips

- **Suggestion chips** (popular searches, no-result suggestions): pill, white fill, `line` border, muted ink at 12–13px. Hover moves border and text one step darker. No fill change.
- **Type badge** (Course / Module / Path): 6px radius, sunken fill, soft ink, 12px icon, sentence case. Deliberately the most neutral chip in the system — it describes the _shape_ of the content, so it must never compete with topic or status colour on the same card.
- **Status pill**: 6px radius, soft status fill, status-ink text, neutral `line` border, with a 6px saturated dot and always a word.
- **Topic pill** (parent course on a module card): tinted in the item's accent, accent-ink text, neutral border, 6px accent dot.
- **Active filter chip**: pill with full-ink text and a `✕` plus a screen-reader-only "Clear filter".

### Cards / Containers

- **Corner Style:** 14px (`--radius-card`).
- **Background:** Pure white surface on the grey canvas.
- **Shadow Strategy:** Seam at rest, Ambient on hover. See Elevation.
- **Border:** 1px `line`, moving to the item's **accent colour** on hover — the hover border is itself an orientation cue, not just a highlight.
- **Internal Padding:** 18px for course cards, 16px for module cards, 12px on mobile, with an extra 2–4px on top to sit clear of the accent rail.
- **Structure:** badge row → title (2-line clamp) → optional topic pill → description (2–3 line clamp) → `line-soft` divider → footer with metadata and a Details affordance. The footer is pushed down with `mt-auto` so it aligns across a row.

### Inputs / Fields

- **Style:** White fill, 1px **`line-control`** (not the decorative hairline), 9px radius (12px for the prominent variant), 48px tall (52px prominent), leading search icon in soft ink, semibold input text with a normal-weight placeholder.
- **Focus:** Border shifts to Studio Blue and the `.focus-ring` outline appears; the leading icon also shifts to brand colour via `group-focus-within`. Hover moves the border **darker** to `ink-soft` — a control's hover must never reduce its own edge contrast.
- **Prominent variant:** carries the Ambient shadow at rest and a `Ctrl K` key hint in a 7px-radius sunken well, hidden below `sm`.
- **Suggestions:** a 12px-radius overlay-shadowed listbox, each row a two-column grid of badge + context + title against an "Open" tag, with the active row on a sunken fill. Full combobox semantics — `role="combobox"`, `aria-expanded`, `aria-activedescendant`, arrow/enter/escape keys.
- **Selects (Refine):** 44px tall, 9px radius, bold muted text, same focus treatment as inputs.

### Navigation

- **Rail:** White surface against the grey canvas, separated by a right hairline. Items are 9px-radius rows at 13.5–14px, muted ink with soft-ink icons; the active item takes a sunken fill, weight 650, full ink, and a **brand-coloured icon**. Width transitions over 200ms on `cubic-bezier(.4,0,.2,1)`.
- **Brand mark:** a 30px Studio Ink square holding a scales-of-justice glyph, doubling as the collapse toggle, with the wordmark beside it at 20px/700/−0.02em.
- **Skill areas:** a labelled group below the primary nav, each row a 9px rounded swatch in the area's indexed hue plus a name and a count, capped at 7 with a "Show more" toggle. Collapsed, all swatches show — the compact form fits.
- **Mobile:** the rail becomes a left drawer over a `rgba(20,22,27,0.4)` scrim; a fixed bottom tab bar takes over primary navigation with brand-coloured active icons. The bar's item count changes by role.
- **Segmented control:** a sunken 9px track with 4px padding holding 8px-radius 36px buttons; the active button inverts to Studio Ink with white text plus a 1px inner white highlight, while the view-mode toggle's active state instead lifts to a white surface with a border.

### The Accent Rail

The system's signature component. Every catalog item exposes its colour as three CSS custom properties (`--accent`, `--accent-tint`, `--accent-ink`) set inline on the element, so static Tailwind classes like `bg-[color:var(--accent)]` can pick up a data-driven hue without runtime class names. The rail renders as a `::before` pseudo-element: 4px across the top of a card at 85% opacity, 2px down the left of a list row or syllabus entry at full opacity. Cards, list rows, path cards, and modal syllabus rows all share this mechanism.

## Do's and Don'ts

### Do:

- **Do** keep colour to the two languages: topic for orientation, status for lifecycle. If a new colour need doesn't fit either, the answer is a neutral.
- **Do** pair every status and topic colour with a text label. Colour alone is never the signal.
- **Do** define new colours as CSS custom properties in `app/globals.css` under both `:root` and `[data-theme="dark"]`, then expose them through `tailwind.config.ts`. Both themes, always, in the same commit.
- **Do** use `var(--radius-card)` (14px) for containers and `var(--radius-control)` (9px) for controls.
- **Do** put `.focus-ring` on every interactive element, and `.focus-ring-inverse` on the dark feature panel. Never hand-roll a focus treatment.
- **Do** give comparable numbers `tabular-nums`.
- **Do** let the hairline do the separating — `line` at rest, `line-strong` on hover, `line-soft` inside a surface — and use `line-control` on inputs, selects, and textareas.
- **Do** pick every font size from the 15-step px ladder.
- **Do** use an accent's `ink` role for anything readable and `solid` only for strokes and rails.
- **Do** make an element that opens a dialog a `<button>`. A link whose `href` is a fragment that doesn't exist lies to assistive tech.
- **Do** give controls a 24×24 minimum hit area, and announce result-count changes in a polite live region.
- **Do** set an item's accent through the `--accent` / `--accent-tint` / `--accent-ink` inline custom properties, and write Tailwind arbitrary values out in full so the content scanner keeps them.
- **Do** hide description copy and switch to list rows below `sm`. Mobile is an index, not a shrunken desktop.
- **Do** cap reading copy at `max-w-2xl` (~65ch).
- **Do** meet WCAG 2.2 AA, including target size — controls sit at 36px minimum, and 44px for primary actions.

### Don't:

- **Don't** fill a card, section, or page with topic colour. Topic colour lives on rails, dots, swatches, wells, and chip tints only.
- **Don't** use Alert Red (`#c8493b`) for anything but a substantive law-or-process change notice.
- **Don't** add a gradient, glow, glassmorphism, or a neon dark mode. The canvas is a flat cool grey field; blur exists only on overlay scrims. No AI-SaaS dashboard cliché.
- **Don't** reintroduce legacy-LMS chrome — bevels, dense tab strips, tables used for layout, or a second nav bar. The hub exists as the alternative to that.
- **Don't** let calm become lifeless. Corporate compliance grey is the failure mode on the other side: the eight hues, the accent rails, and the near-black feature panel are what keep the system from flattening into enterprise grey-on-grey.
- **Don't** give a resting surface more than the Seam shadow. Lift is a response to interaction; overlays and the prominent search field are the only exceptions.
- **Don't** introduce a second typeface without explicitly overturning The One Family Rule.
- **Don't** uppercase anything at readable size. Uppercase belongs to the 9px and 10px steps.
- **Don't** write a `rem` font size or an off-ladder px value in a component class.
- **Don't** use an accent's saturated `solid` as text or as a glyph on its own tint — that is the palette's one reliable contrast failure.
- **Don't** let a control's hover state lighten its border. Hover goes darker; anything else trades contrast for feedback.
- **Don't** render a mobile tree and a desktop tree and hide one with `sm:hidden`. Branch on `useIsDesktop()` and render once.
- **Don't** build a new light-mode token and leave dark mode to a filter or an opacity trick. Every token is redefined by hand.
- **Don't** add warm neutrals. Legacy warm values survive in a few places (the gold `::selection` wash, the brown-tinted `nav-link-active` shadows, the `--lace-gold` / `--accent-gold` aliases) as leftovers from an earlier palette; they are drift to be retired, not precedent to follow.
- **Don't** animate for its own sake. Transitions are 160–200ms `ease`/`ease-out` on colour, border, shadow, and at most a 1px translate; entrance animations are 220–320ms on `cubic-bezier(0.16,1,0.3,1)` and reserved for overlays.
- **Don't** blanket-kill motion under `prefers-reduced-motion`. The rule keeps colour, border, shadow, and opacity transitions and drops only movement — a 0.01ms global also destroys the state feedback those transitions carry.
