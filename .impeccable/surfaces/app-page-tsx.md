---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets:
  [
    "components/studio-shell.tsx",
    "components/home/hero-section.tsx",
    "components/home/home-overview.tsx",
  ]
---

# Home (first surface of the binder-tabs redesign)

Scope: Home (`app/page.tsx`) plus the app shell every route shares (navigation, page sheet, tokens). Mode: Operate. Other routes inherit the shell and tokens on this branch; their interiors follow in later passes.

Audience and job: a first-year Massachusetts legal aid attorney with a case task coming up; find the topic for the question in front of them, or resume, and hand off to Brightspace. Light mode stays primary. Must not feel like corporate-compliance grey.

Approved sketch: `.impeccable/mocks/home-binder.html` (final binder iteration). User overrides after approval: the board is a constant warm-grey chipboard (no tab matches it); the prototype banner and the Home training-hours line were removed (tone down gamification).

Reserved: the MBTA "T Map" line diagram is held for the Learning paths pages.

## Direction contract

THESIS: The hub is a ring binder of the curriculum. Divider tabs on the page's fore-edge are the navigation, and the open page holds today's work. It refuses the LMS dashboard default (greeting, stat tiles, card grid, sidebar).

OWN-WORLD: White page sheet with a dark 1.5px outline and rounded fore-edge corners, lying on a warm-grey chipboard board with fine grain. Five divider tabs in saturated binder colours (orange, amber, green, teal, ultramarine), flush, tucked under the page with a cast shadow, labels set along the tab. Ink near-black, Public Sans throughout, steep type ramp, ruled lists instead of cards. One dark resume card. Red only for law-changed notices.

STORY: The visitor sees where they left off and can resume in Brightspace in one click. Or they search with their own case terms, scan the twelve skill areas honestly marked planned, and open one of the three courses available now.

FIRST VIEWPORT: Page sheet fills the viewport inside a 20px board margin. Header row: Learning Hub at left; theme toggle, notifications bell and avatar at right; the header's bottom rule carries the open section's tab colour. Left column: 42px greeting, role line, 56px search with case-term placeholder and often-searched terms. Right column (390px): dark resume card with five lesson stops, "You are here" set under the current stop, white Resume button into Brightspace. Below: "The curriculum" ruled three-column index of the 12 skill areas, each row marked with its planned topic count (left); "Available now" ruled list and one sample update (right). Tabs on the right fore-edge; the current section's tab pulled out further. Phones: the bottom bar shows every section as a coloured divider tab edge-on (Home, Browse, Paths, Learning, Updates, plus Search); the open one stands taller.

FORM: Tabbed Reference Manual (catalog challenger, competitive, chosen by the user), restructured: tab rail reduced to five navigation dividers, proportional strip removed, resume card taken from the T Map. Seed key d0fee414.

Signature interaction: as each page arrives, its divider slides out from the closed position (260ms, exponential ease-out); hover draws a tab out slightly. Reduced motion keeps the open position with no movement.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
