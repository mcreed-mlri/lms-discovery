# MLRI Learning Hub

A Next.js App Router MVP for discovering MLRI learning content and navigating into Brightspace.

Brightspace remains the system of record for courses, users, enrollment, and progress. This app only handles local discovery UI, search, browsing, learning paths, and simulated Brightspace handoff links.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Project structure

```text
app/                         Next.js App Router pages and global styles
components/                  Reusable UI components for the learning hub
lib/                         Local demo data and Brightspace URL helpers
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
