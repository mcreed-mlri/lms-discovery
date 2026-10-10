# Pre-Pilot Status

This app is in a controlled pre-pilot state. The current build is intended to
validate discovery, learner dashboard flows, access rules, and Brightspace
handoff patterns before the production Brightspace site is available.

## Current Constraints

- The production Brightspace site is not live yet. Branding and final naming are
  still pending, and that decision may take roughly two months.
- Brightspace integration work targets the sandbox until the production tenant
  and final content structure are available.
- The pilot has moved to November 2026.
- Dashboard and catalog examples use representative pilot seed data. This is
  intentional: the production content source does not exist yet.

## Production Transition

- Keep Brightspace as the system of record for courses, enrollments, users, and
  progress.
- Replace the dashboard seed-data adapter with the live `/api/me/dashboard`
  source once production Brightspace content and the server route are ready.
- Keep demo personas available only in explicit demo mode. Stakeholder preview
  cards may be shown beside Brightspace, but they must not authenticate users
  unless `NEXT_PUBLIC_DEMO_MODE=true`.
