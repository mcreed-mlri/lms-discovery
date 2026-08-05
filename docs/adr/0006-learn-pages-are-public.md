# 0006 — Learning detail pages are public

**Status:** Accepted

## Context

`proxy.ts` gates `/`, `/browse`, `/curriculum-map`, `/updates`, `/my-learning`,
and `/dashboard`. It deliberately does not gate `/learn/[slug]`.

Those pages are statically generated via `generateStaticParams` (about 100 of
them) and carry per-item `generateMetadata`. Both are the signature of a page
meant to be linked to and shared.

## Decision

Learning detail pages stay reachable without signing in.

## Consequences

- A colleague can be sent a direct link to a training page and will see it.
- Course titles, descriptions, and syllabus outlines are therefore public
  information. Progress, enrollment, and anything user-specific are not — those
  live behind gated routes.
- Gating them later is a one-line change to `PROTECTED_PREFIXES`. It would cost
  the shareable-link behaviour and make the static generation pointless.
- Confirmed as intentional while the catalog is still mock data. Worth revisiting
  before the pilot if any real course description is considered sensitive.
