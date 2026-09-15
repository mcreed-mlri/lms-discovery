# 0013 — Two touch-only rules that look like mistakes

**Status:** Accepted

## Context

A phone is not a narrow desktop, and two of its behaviours cannot be expressed
in the vocabulary the rest of this app uses.

**iOS Safari zooms the page in when a text control smaller than 16px takes
focus**, and does not zoom back out on blur. A zoomed page is wider than the
visual viewport, so from that tap onwards the whole app pans sideways. This
shipped: the global search field was 14px, which made "tap Search" the reliable
way to reach it, and it was reported as "there is horizontal scrolling on
mobile". The `overflow-x: clip` on `<html>` cannot prevent it, because panning a
zoomed visual viewport is not document scroll. The other way out is
`maximum-scale=1` on the viewport meta, which blocks pinch-zoom and fails
WCAG 1.4.4.

**WebKit applies `:active` to a tap only while the document carries at least one
touch listener.** Every interactive surface here announces itself with `:hover`,
which a touchscreen never fires, and the global tap highlight is transparent by
design — so before this, a tap produced nothing at all between finger-down and
the route changing.

## Decision

Both are handled where the platform forces them to be, and both are ugly:

- A `font-size: 16px !important` floor on text controls under
  `@media (pointer: coarse)` in `app/globals.css`. Every size in this app is set
  by a Tailwind utility — a single class — which outranks any selector that could
  be written beside it, so the `!important` is load-bearing. Components still
  declare 16px themselves; the floor catches the next one that forgets.
- A passive, empty `touchstart` listener registered by `Providers`. It exists to
  be counted, not to run.

Scoped by `pointer`/`hover` rather than by a width, because that is what the
behaviour keys off: a phone held sideways is wider than every breakpoint and
still does both of these.

## Consequences

- Neither can be removed without silently regressing a phone while every
  desktop browser and the whole headless test suite stays green. That is the
  reason this record exists.
- The `!important` does not sit alongside the repo's "zero `eslint-disable`"
  property — that rule is about suppressing a checker, this is about losing a
  specificity race to a class. It is one declaration, in one place, and the
  phone spec fails without it.
- `e2e/mobile.spec.ts` asserts both: no control renders below 16px on any swept
  route, in both orientations, and four real controls report a pressed state
  while held. The font-size check asserts the input to the zoom rather than the
  zoom itself, because no headless browser applies it — the same trap as the
  device insets in that file.
- The 16px floor overrides the `sm:` sizes components declare, on a touchscreen
  only. That is intended: those sizes were never safe there.
