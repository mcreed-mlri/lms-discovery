# 0008 — Colour tokens carry measured contrast and are locked

**Status:** Accepted

## Context

`app/globals.css` defines the whole palette as CSS custom properties. Several
carry comments recording a measured contrast ratio and an instruction not to
change them — `--ink-soft` says "Dark enough to clear WCAG 1.4.3 (4.5:1) on white,
paper, AND sunken… Do not lighten it", and its dark-theme counterpart says "Do not
darken it". `--line-control` exists as a separate token from the decorative
hairlines purely because WCAG 1.4.11 wants 3:1 on control borders.

These read like arbitrary fussiness. They are measurements.

## Decision

Treat those values as constraints, not preferences. A token with a recorded ratio
does not get nudged for aesthetic reasons without re-measuring every surface it
appears on.

## Consequences

- Palette work is bounded. "Make the muted text a bit lighter" is a WCAG
  regression, not a taste call.
- The `e2e/a11y.spec.ts` axe sweep runs contrast checks on every route in **both**
  themes, so a violation fails CI rather than shipping. This is what turned the
  instruction from a hope into a guarantee.
- The dark ramp is an entirely separate set of values, so a light-theme change
  proves nothing about dark. The sweep covers both for that reason.
- Adding a colour pairing means checking it. `--brand-on` exists because white on
  `--brand` measured 2.19:1 in dark theme — caught by axe, not by eye.
