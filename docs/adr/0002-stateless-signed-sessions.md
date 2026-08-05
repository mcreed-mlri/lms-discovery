# 0002 — Sessions are stateless signed cookies, not revocable

**Status:** Accepted

## Context

After the Brightspace OAuth callback verifies a user with whoami, the Hub needs
its own session. The usual options are a server-side session store (revocable,
needs a database and a lookup on every request) or a signed stateless token
(no infrastructure, not individually revocable).

## Decision

Issue a stateless token: `base64url(JSON payload) + "." + HMAC-SHA256`, verified
with `timingSafeEqual`, 12-hour TTL. See `lib/session.ts`.

Revocation is by cookie expiry, or by rotating `SESSION_SECRET` — which
invalidates every session at once.

## Consequences

- No database is required for auth, and no lookup on the hot path.
- **A copied cookie stays valid until it expires.** Logout deletes the cookie; it
  cannot invalidate the token. This is the real cost of the decision.
- Users are hard-logged-out at 12 hours; there is no sliding refresh.
- If per-user revocation becomes a requirement — a suspended advocate who must
  lose access immediately, say — this decision has to be revisited. Rotating the
  secret is the only lever today, and it logs everyone out.
