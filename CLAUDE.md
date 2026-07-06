# MLRI Learning Hub

Next.js (App Router) discovery layer in front of Brightspace LMS for MLRI legal aid training. **Brightspace stays the system of record** for courses, enrollment, and progress; this app handles discovery, search, browsing, and handoff links into Brightspace.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm test         # node:test suites in tests/ (run via tsx)
npm run lint     # ESLint (flat config in eslint.config.mjs)
npm run format   # Prettier (format:check in CI)
npm run typecheck
npm run build
```

Windows without global Node: prefix any script with the bundled npm, e.g. `.\tools\node-v24.15.0-win-x64\npm.cmd run dev`. CI (`.github/workflows/ci.yml`) runs typecheck + lint + format:check + test + build; Vercel deploys `main` via its git integration.

## Architecture

- **Catalog is hard-coded** in `lib/data.ts` (courses, modules, paths). It flows through `lib/search.ts` (in-memory ranking with synonyms/facets, metadata in `lib/search-metadata.ts`) and `lib/access.ts` (role/jurisdiction/UPL gating). The roadmap replaces this with the Supabase `learning_items` table — the RLS-scoped read path already exists at `app/api/catalog/route.ts`; don't over-invest in restructuring `lib/data.ts`.
- **Auth is real Brightspace login** (July 2026): `/login` → `app/api/auth/brightspace/start` → callback exchanges the code, verifies with whoami, sets an HMAC-signed `lace_session` cookie (`lib/session.ts`, requires `SESSION_SECRET`), and `/api/me` exposes the user. `lib/auth.tsx` consumes `/api/me`; token refresh is handled in `lib/brightspace/api.ts` + `lib/brightspace/tokens.ts` (Brightspace rotates refresh tokens — always persist the returned one). Demo personas still exist behind `NEXT_PUBLIC_DEMO_MODE=true`. Real logins get the most-restricted user type by default; override with `HUB_DEFAULT_USER_TYPE` until the UPL access matrix drives real role mapping.
- **Dashboard data is mocked**: `lib/services/dashboardService.ts` returns payloads from `mocks/dashboard.ts` with fake latency. This is the designed swap point — replace with `fetch('/api/me/dashboard')` when the real API ships. Types in `types/dashboard.ts`.
- **Supabase**: `lib/supabase/server.ts` has an admin client factory, used only by the admin sync route so far. Schema draft in `docs/planning/supabase-learning-items.sql`.
- **Admin API routes** (`app/api/admin/*`) require an `x-admin-secret` header matching `ADMIN_SYNC_SECRET` — guard them with `requireAdminSecret` from `lib/admin-auth.ts`. The config/Supabase health routes are guarded the same way; the Brightspace proxy health routes require the caller's own OAuth cookies (401 otherwise). Never add a server-wide Brightspace token fallback.
- Progress, saved items, and search analytics live in localStorage (keys prefixed `lace-`).

## Guardrails

- Never commit `.env` or `.env.local`; `.env.example` documents every variable. Production env vars live in the Vercel dashboard.
- Every new admin/sync route must call `requireAdminSecret` before touching Supabase.
- Tests must stay runnable with plain `npm test` on any platform (no hard-coded paths to the gitignored `tools/` Node).
- `react-hooks/set-state-in-effect` is intentionally off in `eslint.config.mjs` (localStorage hydration pattern); see the comment there before re-enabling.
