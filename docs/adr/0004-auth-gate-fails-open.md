# 0004 — The proxy auth gate fails open without a secret

**Status:** Accepted

## Context

`proxy.ts` gates protected routes by verifying the session cookie, which needs
`SESSION_SECRET`. If that variable is missing, the gate cannot function. Failing
closed (redirect everyone to login) is the reflex for an auth check.

## Decision

Fail **open**, with a loud `console.warn`.

## Consequences

Justification, in order of importance:

1. Without `SESSION_SECRET` the OAuth callback cannot mint a session either. So a
   closed gate would not be "degraded" — nobody could ever get in. A
   misconfigured deploy would be a total outage rather than a visible warning.
2. The gate is not the authority on data access. `/api/me` verifies the cookie
   server-side, and Supabase reads are RLS-scoped. Failing open here cannot leak
   records; it only skips a redirect.
3. The gate's other job is removing a guaranteed loading spinner on first paint.
   That is a UX optimisation, and UX optimisations should not take the site down.

If the proxy ever becomes the sole enforcement point for something, this inverts.
