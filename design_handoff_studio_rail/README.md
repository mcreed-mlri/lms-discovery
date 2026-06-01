# Handoff: LACE Learning Hub — “Studio + Collapsible Rail” (Direction A2)

## Overview
LACE is a continuing-education / microlearning hub for Massachusetts legal-aid advocates
(staff attorneys, paralegals, advocates). The product is built around **short, practical
modules**, **fast search**, and **“the law changed” urgency** — advocates dip in between
client calls, find the skill or statute they need, and get out.

This handoff covers the chosen visual direction: **A2 “Studio + Collapsible Rail.”** It is the
clean, systematic “Studio” look (Google-Skills-grade neutrals + a disciplined multi-hue skill
palette) with the top navigation replaced by a **persistent left rail** that holds the
**Practice Areas** list at all times and **collapses to a 68px icon strip**.

Screens documented here:
- **Home (rail expanded)** — primary landing/browse screen.
- **Home (rail collapsed)** — same screen, rail in icon-strip mode (reading/focus mode).

> The dashboard (“My Learning”) and mobile layouts were prototyped in the earlier Studio
> direction but are **not yet adapted to the rail**. See *Not-yet-built* at the bottom.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes
that show intended look and behavior. They are **not production code to copy directly**. They use
inline-style objects and a CDN Babel transform purely so the design renders in a browser without a
build step.

**The task is to recreate these designs in the target codebase’s existing environment**
(React + your styling system, Vue, SwiftUI, etc.) using its established components, tokens, and
patterns. If no front-end environment exists yet, pick the most appropriate framework for the
project and implement there. Translate the inline styles into whatever the codebase uses
(CSS Modules, Tailwind, styled-components, design-token variables…).

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, and the collapse interaction are all
final and intentional. Recreate the UI to match. The exact token values are listed under
*Design Tokens* and should map onto the codebase’s token system.

---

## Layout — overall shell

A two-column flex shell, full height:

```
┌───────────┬─────────────────────────────────────────────┐
│           │  Content bar (sticky, blur)                  │
│   RAIL    ├─────────────────────────────────────────────┤
│ (sticky)  │  Hero (h1 + sub + search + quick chips)      │
│           │  + Continue card (right)                     │
│  248px    │                                              │
│   ↕       │  Browse by skill  (4-col grid of tiles)      │
│  68px     │                                              │
│ collapsed │  Changed this week (1.4fr)  │ Guided paths   │
│           │                              │ (1fr)         │
└───────────┴─────────────────────────────────────────────┘
```

- Shell: `display:flex; align-items:stretch; min-height:100%; background: page (#f5f6f8)`.
- Rail is `position:sticky; top:0; height:100%`, fixed-basis flex child.
- Content column: `flex:1; min-width:0`. Inner sections are centered with `max-width:1120px; margin:0 auto`.
- Horizontal padding inside content sections: **40px**.

---

## Component: Left Rail (the signature element)

The rail is the defining change of this direction. It replaces a horizontal top nav.

**Container**
- Width: **248px expanded**, **68px collapsed** (constants `RAIL_W` / `RAIL_W_MIN`).
- Background: `surface (#ffffff)`; right border: `1px solid line (#e4e7ed)`.
- Padding: `20px 16px` expanded, `20px 12px` collapsed.
- Layout: `flex column`, `min-height:100%`, footer pinned with `margin-top:auto`.
- **Transition** on width / flex-basis / padding: `.22s cubic-bezier(.4,0,.2,1)`.

**Sections, top to bottom:**

1. **Brand** — 30×30 rounded-8 square, `background: ink (#14161b)`, white “book/scales” SVG
   glyph (stroke-width 2). Wordmark “LACE” 20px / weight 700 / letter-spacing -0.02em,
   hidden when collapsed (mark stays, centered).

2. **Search** —
   - Expanded: full input chrome — `background: page`, `1px solid line`, radius 9, padding `9px 12px`,
     magnifier (16px, soft stroke), placeholder “Search…” 13.5px soft, trailing `⌘K` chip.
   - Collapsed: a single 44×40 square icon button (radius 9, `1px solid line`, `background: page`),
     magnifier centered. `title="Search · ⌘K"`.

3. **Primary nav** — items: **Home, Browse, My Learning, Updates**. Updates carries a red dot badge.
   Each item (`StRailItem`):
   - Expanded: `padding:9px 11px`, gap 12, icon (19px) + label, radius 9.
   - Collapsed: `padding:10px 0`, centered icon only, `title` = label (native tooltip).
   - Active: `color: ink`, `background: sunken (#eef0f4)`, weight 650, icon stroke `brand (#1c3fb0)`.
   - Inactive: `color: muted (#565c69)`, weight 500, icon stroke `soft (#8b909d)`.
   - Badge: 7px red (`#c8493b`) dot, top-right of icon, 2px surface-colored border.

4. **Practice Areas** — *the reason the rail exists.* Always visible.
   - Expanded: mono uppercase label “Practice areas” (11px, weight 600, letter-spacing .06em, soft),
     then a list of `AREAS` (Housing, Public Benefits, Family Law, Ethics & UPL, Practice Skills,
     Immigration). Each row: 9×9 rounded-3 color swatch + name (13.5px muted) + module count (12px soft),
     `padding:7px 11px`, radius 8.
   - Collapsed: a `1px` divider replaces the label; rows become **just the color swatch**, centered,
     `padding:7px 0`, `title="<name> · <count>"`.
   - Swatch colors come from the **skill-hue palette by index** (`stHue(i).solid`), see tokens.

5. **Footer** (pinned bottom, `border-top:1px solid lineSoft (#edeff3)`):
   - **Collapse toggle** — chevron (`‹`) that rotates 180° when collapsed (`.22s`). Expanded shows
     “Collapse” label; collapsed shows chevron only. This flips the `collapsed` state.
   - **User** — 32px brand-filled avatar circle with initials “SC” (white, 12.5px, weight 650);
     expanded also shows name (13px, weight 600, ink) + title (11.5px, soft). Collapsed: avatar only, centered.

---

## Component: Content Bar (`StContentBar`)
Slim sticky header inside the content column (replaces what the top nav used to carry).
- `padding:16px 40px`, `border-bottom:1px solid line`, `background: rgba(255,255,255,.85)`,
  `backdrop-filter: blur(10px)`, `position:sticky; top:0; z-index:20`.
- Left: mono uppercase eyebrow “Mass. legal aid · continuing education” (11.5px, soft).
- Right: 38×38 bell button (radius 9, `1px solid line`) with red notification dot.

---

## Component: Hero
- Two-column grid `1.3fr 1fr`, gap 36, vertically centered, `padding:44px 40px 36px`.
- **h1**: “Build the skill the case needs.” — 44px, weight 720, line-height 1.06,
  letter-spacing -0.035em, `text-wrap:balance`, color ink.
- **Sub**: 17px, line-height 1.55, muted, max-width 500.
- **Search (big)** (`StSearch big`): card with `1px solid line`, radius 12, padding `15px 18px`,
  shadow token, 22px magnifier (soft), placeholder *“Search skills, statutes, ‘notice to quit’…”*
  (17px soft), trailing `⌘K` chip.
- **Quick-search chips**: pill row (`QUICK_SEARCHES`) — `padding:7px 13px`, radius 999,
  `1px solid line`, `background: surface`, 13px muted.
- **Right column**: Continue card (see below).

## Component: Continue card (`StContinueCard`)
- `background: surface`, `1px solid line`, radius 14, padding 22, shadow token.
- Header row: a “Continue” chip (mono, `background: brandTint #eaf0ff`, `color: brand`) +
  progress % (mono, soft).
- Title 19px / weight 700; “Up next · …” 13.5px muted.
- `ProgressLine` (height 6, fill `brandFill #2a5bff`, track `sunken`).
- Footer: “N min left” (soft) + primary **Resume** button (play icon).

## Component: Skill tile (`StSkillTile`) — “Browse by skill”
- 4-column grid (`repeat(4,1fr)`, gap 16). Card: `surface`, `1px solid line`, radius 14, padding 20.
- Hover: `border-color: lineSoft`, shadow token, `translateY(-2px)`, `.15s` transitions.
- 46×46 rounded-12 icon well, `background: hue.tint`, custom line `SkillGlyph` (26px) in `hue.solid`.
- Name 16px / weight 650; blurb 13px muted; footer mono “N MODULES” (11px soft).
- Each card uses the next palette hue by index (`stHue(i)`).

## Component: Update row (`StUpdateRow`) — “Changed this week”
- Inside a card (`surface`, `1px solid line`, radius 14, shadow). Rows separated by `1px lineSoft`.
- Leading 9px severity dot: high = `#c8493b`, med = `#c8791b`.
- Severity chip (“Law changed” high / “Updated” med) with tinted background, then `area · when` (soft).
- Title 16px / weight 650; body 13.5px muted; trailing “Review →” link in `brand`.

## Component: Guided path card (`StPathCard`)
- `surface`, `1px solid line`, radius 14, top accent bar 6px in `hue.solid`.
- Mono “Guided path” eyebrow + path icon; title 17px / weight 700; meta row
  “N modules · Nh · N learners” (13px muted).

---

## Interactions & Behavior
- **Rail collapse/expand** — primary interaction. State: `collapsed: boolean` (default **false /
  expanded**). The footer chevron toggles it. Width animates `248px ↔ 68px` over `.22s
  cubic-bezier(.4,0,.2,1)`; labels/wordmark/search-text/area-names/user-text are removed (not just
  hidden) in collapsed mode; chevron rotates 180°. **Recommended:** persist this per user
  (localStorage or user prefs) and consider auto-collapsing inside a module/reading view.
- **Tooltips when collapsed** — nav items and practice-area swatches expose `title` so labels are
  recoverable. In production prefer a real tooltip component over native `title`.
- **Hover** — skill tiles lift (`translateY(-2px)` + shadow + lighter border). Nav/area rows should
  get a subtle `sunken` hover background (add in production).
- **Search** — opens a command-palette style search (⌘K). The data layer (`searchAll(query)` in
  shared.jsx) already filters modules / updates / areas / paths by keyword — wire it to a real
  search overlay.
- **Resume / Review / All-X links** — navigation to module player, update detail, and listing pages
  (not built; route as appropriate).

## State Management
- `collapsed` (rail) — local UI state; persist to user prefs.
- `activeNav` — which primary nav item is current (drives active styling).
- `searchQuery` + results — feeds `searchAll()`.
- Per-module **progress** (0–100), **bookmarked**, and **completed** flags — these drive the
  Continue card, progress lines, and (on the dashboard) the in-progress/completed/saved lists.
- User profile + CLE progress (`USER` object): name, initials, title, unit, streak, cleEarned,
  cleRequired.
- Data fetching: modules, practice areas, skills, law-change updates, guided paths, and recent
  activity (for the streak heatmap) — all mocked in `shared.jsx`; replace with real endpoints.

## Design Tokens

**Color**
| Token | Hex | Use |
|---|---|---|
| page | `#f5f6f8` | app background |
| surface | `#ffffff` | cards, rail, inputs |
| sunken | `#eef0f4` | active-nav bg, chips, progress track |
| ink | `#14161b` | primary text, brand mark |
| muted | `#565c69` | body / secondary text |
| soft | `#8b909d` | tertiary text, icons-default |
| line | `#e4e7ed` | borders |
| lineSoft | `#edeff3` | inner dividers, hover border |
| brand | `#1c3fb0` | links, active icons, avatar fill |
| brandFill | `#2a5bff` | primary button / progress fill |
| brandTint | `#eaf0ff` | “Continue” chip bg |
| severity-high | `#c8493b` (bg `#fbe9e6`) | “Law changed” / alerts |
| severity-med | `#c8791b` (bg `#fbf0dc`) | “Updated” |
| done / positive | `#179a72` (bg `#e2f4ed`) | completed checks |

**Skill-hue palette** (8 hues, used by index for skill tiles AND practice-area swatches — identical
S/L feel so it reads systematic):
`#2a5bff/#e9f0ff` (blue) · `#7a4fe0/#efeafd` (violet) · `#d24d83/#fce9f1` (pink) ·
`#c8791b/#fbf0dc` (amber) · `#179a72/#e2f4ed` (green) · `#3a8ec9/#e7f3fb` (sky) ·
`#5563d6/#ebedfc` (indigo) · `#bb573b/#fbe8e2` (rust). `{ solid, tint }` per hue.

**Typography**
- Sans: **Geist** (weights 300–800). Mono: **IBM Plex Mono** (eyebrows, chips, counts, %).
- Scale used: h1 44px/720, section h2 24px/700, card titles 16–19px/650–700, body 13.5–17px,
  eyebrow/mono 11–12px. Tight tracking on headings (-0.02 to -0.035em).

**Spacing / radius / shadow / motion**
- Spacing on a 4/8px grid. Section H-padding 40px; content max-width 1120px.
- Radius: inputs/nav 9, chips 7, swatches 3, cards 14, icon wells 10–12, pills/avatars 999.
- Shadow (single tier): `0 1px 2px rgba(20,22,27,.04), 0 6px 18px rgba(20,22,27,.06)`.
- Rail constants: expanded **248px**, collapsed **68px**. Transition `.22s cubic-bezier(.4,0,.2,1)`.

## Assets
- **No raster/image assets.** All iconography is inline SVG defined in `shared.jsx`:
  - `Icons` — a custom minimal line set (Search, Home, Grid, Book, Bell, Arrow, Play, Check, Path,
    Alert, etc.), stroke-width 1.6.
  - `SkillGlyph` — distinct hand-drawn-feel glyph per skill (interview, draft, counsel, triage,
    negotiate, court, ethics, research).
  - The LACE brand mark is an inline SVG (book/scales) on an ink square.
- Recreate these as the codebase’s icon components, or import the SVGs directly.
- Fonts load from Google Fonts (Geist, IBM Plex Mono) — swap for the codebase’s font pipeline.

## Files
In this bundle:
- `preview.html` — open in a browser to see both rail states. The expanded Home has a **live collapse
  toggle** (click “Collapse” in the rail footer).
- `dir-studio2.jsx` — **the A2 direction**: `StRail`, `StRailItem`, `StContentBar`, `StudioRailHome`,
  `StudioRailHomeCollapsed`. This is the main reference.
- `dir-studio.jsx` — the base Studio language + reused atoms (`ST` tokens, `stHue`, `StSearch`,
  `StContinueCard`, `StSkillTile`, `StUpdateRow`, `StPathCard`, `StSectionHead`, `StBtn`, `StChip`)
  and the not-yet-rail-adapted dashboard (`StudioDashboardDesktop`) and mobile (`StudioHomeMobile`).
- `shared.jsx` — all mock data (`USER`, `MODULES`, `SKILLS`, `AREAS`, `UPDATES`, `PATHS`, `ACTIVITY`,
  `QUICK_SEARCHES`), the `searchAll()` index, the `Icons` set, `SkillGlyph`, and shared primitives
  (`ProgressLine`, `ProgressRing`, `StreakHeatmap`, `Sparkline`, `Pill`).

## Not-yet-built (call out to the team before implementation)
- **My Learning / dashboard with the rail** — a Studio dashboard exists (`StudioDashboardDesktop`:
  CLE ring, streak heatmap, in-progress/saved/completed lists) but still uses the old top nav. Wrap
  it in `StRail` to match A2.
- **Mobile** — `StudioHomeMobile` exists with a top bar + bottom tab pattern (no rail; a rail collapses
  to a bottom nav / drawer on small screens). Define the responsive rule (e.g. rail hidden below
  ~960px, becomes a slide-over + bottom nav).
- **Search overlay, module player, update detail, listing pages** — referenced by links, not designed.
