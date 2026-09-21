# 0014 — Narrow the Google demo login to named staff

**Status:** Accepted

## Context

ADR 0012 opened `/login` to any Google account in the `mlri.org` Workspace
domain for a one-week staff-meeting demo. That window is over, but a handful
of staff still need to explore the app. Domain-wide access is broader than
that — anyone at MLRI with the link could sign in — so it needed a real
technical narrowing, not just fewer people being told the link exists.

## Decision

`app/api/auth/google/callback/route.ts` gained a second, optional check after
the existing domain check: `GOOGLE_ALLOWED_EMAILS` (`lib/google/oauth.ts`,
`getGoogleAllowedEmails`), a comma-separated exact-match email list. When set,
a verified ID token whose email isn't on the list is rejected with a new
`not_allowed` error code (`app/login/login-form.tsx` maps it to a message),
even though it's in the allowed domain. When unset, behavior is unchanged from
ADR 0012 — every account in the domain still gets in.

The production deployment sets `GOOGLE_ALLOWED_EMAILS` to the four staff still
using the app. That value lives in the Vercel dashboard, not the repo (per
`.env.example` convention — see `CLAUDE.md`).

`GOOGLE_DEMO_ACCESS_EXPIRES_AT` (ADR 0012's self-destruct for the one-week
demo window) no longer applies once `GOOGLE_ALLOWED_EMAILS` is set —
`isGoogleDemoExpiryActive()` (`lib/google/oauth.ts`) is `false` whenever an
allowlist is configured, and both `/api/auth/google/start` and the callback
skip the cutoff check in that case. The named staff aren't on a timer; they're
on a list, and they stop having access when removed from it, not on a date.
Session TTL follows the same rule: `secondsUntilGoogleDemoExpiry` (which caps
a session to the remaining time before cutoff) is only consulted while the
cutoff is still active — an allowlisted login gets the normal
`SESSION_TTL_SECONDS` instead.

## Consequences

- This stacks on top of, rather than replaces, the domain check — an email
  must be both in `mlri.org` and on the list. Two independent knobs
  (`GOOGLE_ALLOWED_DOMAIN`, `GOOGLE_ALLOWED_EMAILS`) instead of collapsing to
  one, since the domain check has value on its own if the list is ever
  cleared.
- Unset means open (matches `GOOGLE_ALLOWED_DOMAIN`'s default-to-`mlri.org`
  behavior), not closed like `GOOGLE_DEMO_ACCESS_EXPIRES_AT`'s fail-closed
  default. The expiry field guards a hard cutoff nobody should forget to set;
  this field is an additional narrowing of an already-real domain check, so
  leaving it unset falls back to the already-reviewed ADR 0012 behavior rather
  than silently locking everyone out.
- Revoking one of the four is a Vercel env var edit and redeploy, not a code
  change. `GOOGLE_DEMO_ACCESS_EXPIRES_AT` can be left as-is or cleared — it no
  longer does anything while the allowlist is set.
- If the allowlist is ever cleared to reopen domain-wide access, the demo
  cutoff (if still configured with a past date) immediately re-applies to
  everyone, including accounts that were previously listed — there's no
  separate "grandfathered" state.
- `tests/google-auth-callback.test.ts` covers both directions: an in-domain
  email absent from the list is rejected (`not_allowed`), a listed email still
  signs in when the var is set, and a listed email signs in even past the
  demo cutoff. `tests/google-oauth.test.ts` covers `isGoogleDemoExpiryActive`
  directly.
