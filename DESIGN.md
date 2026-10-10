---
name: The Binder
description: The attorney's binder. App navigation lives in the header; the divider tabs on the page's fore-edge are the sections of the binder you have open.
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
  divider-manila: "#ede4cc"
  divider-manila-alt: "#e4d8b9"
  binder-legal-skills: "#2f45b5"
  notes-paper: "#fbf8ef"
  notes-edge: "#e8dfc6"
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

> **Status, October 2026.** This file describes the chosen direction, which is ahead of the build. The shipped app (commit ae37cfe) still uses five coloured section tabs as navigation. The mockups are on the canvas at https://claude.ai/artifact/MCQCHbvATG2m4KVNQiu3QW (B is Home, E is a section tab, F is the flow). Where this file and the code disagree, this file is the target, and PRODUCT.md is the source for structure and scope.

## Overview

**Creative North Star: "The Attorney's Binder"**

The Learning Hub is the binder a legal aid attorney opens when they're stuck. A true-white page runs to the top, left and bottom edges of the screen, with three punched holes near its left edge. A warm-grey chipboard strip shows only on the right, behind the divider tabs. The header carries the app's own navigation (Home · Binders ▾ · My learning · Updates, with search). The divider tabs belong to the binder you have open: a Contents tab plus 3–5 curriculum areas (Legal Skills is three binders: Practice Foundations, Litigation, Beyond the Courtroom). The open divider turns white, joins the page, and wears the binder's colour on its free edge. The open page holds everything filed in that section: practice, reference, courses, new law, MassLegalServices resources and your own notes.

The page is dense but quiet. Hierarchy comes from near-black ink, one workhorse family (Public Sans) on a steep size ramp, and ruled lists in place of cards. Colour is rationed: each hue means one thing (binder, state, or interactive) and is never decoration. There is one inverted near-black element per page, the resume card, and it carries the page's main way back into a course. Light mode is primary. Dark mode keeps the same structure.

Motion belongs to the dividers. When a section opens, its divider slides out (260ms, exponential ease-out) and the previous one slides shut. Nothing else on the page performs.

**Key Characteristics:**

- The page sheet runs to the top, left and bottom edges. Chipboard shows only in the strip behind the tabs.
- The header holds app navigation. The fore-edge dividers are the open binder's sections, manila at rest and white plus binder colour when open.
- Courses open in place and are never labelled Brightspace (the wrapper makes them part of the hub). Only truly external items are marked: MassLegalServices ↗.
- What's available leads. Planned topics sit in a quiet "Coming" roadmap, never in the main column.
- Notes are visibly the user's own: a warm notes-paper panel, private by default.
- Public Sans for every role; weight and size carry the hierarchy.
- One near-black resume card per page.
- Every text/fill pairing with a recorded ratio is measured and locked (ADR 0008).

## Colors

A white-and-ink page on warm chipboard, with saturated binder colours rationed to signal duty only.

### Primary

- **Binder Ultramarine** (brand-ultramarine): means _interactive_. Used for links such as "All updates", the search icon on focus, progress fills, the avatar fill, and the focus ring. Text in brand colour on light grounds uses **Deep Ultramarine** (brand-ink). Text sitting on a solid ultramarine fill uses **Brand On** (brand-on), which flips to dark ink in dark mode, where ultramarine lifts to #8b9cf0.
- **Ultramarine Wash** (brand-tint): pale fill behind "Continue"-type chips.

### Secondary: binders and dividers (where you are)

- **Binder colour.** Each binder has one colour from the measured tab set: Practice Foundations teal (tab-learning), Litigation orange (tab-home), Beyond the Courtroom green (tab-paths). None is ultramarine, which means _interactive_. Substantive-law binders get theirs from the same set when they ship. The binder colour appears only as a non-text mark: the switcher's swatch, the open divider's free edge (4px), the left-off divider's edge on pages outside the binder, the 4px rule under the open section's title, and the swatch and "You are here" ring on Home's resume card.
- **Manila dividers** (divider-manila, alternating with divider-manila-alt) are the closed tabs. They take dark ink (tab-on), like printed index dividers. No rainbow: 13 coloured tabs would be noise.
- **The old section set** (tab-home-orange, tab-browse-amber, tab-paths-green, tab-learning-teal, tab-updates-periwinkle, measured 5.30, 8.37, 5.51, 5.34 and 5.12:1 with tab-on) is now the pool that substantive-law binder colours come from. The tokens and their recorded ratios stay locked.
- **Notes Paper** (notes-paper, edge notes-edge): the warm fill for the My notes panel. Use it only for content the user wrote.

### Tertiary: skill hues (area identity, under review)

> In the binder direction the skill areas are dividers, and dividers are manila. Skill hues are likely to retire from Home and the tabs. Keep the tokens, which are measured and locked, until the Browse and card surfaces are redesigned. Then either drop the hues or keep them only on the catalog cards.

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

**The Signal Rule.** Colour is a signal, never decoration. Binder colour means which binder you're in, status colour means state, and ultramarine means interactive. No binder uses ultramarine. If a colour on screen answers none of those, remove it.

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

On desktop (1024px and up) the sheet runs to the top, left and bottom of the viewport, with no board margin. A chipboard strip about 50px wide on the right holds the divider column, sticky, with the first divider starting about 96px down so it clears the header. The sheet casts its shadow onto that strip. Below 1024px the sheet is the whole screen, and the open binder's dividers become a scrolling strip under the header on binder pages.

Inside the sheet, content is centred in a 1180px column (cap it so a very wide monitor doesn't stretch lines), with gutters of 16px (phone), 24px (640px and up) and 44px (desktop). Pages use a flexible main column and a roughly 340px side column, separated by a 44–48px gap, stacking in reading order on phones.

- **Home** (outside the binders): main column holds the greeting, search and "Your binders" (name, one line, and what is ready, such as "1 course ready · 1 drill", or "Coming"; nothing else). Side column holds the resume card (the one place to continue: it names the part, where the course is filed, and draws unbuilt parts as dashed stops), "Practice", and "What changed in your binders" (only updates about something filed in a binder, else a one-line empty state). The dividers show the binder left open, with the tab the visitor left off on marked. Keep it this quiet: planned counts, tab lists and course outlines belong inside the binders. The Hearsay pilot's five skills live on Litigation › Trial, under the course.
- **Section tab:** title with the 4px binder rule, a tab-scoped search, kind chips, then grouped lists (Practice, Reference, Courses, New law, Coming). Side column holds My notes.

The header is a slim sticky bar at the top of the sheet. Its height is `--studio-chrome`, and sticky offsets are measured against it. The bottom bar on phones (if kept for app navigation) reserves `--safe-bottom`, and the content column reserves the same amount.

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

### Binder dividers (signature)

The open binder's sections, in `<nav aria-label="Litigation tabs">` (named for the binder). Litigation: Contents, Case Prep, Trial, Post-Trial, Appeals. Practice Foundations: Contents, Foundations, Ethics, Intake, Research, Writing. Beyond the Courtroom: Contents, ADR, Legislative, Community. Every divider shares the column evenly (at least 6.5rem, growing to fill a tall screen). Labels are short forms of the skill-area names; the section title uses the full name.

- **Shape:** 40px wide at rest, height fitted to the label (at least 56px), 9px rounded free end, no left border. 3px gap between dividers.
- **Colour:** manila fills alternating, tab-on ink at 13px / 600, set vertically.
- **Open:** white fill, 50px wide, pulled 8px into the sheet so it reads as joined, a 4px binder-colour free edge, 14px / 800 label, `aria-current="page"`.
- **Motion:** opening animates width (260ms, `cubic-bezier(0.16, 1, 0.3, 1)`). Hover draws a divider out 4px.
- **Focus:** a 2px ink outline at 3px offset.
- **Overflow:** if the column is taller than the viewport, it scrolls on its own. Never shrink labels below 13px.

**The Still Divider Rule.** Under `prefers-reduced-motion`, every divider shows its final position immediately. State feedback (colour, border, focus) survives; movement does not.

### Header

The wordmark "Learning Hub" (17–19px / 800) at left, then the main nav: **Home**, the **Binders ▾** switcher, **My learning**, **Updates** (with an unread count). The current item has a 3px ink underline. At right: a "Search · Ctrl K" button, the theme toggle, the avatar. All controls are at least 44px tall.

### Binder switcher

A 44px outlined button showing the binder's colour swatch (10 × 14px, a tiny divider) and its name, for example "Litigation ▾". It opens a menu of binders, each with a one-line description. Each binder has its own colour from the measured tab set: Practice Foundations teal, Litigation orange, Beyond the Courtroom green. Binders without content yet are listed as "Coming", never hidden and never clickable into an empty shell. The switcher remembers the last tab per binder.

### Kind chips

**Not shown until a tab holds three or more kinds of item**; before that, a row of mostly-zero chips is noise, so groups simply appear when they have content (New law only when a change is filed under the tab). When they ship: 40px pill toggles (`aria-pressed`) above a section's lists, Everything · Practice · Reference · Courses · New law · My notes · Coming, each with a count. Selected is solid ink.

### Item rows

A title (17px / 700), a meta line (kind · source · length) in muted ink, and a trailing action: "Open" or "Resume" for anything in the hub or its courses, "MassLegalServices ↗" for external resources. Never write "Brightspace" in learner-facing copy. Placeholder titles in mockups are in [brackets].

### Practice card

The practice kind gets a stronger row: 1.5px ink border, a short description of the scenario, and an action ("Start practice"). An AI drill, if one ships, is labelled "Practice feedback, not legal advice" in the card itself and on its page.

### My notes panel

Notes-paper fill with notes-edge border, 14px radius, "Only you can see these" in soft ink. Each note shows what it's attached to (an item or the whole tab) and its date. A labelled textarea at least 16px in size plus a solid "Save note" button.

### Resume card

- **Surface:** Resume Black, 12px radius, 20–24px padding, at most one per page.
- **Content:** a 22px / 800 course title, a "Next:" line in feature-muted, a lesson-stop line (filled stops for done lessons, hollow for upcoming ones, the current stop 20px with a Learning Teal ring and "You are here" set under it), and a 12px lesson line (for example "Step 3 of 6").
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

- **Do** keep app navigation in the header and binder sections on the dividers. Never mix the two.
- **Do** keep closed dividers manila. Off the binder's pages, the divider the visitor left off on stays manila too, with the binder colour on its edge and a small bookmark in that colour above its label; the binder's name sits above the dividers.
- **Do** say where every item opens.
- **Do** put available content first and planned content in a quiet "Coming" group.
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
- **Don't** give every divider its own colour.
- **Don't** let a grid of planned topics take the main column.
- **Don't** use notes-paper for anything the user didn't write.
- **Don't** rebuild Home as a dashboard of greeting, stat tiles, card grid and sidebar.
- **Don't** spend ultramarine on decoration; it means interactive.
- **Don't** use the "T Map" line diagram outside Learning paths; it is reserved there (the resume card's lesson stops are the one borrowed piece).
