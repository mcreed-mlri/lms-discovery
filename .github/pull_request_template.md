## What and why

<!-- What changes, and what problem it solves. The "why" is the part reviewers
     cannot reconstruct from the diff. -->

## How it was verified

<!-- Not "tests pass" — what did you actually run or click? -->

- [ ] `npm run typecheck && npm run lint && npm run format:check && npm test`
- [ ] `npm run build`
- [ ] `npm run e2e` (required if this touches UI, routing, or colour)
- [ ] Exercised in a browser

## Checks

- [ ] No new `any`, `as any`, `@ts-ignore`, or `eslint-disable` (see CONTRIBUTING)
- [ ] Reused existing hooks/utilities rather than adding parallel ones
- [ ] Any overlay uses `useFocusTrap` **and** `useScrollLock`
- [ ] Any new admin/sync route calls `requireAdminSecret`
- [ ] If a colour token changed: `npm run e2e` passes (axe covers both themes)
- [ ] If a non-obvious decision was made: recorded in `docs/adr/`
