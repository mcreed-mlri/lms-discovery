# Contributing

Setup, commands, and troubleshooting live in [`docs/runbook.md`](docs/runbook.md).
Decisions that look odd and are deliberate are recorded in
[`docs/adr/`](docs/adr/README.md) — **read the index before changing auth, the
colour tokens, or the lint config.**

## Before you push

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

`npm run e2e` as well if you touched UI, routing, or colour.

These are all pre-commit hooked, but the hook only checks staged files — CI runs
the full set.

## House rules

**Reuse before adding.** The most common mistake in this codebase's history was
hand-rolling something that already existed. Before writing a hook or a wrapper,
check `lib/hooks/` — `useFocusTrap`, `useScrollLock`, and `useMediaQuery` all
exist, and each was written for a specific reason recorded in its own comments.
Overlays in particular must use the existing focus trap **and** scroll lock; the
drawer shipped without either and Tab walked straight out of it.

**Don't add `eslint-disable`.** There are currently zero in the repo. Two rules
are disabled in `eslint.config.mjs`, each with its reasoning inline (ADR 0009).
The property worth keeping is the zero: a config entry has to be justified in one
reviewable place, whereas suppressions scattered through source are invisible. If
a rule is genuinely wrong for this codebase — wrong, not merely inconvenient —
disable it in the config with a comment saying why.

**Don't add `any`, `as any`, or `@ts-ignore`.** There are currently zero of each,
under `strict: true`. Narrow `unknown` properly — `app/api/feedback/route.ts` is
the pattern to copy.

**Colour tokens with a recorded contrast ratio are locked.** See ADR 0008. If you
change one, run `npm run e2e` — the axe sweep checks every route in both themes
and will tell you what you broke.

**Every new admin or sync route calls `requireAdminSecret`** from
`lib/admin-auth.ts` before touching Supabase. No exceptions, and never add a
server-wide Brightspace token fallback.

**Tests must run with plain `npm test` on any platform.** No hard-coded paths to
the gitignored `tools/` Node.

## Where things are

| Area                   | Path                                          |
| ---------------------- | --------------------------------------------- |
| Catalog data           | `lib/data.ts` (hard-coded — see below)        |
| Search + ranking       | `lib/search.ts`, `lib/search-metadata.ts`     |
| Access control         | `lib/access.ts`                               |
| Auth (client)          | `lib/auth.tsx`                                |
| Auth (server)          | `lib/session.ts`, `proxy.ts`, `app/api/auth/` |
| Design tokens          | `app/globals.css`, `tailwind.config.ts`       |
| Dashboard (mocked)     | `lib/services/dashboardService.ts`, `mocks/`  |
| Unit + component tests | `tests/`                                      |
| e2e + accessibility    | `e2e/`                                        |

`lib/data.ts` is intentionally hard-coded and imported by ~30 files. Don't invest
in restructuring it — the Supabase-backed read path at `app/api/catalog/route.ts`
is the real replacement.

## Commits

Explain **why**, not just what. The existing history is a reasonable guide. Keep
unrelated changes in separate commits — a formatting sweep mixed into a behaviour
change is very hard to review.
