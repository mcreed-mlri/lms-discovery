# 0011 — Coverage thresholds are a ratchet, not a target

**Status:** Accepted

## Context

When coverage was introduced the codebase measured 35.5% statements and 30.7%
branches. A conventional threshold (80%) would have failed the build on day one
and been deleted within a week. No threshold at all lets coverage quietly decay.

## Decision

Set thresholds just **below** the measured baseline: 33% statements, 28% branches,
26% functions, 33% lines. Documented in `vitest.config.ts` as a floor to raise and
never to lower.

## Consequences

- CI fails if coverage slides backwards, which is the property actually worth
  having.
- There is room to move without fighting the threshold on unrelated work.
- The numbers are not a claim about quality. 35% is a starting point, and the
  untested areas are known: the Brightspace API layer, the OAuth route handlers,
  `lib/hooks/*`, and most of `components/`.
- Raising them is a deliberate act that should accompany new suites. Lowering them
  to make a build pass defeats the entire mechanism — add the test instead.
