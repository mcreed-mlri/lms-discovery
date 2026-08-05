# 0007 — Demo personas are opt-in and override real sessions

**Status:** Accepted

## Context

`lib/auth.tsx` supports demo personas for stakeholder walkthroughs: pick a card on
`/login` and the app treats you as that user. The persona is stored in
localStorage under `mlri-demo-user`, and `AuthProvider` reads it **before** calling
`/api/me`, returning early if present.

The flag controlling this previously defaulted to on (`!== "false"`). That meant
any deployment which did not explicitly disable it could be escalated: write
`{"userType":"admin","accessStatus":"approved"}` to that key and hold a
client-side admin session. Real Brightspace logins are correctly capped to the
most restrictive user type server-side in `/api/me`; this path bypassed that cap.

## Decision

The flag is opt-in: `NEXT_PUBLIC_SHOW_DEMO_USERS === "true"`. A deployment that
says nothing gets no personas.

`NEXT_PUBLIC_DEMO_MODE=true` remains a separate, explicit mode where personas are
the only login path — used for demo deployments with no Brightspace credentials.

## Consequences

- The default is now safe, and enabling personas is a visible act.
- **While personas are enabled, the localStorage persona still overrides a real
  session.** That is the intended behaviour of demo mode, not a bug — which is why
  the flag must stay opt-in rather than being made "safe" some other way.
- `proxy.ts` short-circuits entirely when either flag is set, because a persona
  has no cookie for the server to verify and gating would bounce demo users
  between `/login` and a gated route forever.
- The e2e suite runs with personas on, since it has no Brightspace credentials.
  The consequence is that **the auth gate is not exercised by e2e** — it was
  verified manually against a running server instead.
- Never enable this on a deployment real advocates can reach.
