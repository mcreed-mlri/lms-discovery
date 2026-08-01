# MLRI Learning Hub

A Next.js App Router MVP for discovering MLRI learning content and navigating into Brightspace.

> **Local folder:** `learning-hub/` · **Workspace map:** [`../README.md`](../README.md)

Brightspace remains the system of record for courses, users, enrollment, and progress. This app handles discovery UI, search, browsing, learning paths, learner progress surfaces, and handoff links. Course operations, sync checks, and Brightspace setup live in Brightspace Manager.

## Run locally

### Windows (no global Node/npm)

This repo keeps a local Node copy in `tools/` (gitignored). Use it when `npm` is not on your PATH or is blocked by policy.

**First time only** — if `tools/node-v24.15.0-win-x64/` is missing, download the [Node.js v24.15.0 Windows x64 zip](https://nodejs.org/dist/v24.15.0/node-v24.15.0-win-x64.zip), extract it to `tools/node-v24.15.0-win-x64/`, then install dependencies:

```powershell
.\tools\node-v24.15.0-win-x64\npm.cmd install
```

Start the dev server (any npm script works the same way through the bundled npm):

```powershell
.\tools\node-v24.15.0-win-x64\npm.cmd run dev
```

Then open `http://localhost:3000`.

**If `npm.cmd run dev` fails with `'"node"' is not recognized...`**: the bundled `npm.cmd`/`next.cmd` shims fall back to a bare `node` command when they can't resolve their own path, and that only works if the bundled Node folder is on `PATH`. Fix by adding it for the current terminal session before running npm:

```powershell
$env:PATH = "C:\dev\LACE\learning-hub\tools\node-v24.15.0-win-x64;" + $env:PATH
.\tools\node-v24.15.0-win-x64\npm.cmd run dev
```

This only affects the current PowerShell window — re-run it in each new terminal, or add it to your PowerShell profile to make it permanent.

### macOS / Linux (or when Node/npm is already installed)

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit `.env` or `.env.local` — only `.env.example` is tracked in git.

- **Supabase** (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`): database access, prepared for the dashboard phase. The service role key is server-only — keep it secret.
- **Brightspace Manager** (`NEXT_PUBLIC_BRIGHTSPACE_MANAGER_URL`): public handoff URL for the operations console. Defaults to `https://brightspace-manager.vercel.app`; set `http://localhost:3001` when running BSM locally.
- **Brightspace** (`BRIGHTSPACE_*`): OAuth and API credentials for the LMS integration. Without these, the app still runs — the discovery UI and mock dashboard work fine; only the `/api/auth/brightspace/*`, `/api/health/*`, and `/api/admin/sync/*` routes need them.
- **Demo users** (`NEXT_PUBLIC_SHOW_DEMO_USERS`): persona cards show on `/login` beside Brightspace by default for demos. Set to `false` to hide them.
- **`ADMIN_SYNC_SECRET`**: shared secret that callers must send in the `x-admin-secret` header to use `/api/admin/*` routes. Admin routes return 503 if it is not configured (fail closed).

For production, set the same variables in the Vercel dashboard (Settings → Environment Variables).

## Other useful scripts

```bash
npm test        # run the search-ranking and access-filtering tests
npm run lint    # ESLint
npm run format  # Prettier (format:check to verify without writing)
npm run typecheck
npm run build
```

## LACE Hub dashboard (Phase 1 mock)

Unified role-based dashboard at **`/my-learning`** (aliases `/dashboard` and `/me` redirect here). Uses the same LACE hub shell and editorial theme as the discovery library. **Mock data only** — no Brightspace OAuth or Supabase yet.

- **Learner** (`/my-learning`): full My Learning UI with course progress cards
- **Manager** (`/my-learning/team`), **Program** (`/my-learning/program`): Phase 3 scaffolds
- **Super-admin** (`/my-learning/admin`): redirects to Brightspace Manager for course/admin operations

Longer-term, the dashboard should support **multiple role assignments per user over time**, not one permanent user type. A learner may later become a supervisor, and supervisors or super-admins may still have their own learning activity. Keep one stable user record, then attach current and historical roles with scope, such as learner, supervisor/manager, program manager, super-admin, instructor/content manager, or report viewer.

Expected dashboard lenses:

- **My Learning**: personal progress, courses, deadlines, notices, feedback, and certificates.
- **My Team**: assigned learners, progress, gaps, overdue work, and supervisor actions.
- **Program Overview**: cohort, practice area, or program-level reporting.
- **Admin/reporting**: cross-program insight and exports stay in the Hub when they support learning operations. Brightspace integrations, sync writes, permissions implementation, and system setup live in Brightspace Manager.

Use the **dev role switcher** (bottom-left on dashboard routes) to preview nav for `learner`, `manager`, `program`, or `super_admin`. Choice persists in `localStorage` key `lace-dev-role`.

Data layer: `lib/services/dashboardService.ts` — today returns mocks from `mocks/dashboard.ts`. **Replace mocks with `fetch('/api/me/dashboard')` in Phase 1** when the server route ships. Types live in `types/dashboard.ts`.

## Project structure

```text
app/                         Next.js App Router pages and global styles
app/dashboard/               LACE Hub unified dashboard (mock Phase 1)
components/                  Reusable UI components for the learning hub
components/dashboard/        Dashboard-specific UI (cards, shell, role gate)
lib/                         Local demo data, Brightspace URLs, and Manager handoff helpers
lib/services/                dashboardService (mock → API swap point)
mocks/                       Dashboard mock payloads
types/                       Dashboard TypeScript contracts
tests/                       node:test suites (search ranking, access control)
docs/planning/               Architecture and integration planning docs
```

Earlier prototypes (`archive/`, `design_handoff_studio_rail/`) were removed
from tracking in June 2026; they remain available in git history.

## Deployment

The app deploys to **Vercel** via its GitHub integration: pushing to `main` triggers a production deploy automatically. Environment variables are managed in the Vercel dashboard, not in the repo.

GitHub Pages is **not** a deployment target — this app uses Next.js API routes (Brightspace OAuth, health checks, admin sync), which need a server. The old Pages site was unpublished in June 2026.

Continuous integration runs on GitHub Actions (`.github/workflows/ci.yml`): typecheck, lint, format check, tests, and a production build on every push and pull request. CI does not deploy; Vercel handles that.
