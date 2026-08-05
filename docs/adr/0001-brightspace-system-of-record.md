# 0001 — Brightspace stays the system of record

**Status:** Accepted

## Context

The Hub looks like an LMS. It lists courses, shows progress, and has a dashboard.
The temptation is to let it own that data — it would make the product faster and
remove a dependency.

Brightspace already owns enrollment, completion, and CLE credit for MLRI. Those
records have compliance weight: they are the evidence that an advocate completed
required training.

## Decision

The Hub is a discovery and navigation layer. Brightspace remains authoritative for
courses, enrollment, and progress. The Hub reads and links; it does not become a
second source of truth for anything a compliance question would be asked about.

## Consequences

- Every learning item resolves to a Brightspace handoff URL. A broken or empty
  link is the most consequential silent failure in the product, which is why an
  e2e test asserts the handoff shape.
- Progress shown in the Hub is a cache or a mock, never the record. It is allowed
  to be stale; it is not allowed to be believed over Brightspace.
- Saved items, search analytics, and UI preferences are Hub-owned, because nobody
  will ever audit them.
