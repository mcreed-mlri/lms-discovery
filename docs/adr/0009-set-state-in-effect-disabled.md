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
- This is the **only** disabled rule in the config, and the repo contains zero
  `eslint-disable` comments. Worth keeping both properties.
