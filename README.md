# MLRI Learning Hub

A Next.js App Router MVP for discovering MLRI learning content and navigating into Brightspace.

Brightspace remains the system of record for courses, users, enrollment, and progress. This app only handles local discovery UI, search, browsing, learning paths, and simulated Brightspace handoff links.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## LACE Hub dashboard (Phase 1 mock)

Unified role-based dashboard at **`/my-learning`** (aliases `/dashboard` and `/me` redirect here). Uses the same LACE hub shell and editorial theme as the discovery library. **Mock data only** — no Brightspace OAuth or Supabase yet.

- **Learner** (`/my-learning`): full My Learning UI with course progress cards
- **Manager** (`/my-learning/team`), **Program** (`/my-learning/program`): Phase 3 scaffolds
- **Super-admin** (`/my-learning/admin`): integration status scaffold

Use the **dev role switcher** (bottom-left on dashboard routes) to preview nav for `learner`, `manager`, `program`, or `super_admin`. Choice persists in `localStorage` key `lace-dev-role`.

Data layer: `lib/services/dashboardService.ts` — today returns mocks from `mocks/dashboard.ts`. **Replace mocks with `fetch('/api/me/dashboard')` in Phase 1** when the server route ships. Types live in `types/dashboard.ts`.

## Project structure

```text
app/                         Next.js App Router pages and global styles
app/dashboard/               LACE Hub unified dashboard (mock Phase 1)
components/                  Reusable UI components for the learning hub
components/dashboard/        Dashboard-specific UI (cards, shell, role gate)
lib/                         Local demo data and Brightspace URL helpers
lib/services/                dashboardService (mock → API swap point)
mocks/                       Dashboard mock payloads
types/                       Dashboard TypeScript contracts
archive/standalone-prototype Earlier static HTML/CSS/JS prototype
archive/mlri-lms             Saved project exports, screenshots, and uploads
```

The active app is the Next.js project at the repository root. The `archive/`
folder keeps earlier prototype artifacts available for reference without mixing
them into the app source.

## GitHub Pages deployment checklist

- [ ] Push this repository to GitHub (default branch: `main`)
- [ ] In GitHub, open `Settings -> Pages`
- [ ] Under **Build and deployment**, set **Source** to **GitHub Actions**
- [ ] Confirm `.github/workflows/deploy-pages.yml` exists on `main`
- [ ] Push any new commit (or run the workflow manually from the **Actions** tab)
- [ ] Wait for **Deploy Next.js site to Pages** workflow to succeed
- [ ] Open your site from `Settings -> Pages` once deployment is complete

### Notes

- For repositories named `<username>.github.io`, the site is served at the root domain.
- For all other repository names, the site is served from `/<repo-name>/` automatically.
