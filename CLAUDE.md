# MLRI Learning Hub

Next.js (App Router) discovery layer in front of Brightspace LMS for MLRI legal aid training. **Brightspace stays the system of record** for courses, enrollment, and progress; this app handles discovery, search, browsing, and handoff links into Brightspace.

## Commands

```bash
npm run dev            # dev server on https://localhost:3000 (self-signed cert)
npm test               # Vitest: unit + component suites in tests/
npm run test:watch     # Vitest watch mode
npm run test:coverage  # enforces the coverage ratchet in vitest.config.ts
npm run e2e            # Playwright + axe in e2e/; builds and serves the app itself
npm run lint           # ESLint (flat config in eslint.config.mjs)
npm run format         # Prettier (format:check in CI)
npm run typecheck
npm run build
```

Windows without global Node: prefix any script with the bundled npm, e.g. `.\tools\node-v24.15.0-win-x64\npm.cmd run dev`. Node version is pinned in `.nvmrc` + `engines`. `npm run e2e` needs `npx playwright install chromium` once.

CI (`.github/workflows/ci.yml`) is two jobs: `checks` (audit + typecheck + lint + format:check + coverage + build) and `e2e` (Playwright + axe). Vercel deploys `main` via its git integration. A Husky pre-commit hook runs lint-staged on staged files only.

**Operational docs**: [`docs/runbook.md`](docs/runbook.md) for setup and troubleshooting, [`docs/adr/`](docs/adr/README.md) for decisions that look odd and are deliberate, [`CONTRIBUTING.md`](CONTRIBUTING.md) for house rules. Read the ADR index before changing auth, colour tokens, or the lint config.

## Architecture

- **Catalog is hard-coded** in `lib/data.ts` (courses, modules, paths). It flows through `lib/search.ts` (in-memory ranking with synonyms/facets, metadata in `lib/search-metadata.ts`) and `lib/access.ts` (role/jurisdiction/UPL gating). The roadmap replaces this with the Supabase `learning_items` table — the RLS-scoped read path already exists at `app/api/catalog/route.ts`; don't over-invest in restructuring `lib/data.ts`.
- **Auth is real Brightspace login** (July 2026): `/login` → `app/api/auth/brightspace/start` → callback exchanges the code, verifies with whoami, sets an HMAC-signed `lace_session` cookie (`lib/session.ts`, requires `SESSION_SECRET`), and `/api/me` exposes the user. `lib/auth.tsx` consumes `/api/me`; token refresh is handled in `lib/brightspace/api.ts` + `lib/brightspace/tokens.ts` (Brightspace rotates refresh tokens — always persist the returned one). Demo personas are **opt-in** via `NEXT_PUBLIC_SHOW_DEMO_USERS=true` or `NEXT_PUBLIC_DEMO_MODE=true`; while on, a localStorage persona overrides the real session, so never enable on a deployment real users can reach (ADR 0007). Real logins get the most-restricted user type by default; override with `HUB_DEFAULT_USER_TYPE` until the UPL access matrix drives real role mapping.
- **Route gating lives in `proxy.ts`** (the `middleware` convention Next 16.3 renamed). It verifies `lace_session` server-side and redirects to `/login?returnTo=…`; `lib/safe-return-to.ts` validates that destination against open redirects. Because Edge has no `node:crypto`, verification uses `lib/session-edge.ts` (Web Crypto), kept in lockstep with `lib/session.ts` by a parity test — see ADR 0003. `/learn/[slug]` is deliberately public (ADR 0006); the gate short-circuits entirely when demo personas are on, and fails open with a warning if `SESSION_SECRET` is missing (ADR 0004).
- **Route-level states exist**: `app/{error,global-error,not-found,loading}.tsx`, all built from `components/route-state-panel.tsx`. `global-error.tsx` is intentionally dependency-free (inline styles, no tokens) because it fires when the root layout itself failed.
- **Dashboard data is mocked**: `lib/services/dashboardService.ts` returns payloads from `mocks/dashboard.ts` with fake latency. This is the designed swap point — replace with `fetch('/api/me/dashboard')` when the real API ships. Types in `types/dashboard.ts`.
- **Supabase**: `lib/supabase/server.ts` has an admin client factory, used only by the admin sync route so far. Schema draft in `docs/planning/supabase-learning-items.sql`.
- **Admin API routes** (`app/api/admin/*`) require an `x-admin-secret` header matching `ADMIN_SYNC_SECRET` — guard them with `requireAdminSecret` from `lib/admin-auth.ts`. The config/Supabase health routes are guarded the same way; the Brightspace proxy health routes require the caller's own OAuth cookies (401 otherwise). Never add a server-wide Brightspace token fallback.
- Progress, saved items, and search analytics live in localStorage (keys prefixed `lace-`).

## Guardrails

- Never commit `.env` or `.env.local`; `.env.example` documents every variable. Production env vars live in the Vercel dashboard.
- Every new admin/sync route must call `requireAdminSecret` before touching Supabase.
- Tests must stay runnable with plain `npm test` on any platform (no hard-coded paths to the gitignored `tools/` Node).
- Two rules are intentionally off in `eslint.config.mjs`, each with reasoning inline: `react-hooks/set-state-in-effect` (localStorage hydration) and `@next/next/no-location-assign-relative-destination` (OAuth handoff + post-logout hard reset both need a real document navigation). See ADR 0009 before re-enabling either. The repo has **zero** `eslint-disable` comments and **zero** `any`/`as any`/`@ts-ignore` under `strict: true` — keep both properties.
- **Reuse the existing hooks.** `lib/hooks/` has `useFocusTrap`, `useScrollLock`, and `useMediaQuery`. Every overlay must use the focus trap _and_ the scroll lock — the mobile drawer shipped without either and Tab escaped it. `useScrollLock` is reference-counted so overlapping overlays can't unlock each other.
- **Colour tokens with a recorded contrast ratio in `app/globals.css` are locked** (ADR 0008). Changing one means running `npm run e2e` — the axe sweep checks every route in both themes. Text on a solid `--brand` fill uses `--brand-on`, not `text-white`.
- Coverage thresholds in `vitest.config.ts` are a ratchet set just under the current baseline: raise them, never lower them to make a build pass (ADR 0011).
- Line endings are LF everywhere via `.gitattributes` (ADR 0010). If `format:check` fails on files you didn't touch, run `git add --renormalize .`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
