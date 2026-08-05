# 0005 — Faculty bypasses per-item access gating

**Status:** Accepted

## Context

`canAccessLearningItem` in `lib/access.ts` gates each item on user type,
jurisdiction, and UPL acknowledgement. Faculty and content creators need to see
finished content as it will appear, including items their own user type would not
normally be allowed.

## Decision

`if (user.userType === "faculty") return true` — a blanket bypass, before any
per-item check. Admin has the same bypass on the line above.

## Consequences

- This is a **blanket authorization escape hatch in a UPL-compliance-sensitive
  product**, and worth naming as such rather than leaving as a one-line comment.
  Faculty is an authoring/preview role, not a learner role; the bypass is the
  point, not an oversight.
- It is currently enforced **client-side only**, like the rest of role gating.
- The exposure is bounded by who can hold `userType: "faculty"`. Real Brightspace
  logins are capped server-side in `/api/me` (see ADR 0007), so this cannot be
  self-assigned through the real login path.
- When the UPL access matrix drives real role mapping, this bypass should be
  re-examined: "can preview any item" and "is exempt from UPL gating" are
  different claims, and today one implies the other.
