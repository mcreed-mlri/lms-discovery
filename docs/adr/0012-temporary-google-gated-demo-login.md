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

Every successful Google login collapses to the same shared **entitlements**, under
the staffer's **own name**. `/api/me` returns the existing `demoUser` (the approved
attorney persona) for any session with `provider: "google"`, replacing only display
fields from the verified Google ID token: `name`, `firstName` and `initials` are
derived from `given_name`/`family_name`; `title` becomes the literal `"MLRI Staff"`
in place of the persona's "Staff Attorney"; `unit` and `email` are blank rather than
"Housing Unit" and `s.chen@mlri.org`. Everything that grants anything — `userType`,
`accessStatus`, `jurisdiction`, `practiceArea`, `uplAcknowledgedDate` — stays the
persona's, so two staffers signed in at once see an identical catalog under their
own names.

Greeting every viewer as "Sarah Chen" read as a bug to the room being demoed to, and
asking staff to explore for a week under someone else's name and job title invites
exactly the wrong question about what the app knows about them. Name and initials are
the fields a person notices; `title` and `unit` would otherwise attach invented
organizational facts to an identified human, so they are replaced with a truthful
literal and left blank. For the same reason the rendered access line comes from a
display-only `accessLabel` ("Demo access: full catalog") rather than reading
"Attorney access: approved" above a real name, in an app whose access model exists to
manage UPL.

`proxy.ts` is untouched — it still verifies a real signed `lace_session` cookie for
every gated route, so the gate itself never opens up.

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
- The real signed-in identity drives **display only**. `firstName`/`lastName` from
  the verified ID token produce the greeting, the full name and the rail initials;
  `googleEmail` stays server-side for audit logging and is not returned by `/api/me`
  (the payload's `email` is blank, matching the Brightspace branch). Access is
  unchanged: `lib/access.ts` consumes a narrowed `AccessProfile` of `userType`,
  `accessStatus`, `jurisdiction` and `uplAcknowledgedDate` and is structurally
  incapable of seeing a name, and all four come from the persona. `accessLabel` is
  deliberately absent from `AccessProfile` too, so a display string can never become
  an input to a gating decision. `tests/api-me.test.ts` pins both halves: the name is
  the staffer's, and every entitlement field matches `demoUser` across two different
  signed-in staffers.
- If `GOOGLE_DEMO_ACCESS_EXPIRES_AT` is unset, the Google login path is
  effectively disabled (`isPastGoogleDemoExpiry` treats "no expiry configured"
  as expired) rather than left open indefinitely by omission.
- The shared demo identity lives in `lib/auth-constants.ts`, not `lib/auth.tsx`.
  As first shipped, `/api/me` imported `demoUser` from `lib/auth.tsx`, a
  `"use client"` module. A route handler compiles in the server layer, where a
  client module's exports are client-reference stubs rather than data, so the
  route answered `200` with the `user` key missing and every Google login
  bounced straight back to `/login` with no error in any log. Same boundary
  problem, and the same remedy, as `lib/session-constants.ts` in ADR 0003:
  `lib/auth.tsx` re-exports the personas so client call sites are unchanged, and
  `tests/server-client-boundary.test.ts` keeps server entry points off the
  client module.
- The client `login()` in `lib/auth.tsx` now navigates to `/login` rather than a
  hardcoded `/api/auth/brightspace/start`. It could not honour
  `HUB_LOGIN_PROVIDER`, which is server-only by design (above), so on a Google
  deployment the signed-out panel on `/` sent people to the wrong provider.
  `/login` is the one place that already resolves the provider.
- `/my-learning` greets from a second source, so personalizing `/api/me` alone was
  not enough. `components/dashboard/LearnerDashboardView.tsx` renders
  `greetingForHour(payload.user.displayName)` off the mocked dashboard payload
  (`mocks/dashboard.ts`), not off `/api/me` — the home hero said the staffer's name
  while one click away the dashboard still said "Sarah Chen".
  `app/my-learning/page.tsx`, which already reads `useAuth()` for the admin
  redirect, passes the signed-in first name down as an optional
  `displayNameOverride` prop. Deliberately a prop and not a `dashboardService`
  argument: that service is the swap point for a real `fetch('/api/me/dashboard')`,
  where identity comes from the session cookie server-side, and a client handing a
  server endpoint its own display name is the shape that would have to be unwound at
  the swap. It is also a prop rather than a `useAuth()` call inside the view because
  `tests/learner-dashboard.test.tsx` renders that view with no provider, and
  `useAuth` throws outside one. Grep `displayNameOverride` to find the whole
  affordance at teardown.
- Stale persona copy also lived in signed-out chrome: `app/page.tsx` offered
  "Continue as Sarah" beside a redundant link to the same `/login` destination. Both
  collapsed into one "Sign in to continue" button. When `HUB_LOGIN_PROVIDER` goes
  back to `brightspace`, the persona name should not come back with it.
