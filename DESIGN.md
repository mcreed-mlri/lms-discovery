---
name: The Binder
description: A ring binder of the curriculum. Divider tabs on the page's fore-edge are the navigation; the open page holds today's work.
colors:
  brand-ultramarine: "#2f45b5"
  brand-ink: "#24379a"
  brand-tint: "#eceefa"
  brand-on: "#ffffff"
  ink: "#16161a"
  ink-muted: "#45454d"
  ink-soft: "#66666e"
  paper: "#ffffff"
  surface-sunken: "#f2f2ee"
  hover-tint: "#f6f6f2"
  line: "#e2e2dc"
  line-strong: "#cfcfc7"
  line-control: "#7a7a72"
  chipboard: "#c9c4bb"
  sheet-edge: "#2a2622"
  tab-home-orange: "#dc6a3c"
  tab-browse-amber: "#e8a33c"
  tab-paths-green: "#5a9e45"
  tab-learning-teal: "#2f9a9a"
  tab-updates-periwinkle: "#6683e6"
  tab-on: "#16161a"
  feature-surface: "#17181c"
  feature-ink: "#ffffff"
  feature-muted: "#b9bbc0"
  hue-1-ultramarine: "#2f45b5"
  hue-2-teal: "#0b6b6b"
  hue-3-grass: "#3f7f2e"
  hue-4-chrome-yellow: "#e8b500"
  hue-5-oxide-orange: "#dc6a3c"
  hue-6-violet: "#6b3fa0"
  hue-7-graphite: "#45454d"
  hue-8-sienna: "#8a5a3c"
  status-progress: "#179a72"
  status-progress-ink: "#0f6e51"
  status-next: "#1c63b0"
  status-new: "#c8791b"
  status-new-ink: "#99610f"
  status-changed: "#c8493b"
  status-changed-soft: "#fbe9e6"
  status-changed-ink: "#9c3528"
  status-later: "#8b909d"
typography:
  display:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 720
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  row:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  tab-label:
    fontFamily: "Public Sans, Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.01em"
rounded:
  link: "3px"
  pill: "4px"
  action: "7px"
  field: "8px"
  control: "9px"
  feature: "12px"
  tab: "0 12px 12px 0"
  sheet: "6px 14px 14px 6px"
  card: "14px"
spacing:
  board-margin: "20px"
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "44px"
  column-gap: "44px"
  content-max: "1180px"
  side-column: "392px"
components:
  binder-tab:
    backgroundColor: "{colors.tab-home-orange}"
    textColor: "{colors.tab-on}"
    rounded: "{rounded.tab}"
    width: "52px"
    height: "116px"
    typography: "{typography.tab-label}"
  binder-tab-hover:
    width: "58px"
  binder-tab-open:
    width: "66px"
  resume-card:
    backgroundColor: "{colors.feature-surface}"
    textColor: "{colors.feature-ink}"
    rounded: "{rounded.feature}"
    padding: "20px 24px"
  button-resume:
    backgroundColor: "{colors.feature-ink}"
    textColor: "{colors.feature-surface}"
    rounded: "{rounded.action}"
    height: "40px"
    padding: "0 16px"
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "40px"
    padding: "0 20px"
  button-quiet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  search-field-prominent:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "56px"
    padding: "0 80px 0 52px"
  ruled-row:
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    height: "44px"
    padding: "8px 2px"
  status-pill-law-changed:
    backgroundColor: "{colors.status-changed-soft}"
    textColor: "{colors.status-changed-ink}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  catalog-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px 20px 20px"
  avatar:
    backgroundColor: "{colors.brand-ultramarine}"
    textColor: "{colors.brand-on}"
    size: "38px"
---

# Design System: The Binder

## Overview

**Creative North Star: "The Ring Binder"**

The Learning Hub is a ring binder of the curriculum. A true-white page sheet, outlined in dark ink (1.5px) with tighter spine corners and rounder fore-edge corners, lies on a warm-grey chipboard board with a fine paper grain. Five divider tabs sit flush under the sheet's right edge in saturated binder colours, and the open section's divider is pulled out further than the rest. The open page holds today's work. This replaces the retired "Studio" system, and it turns down the LMS dashboard default: no greeting-plus-stat-tile header, no card grid on Home, no sidebar as the main navigation.

The page is dense but quiet. Hierarchy comes from near-black ink, one workhorse family (Public Sans) on a steep size ramp, and ruled lists in place of cards. Colour is rationed: each hue means one thing (section, skill area, or state) and is never decoration. There is one inverted near-black element per page, the resume card, and it carries the page's main handoff into Brightspace. Light mode is primary. Dark mode keeps the same structure: a deep board, a lifted sheet, tab fills unchanged, and every hue lifted until it clears its measured contrast on dark grounds.

Motion belongs to the dividers. When a page arrives, its tab slides out from the closed position (260ms, exponential ease-out) and the previous one slides shut. Hovering draws a tab out slightly. Nothing else on the page performs.

**Key Characteristics:**

- White page sheet on a constant warm-grey chipboard board (desktop, 1024px and up); the sheet fills the screen below that.
- Five divider tabs on the right fore-edge are the primary desktop navigation. On phones the bottom bar shows the same dividers edge-on.
- The open section's tab colour runs along the sheet's header rule (3px), the only place a tab colour enters the page.
- Public Sans for every role; weight and size carry the hierarchy.
- Ruled lists with a 1.5px ink top rule and hairline rows, not cards, on Home.
- One near-black resume card per page.
- Every text/fill pairing with a recorded ratio is measured and locked (ADR 0008).

## Colors

A white-and-ink page on warm chipboard, with saturated binder colours rationed to signal duty only.

### Primary

- **Binder Ultramarine** (brand-ultramarine): means _interactive_. Used for links such as "All updates", the search icon on focus, progress fills, the avatar fill, and the focus ring. Text in brand colour on light grounds uses **Deep Ultramarine** (brand-ink). Text sitting on a solid ultramarine fill uses **Brand On** (brand-on), which flips to dark ink in dark mode, where ultramarine lifts to #8b9cf0.
- **Ultramarine Wash** (brand-tint): pale fill behind "Continue"-type chips.

### Secondary: the divider set (section identity)

- **Home Orange** (tab-home-orange), **Browse Amber** (tab-browse-amber), **Paths Green** (tab-paths-green), **Learning Teal** (tab-learning-teal), **Updates Periwinkle** (tab-updates-periwinkle). Each fill is light enough to take the same dark ink (tab-on), as a single printed divider set would: 5.30, 8.37, 5.51, 5.34 and 5.12:1. Tab fills stay the same in dark mode. Updates is periwinkle, not ultramarine, so it can take dark ink like the other tabs. Ultramarine stays reserved for interaction. (The direction contract named an ultramarine Updates tab. The build changed it, and the build is what this file records.)
- **Learning Teal** also rings the current stop on the resume card's lesson line. That is the one place a tab colour appears inside the page body, because the resume card belongs to My learning.

### Tertiary: skill hues (area identity)

- Eight binder-divider hues, assigned by skill lens in `lib/skill-hue.ts` and never by grid position: **Ultramarine** (hue-1), **Teal** (hue-2), **Grass** (hue-3), **Chrome Yellow** (hue-4), **Oxide Orange** (hue-5), **Violet** (hue-6), **Graphite** (hue-7), **Sienna** (hue-8). Each hue has three roles. `solid` is for swatches, rails and dots. `-tint` is for pale fills. `-ink` is for text on that tint, measured at 4.5:1 or better. A skill keeps its hue on the Home curriculum index, the drawer swatches, and every course and module card in that area. Topic-family tokens alias onto these same eight values.

### Status (state)

- **Progress / Done Green** (status-progress, ink status-progress-ink), **Next Blue** (status-next), **New / Updated Amber** (status-new, ink status-new-ink), **Later Grey** (status-later).
- **Law-Changed Red** (status-changed, soft status-changed-soft, ink status-changed-ink): marks content where the law changed, plus the unread dot on the Updates bell that leads to those notices.

### Neutral

- **Ink** (ink): headings, row labels, the wordmark, ruled-list top rules, and the solid "black" action.
- **Muted Ink** (ink-muted): body copy and descriptions.
- **Soft Ink** (ink-soft): metadata, counts, captions, placeholders. Measured at 4.5:1 on white, paper and sunken grounds. Do not lighten it.
- **Page White** (paper): the sheet's ground. **Sunken** (surface-sunken) is for tracks, key hints and chips. **Whisper** (hover-tint) is the row hover fill.
- **Hairline** (line), **Strong Hairline** (line-strong): decorative dividers and card edges. **Control Edge** (line-control): the 3:1 boundary for inputs and selects (WCAG 1.4.11). Hairlines cannot stand in for it.
- **Chipboard** (chipboard; dark #2b2926): the board, with a 160px inline fractal-noise grain at 16% alpha. **Sheet Edge** (sheet-edge; dark #4a4640): the outline of the page and the tabs.
- **Resume Black** (feature-surface; dark lifts to graphite #23262c), with **Feature Ink** (feature-ink) and **Feature Muted** (feature-muted): the single inverted element per page.

### Named Rules

**The Signal Rule.** Colour is a signal, never decoration. Tab colour means section, skill hue means area, status colour means state, and ultramarine means interactive. If a colour on screen answers none of those, remove it.

**The Law-Changed Red Rule.** Red appears only for law-changed notices and for the unread dot that leads to them. Errors, deadlines and emphasis do not get red.

**The Measured Pair Rule.** Every token with a recorded contrast ratio in `app/globals.css` is locked (ADR 0008). Changing one means running `npm run e2e`, whose axe sweep checks every route in both themes. Saturated hue solids are never used as text; use the `-ink` member of the pair. Text on solid ultramarine uses `--brand-on`, not white.

**The Constant Board Rule.** The chipboard board does not change between sections, and no tab colour matches it. The sheet carries the section; the board stays put.

## Typography

**Display Font:** Public Sans (via `next/font`, variable; falls back to Segoe UI Variable, Segoe UI, system-ui)
**Body Font:** Public Sans
**Label/Mono Font:** Public Sans (the `--font-mono` and `--font-serif` tokens both resolve to it)

**Character:** One sturdy civic grotesque handles every job. The ramp is steep, from a heavy 42px greeting down to 12px counts, and the weight stays high in headings (720–800), so the page reads like a printed reference manual rather than an app.

### Hierarchy

- **Display** (720, 42px desktop / 32px phone, 1.08): the page's one greeting or page title.
- **Headline** (800, 22px): section heads such as "The curriculum", and the resume card's course title.
- **Title** (800, 17px): side-column heads such as "Available now" and "Updates". The wordmark also sits at 17px / 800.
- **Body** (400, 15px, 1.6): running copy and descriptions in muted ink.
- **Row** (600–700, 14px): ruled-list entries and item titles.
- **Label** (600, 12–13px): metadata lines, counts with tabular numerals, "Often searched", lesson lines. Sentence case.
- **Tab label** (700, 13px, +0.01em): set vertically along the divider (`writing-mode: vertical-rl`).

### Named Rules

**The One Family Rule.** Public Sans is used for every role. Hierarchy comes from size and weight, never from a second face.

**The Sentence Case Rule.** Headings, labels, tabs and buttons are in sentence case. No all-caps tracking labels, and no eyebrow or kicker line above a heading. The heading names the section itself.

**The 16px Field Rule.** On coarse pointers, every text input, select and textarea renders at 16px or larger so iOS does not zoom, which would leave the page panning sideways. Never use `maximum-scale` to get around this.

## Layout

On desktop (1024px and up) the binder sits inside a 20px board margin: the sheet fills the remaining width and is at least the viewport height minus 40px. The tab column sits to its right, sticky 20px from the top, with the first tab starting 72px down so it clears the header row. Below 1024px the sheet is the whole screen, navigation moves to a fixed bottom bar, and the full rail opens as a drawer.

Inside the sheet, content is centred in a 1180px column with gutters of 16px (phone), 24px (640px and up) and 44px (desktop). Home uses a two-column grid on desktop: a flexible main column and a 392px side column, separated by a 44px gap. The main column holds the greeting, the 56px search and the curriculum index. The side column holds the resume card, "Available now" and one update. On phones everything stacks in reading order. The curriculum index is a two-column ruled grid with a 40px column gap from 640px up, and a single column below that.

The header is a slim sticky bar at the top of the sheet. Its height is `--studio-chrome`, and sticky offsets are measured against it. On phones it carries only the menu, wordmark and avatar, because search, updates and theme each have a home in the bottom bar or drawer. The bottom bar reserves `--safe-bottom`, and the content column reserves the same amount, so the two cannot drift apart.

**The Ruled List Rule.** On Home, indexes and lists are ruled: a 1.5px ink top rule, hairline row separators, rows at least 44px tall, and a Whisper fill on hover. Do not wrap Home lists in cards.

## Elevation & Depth

The system is flat paper with one physical cast. The sheet throws a soft shadow onto its tabs (`6px 0 10px -4px` in sheet-shadow), and that is what makes the tabs read as tucked under the page. Each tab has a faint darkening gradient toward its free end. Everything else on the sheet is flat: hairlines separate, and the near-black resume card carries weight through inversion, not lift. Overlays (search dialog, drawer, suggestion list, detail sheet) are the only things that float, and they use the large ambient shadow.

### Shadow Vocabulary

- **Sheet cast** (`box-shadow: 6px 0 10px -4px rgba(40, 32, 24, 0.42)`; dark rgba(0,0,0,0.55)): the page sheet over the tabs, desktop only.
- **Hairline lift** (`box-shadow: 0 1px 2px rgba(22, 22, 26, 0.05)`): resting catalog cards and quiet fields.
- **Overlay** (`box-shadow: 0 8px 24px rgba(22, 22, 26, 0.12), 0 2px 6px rgba(22, 22, 26, 0.07)`): dialogs, the drawer, suggestion lists, the skip link.

### Named Rules

**The One Resume Card Rule.** A page has at most one near-black feature surface. On Home it is the resume card (or the Manager card for admins). It is not a style for promoting other content.

## Shapes

The binder's silhouette is asymmetric. The sheet has 6px corners at the spine and 14px at the fore-edge. Tabs have square corners where they meet the sheet and 12px corners at their free end. They have no left border, so the sheet's outline and cast cover the join. On phones, bottom-bar dividers are 6px-topped tab edges with 1.5px ink outlines. Inside the sheet, corners get smaller as elements get smaller: the resume card 12px, catalog cards 14px, controls 9px, the prominent search field 8px, actions on the feature surface 7px, status pills 4px, inline links 3px (focus shape only). Skill swatches are tiny dividers, 10 × 14px with 2px rounded tops. Lines do the structural work: a 1.5px ink outline for the binder and list heads, hairlines for everything else.

## Components

### Binder tabs (signature)

The primary desktop navigation: Home, Browse, Learning paths, My learning, Updates (admins see Manager in place of the learner tabs).

- **Shape:** 52px wide and at least 116px tall, overlapping by 1.5px, 1.5px sheet-edge outline with no left border, 12px rounded free end.
- **Colour:** each tab sets `--tab` from its tone. The label is in tab-on ink at 13px / 700, set vertically.
- **States:** hover widens to 58px (180ms). The open section (`aria-current="page"`) is 66px wide and stacks above its neighbours. On section change the new tab animates 52→66px and the old one 66→52px (260ms, `cubic-bezier(0.16, 1, 0.3, 1)`), with no fill mode, so hover takes over afterwards. A fresh load shows the tab already open.
- **Focus:** a 2px ink outline (not ultramarine) at 3px offset, because ultramarine would sit too close to the periwinkle tab.
- **Reduced motion:** the tab keeps its open position and nothing moves.

**The Still Divider Rule.** Under `prefers-reduced-motion`, every divider shows its final position immediately. State feedback (colour, border, focus) survives; movement does not.

### Bottom bar (phones)

Six slots: Home, Browse, Paths, Learning, Updates, Search. Each section shows its tab colour as a divider edge above it, 7px tall at rest and 12px raised when open, with ink label text. Inactive slots use soft ink. The bar has a 1.5px sheet-edge top rule. The Updates slot carries the law-changed red unread dot.

### Header and section rule

The wordmark "Learning Hub" (17px / 800) at left. On desktop, the theme toggle, the notifications bell (38px, 9px radius, hairline edge) and the avatar at right. On desktop the header's bottom rule is 3px in the open section's tab colour; on phones it is a hairline.

### Resume card

- **Surface:** Resume Black, 12px radius, 20–24px padding, at most one per page.
- **Content:** a 22px / 800 course title, a "Next:" line in feature-muted, a lesson-stop line (filled stops for done lessons, hollow for upcoming ones, the current stop 20px with a Learning Teal ring and "You are here" set under it), and a 12px lesson line ending "opens in Brightspace".
- **Action:** a white **Resume** button (40px, 7px radius, 14px / 700, with the arrow turned to point out). It uses the inverse focus ring (2px white). In dark mode the button becomes graphite with a hairline border.

### Buttons

- **Solid (ink):** ink fill with page-white text, 9px radius, 36–40px tall, 700 weight. This is the "chosen" or maximum-contrast action. It inverts to near-white in dark mode through the `--solid-bg`/`--solid-ink` pair.
- **Quiet:** white fill, hairline edge, ink or muted text, 9px radius. The edge strengthens on hover.
- **Text links:** ink with a 3px-offset underline for in-copy links, or ultramarine for "All …" links. "Often searched" terms are ink with a Control Edge underline that turns to ink on hover.
- **Pressed (touch):** a brightness step (`--press`, 0.92; 1.25 in dark mode) on `:active` under `hover: none`, which survives reduced motion.

### Search field

- **Prominent (Home, Browse, dialog):** 56px (48px on phones), 1.5px Control Edge border, 8px radius, white fill, 17px / 600 text with a regular-weight placeholder in soft ink. The placeholder is phrased in case terms ("What's in front of you today? Try "notice to quit""). A 22px search icon turns ultramarine on focus, and a "Ctrl K" key hint sits on a sunken chip.
- **Focus:** the border turns ultramarine and the 2px ultramarine focus ring appears.
- **Suggestions:** a floating list with a 12px radius, overlay shadow, type badge plus context line, and the active row in a sunken fill.

### Ruled rows

Curriculum index and "Available now". Below a 1.5px ink top rule, each row is at least 44px tall with a hairline bottom, in 14px / 600–700 ink. Curriculum rows lead with a skill-hue swatch and end with a soft-ink count reading "N planned". Available rows show a title, a meta line (practice area · modules · minutes) and "Open →" in ink.

**The Planned Label Rule.** Anything not yet built says so in place: "N planned" counts, "Planned" in card footers, "Not set yet" for durations. Never present a planned item as available, and never invent a length for it.

### Status pills

4px radius, hairline edge, soft fill with ink text from the state's own trio (for example, Law changed is shown as status-changed-ink on status-changed-soft). The update card on Home pairs the pill with "Sample, not reviewed" in soft ink. Sample content is always labelled as sample.

### Catalog cards (Browse)

Flat white tiles with a 14px radius, hairline edge and hairline lift. A 4px skill-hue rail runs across the top (85% opacity). Content is a 16–17px / 700 title, a two-line muted description, and a 12px footer with a hue dot, the type, the length or "Planned", and an arrow. On hover the edge takes the skill hue, the fill becomes Whisper, and the arrow nudges 2px. The list variant moves the rail to a 2px left edge.

### Focus

One treatment across the app: a 2px solid ultramarine outline at 2px offset, shown on `:focus-visible` only (6.0–8.8:1 on every surface). Controls on the resume card use a 2px white outline. Binder tabs use an ink outline.

## Do's and Don'ts

### Do:

- **Do** keep the five dividers in their fixed order and colours (Home orange, Browse amber, Paths green, Learning teal, Updates periwinkle), each with dark tab-on ink.
- **Do** let the open section's colour reach into the page only through the header's 3px bottom rule (and the resume card's teal current-stop ring).
- **Do** assign skill hues by skill id through `lib/skill-hue.ts`, so an area keeps its colour on every surface.
- **Do** use the `-ink` member of a hue or status trio for any text on its tint.
- **Do** run `npm run e2e` (axe, both themes) after touching any token with a recorded ratio.
- **Do** label planned items and sample content where they appear.
- **Do** build Home lists as ruled rows with a 1.5px ink top rule.
- **Do** keep tab motion at 260ms exponential ease-out and drop it entirely under reduced motion.

### Don't:

- **Don't** use red for anything except law-changed notices and the unread dot that leads to them.
- **Don't** place more than one near-black feature surface on a page.
- **Don't** put an eyebrow or kicker label above a heading, or set labels in tracked all-caps.
- **Don't** use a second typeface; Public Sans covers every role.
- **Don't** set a saturated hue solid, or white, as text on its own tint or on the light tabs.
- **Don't** colour the board per section or give a tab the board's warm grey.
- **Don't** rebuild Home as a dashboard of greeting, stat tiles, card grid and sidebar.
- **Don't** spend ultramarine on decoration; it means interactive.
- **Don't** use the "T Map" line diagram outside Learning paths; it is reserved there (the resume card's lesson stops are the one borrowed piece).
