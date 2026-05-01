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
