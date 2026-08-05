# 0009 — react-hooks/set-state-in-effect is disabled

**Status:** Accepted

## Context

The app hydrates several pieces of client state from localStorage after mount:
auth persona, saved learning, rail collapse, theme. The pattern is
`useEffect(() => { setX(readFromStorage()) }, [])`, which the
`react-hooks/set-state-in-effect` lint rule flags.

The rule's suggested alternative is `useSyncExternalStore`.

## Decision

The rule is off, with the reasoning recorded inline in `eslint.config.mjs`.

## Consequences

- The pattern is SSR-safe as written: the server render has no localStorage, so
  the initial state must come from a post-mount read.
- The cost is a brief render with default state before hydration. For theme this
  matters, and is handled separately by a blocking inline script in
  `app/layout.tsx` that sets `data-theme` before first paint — there is an e2e
  test asserting the theme survives a reload without a flash.
- `useSyncExternalStore` is the correct long-term answer and is a larger refactor
  than it is currently worth. Revisit if adopting the React Compiler, which is
  stricter about this.
- The repo contains **zero** `eslint-disable` comments, which is the property
  worth protecting: suppressions scattered through source are invisible, whereas a
  config entry has to be justified in one reviewable place.

## Addendum — a second disabled rule

`@next/next/no-location-assign-relative-destination` is also off, added when
`eslint-config-next` 16.3.0 introduced it. Both flagged call sites in
`lib/auth.tsx` need a full document navigation and the rule cannot tell:

- `login()` navigates to `/api/auth/brightspace/start`, an API route that 302s to
  `auth.brightspace.com`. Client-side routing cannot follow an off-origin
  redirect, so `router.push()` would break OAuth outright.
- `logout()` navigates to `/login` **in order to** discard client state. A soft
  push keeps the SPA alive with a stale user in memory — the precise thing
  logging out exists to prevent.

Rewriting either to `window.location.href` would satisfy the rule without
changing behaviour, which is suppression by obfuscation. The config entry is the
honest option.

The bar for adding a third: the rule must be wrong about _this_ codebase, not
merely inconvenient, and the reason must be written down where it is enforced.
