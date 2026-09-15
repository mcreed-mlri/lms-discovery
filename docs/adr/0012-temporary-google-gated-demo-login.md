# 0012 — Temporary Google-gated demo login for the staff meeting

**Status:** Accepted

## Context

MLRI held an internal staff meeting demoing this app. Staff were given a week
afterward to explore it themselves, but links inside MLRI tend to get
forwarded around, so the access needed a real technical boundary rather than a
verbal "don't share this."

The existing demo-persona system (ADR 0007) doesn't fit: `NEXT_PUBLIC_DEMO_MODE`
makes `proxy.ts` skip route gating entirely, because personas live only in
`localStorage` with nothing for the server to check. Turning that on for a
production URL is exactly the "anyone with the link gets in" risk this needed
to avoid.

## Decision

For the demo week, `/login` swaps real Brightspace OAuth for Google OAuth
restricted to the `mlri.org` Workspace domain (`lib/google/oauth.ts`,
`lib/google/tokens.ts`, `app/api/auth/google/start`, `app/api/auth/google/callback`).
Domain membership is verified server-side against the ID token (`hd` claim,
falling back to a verified email's domain) — it is a real authentication
check, not just a UI hint.

Every successful Google login collapses to the same shared identity: `/api/me`
returns the existing `demoUser` ("Sarah Chen," the attorney persona) for any
session with `provider: "google"`, regardless of which staff member's Google
account signed in. `proxy.ts` is untouched — it still verifies a real signed
`lace_session` cookie for every gated route, so the gate itself never opens up.

Two independent expiry checks enforce the one-week cutoff
(`GOOGLE_DEMO_ACCESS_EXPIRES_AT`), so nobody has to remember to manually turn
this off:

1. `app/api/auth/google/start` refuses to even redirect to Google once past
   the cutoff.
2. Every minted session's `exp` claim is capped to the cutoff
   (`secondsUntilGoogleDemoExpiry`), so sessions issued near the end of the
   week still die on time — not just new logins.

The Brightspace login path is hidden, not deleted: `HUB_LOGIN_PROVIDER`
(server-only env var, not `NEXT_PUBLIC_*`) switches which button `/login`
shows. Brightspace's routes, session shape, and `/api/me` mapping are
unchanged.

## Consequences

- Reverting once real courses/enrollment are ready: set `HUB_LOGIN_PROVIDER`
  back to `brightspace` (or remove it) and redeploy. The Google OAuth code can
  stay dormant in the repo for reuse rather than being deleted immediately.
- `HUB_LOGIN_PROVIDER` is deliberately not `NEXT_PUBLIC_*`, to sidestep the
  build-time-inlining pitfall already hit once (see commit `ae07295`).
- `SessionUser` gained optional `provider` and `googleEmail` fields
  (`lib/session.ts`, mirrored in `lib/session-edge.ts` per ADR 0003). Existing
  Brightspace tokens are unaffected — the fields are simply absent.
- The real signed-in email is kept in the session for audit logging only; it
  never drives access. Every Google-authenticated user sees exactly what the
  attorney demo persona sees.
- If `GOOGLE_DEMO_ACCESS_EXPIRES_AT` is unset, the Google login path is
  effectively disabled (`isPastGoogleDemoExpiry` treats "no expiry configured"
  as expired) rather than left open indefinitely by omission.
