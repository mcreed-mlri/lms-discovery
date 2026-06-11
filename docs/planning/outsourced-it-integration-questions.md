# Outsourced IT Questions For LACE Integrations

Use this when talking with outsourced IT, D2L/Brightspace admins, hosting vendors, or leadership. The goal is to make support ownership explicit before LACE depends on Supabase, Brightspace APIs, SSO, or scheduled syncs.

## Framing

LACE is currently a small custom frontend/backend layer owned by MLRI, with Brightspace remaining the LMS system of record.

For the first connection spike, we are only testing non-sensitive plumbing:

- LACE frontend calls a Next.js backend route.
- Backend reads/writes non-sensitive catalog metadata in Supabase.
- Backend tests one Brightspace API connection.
- No learner progress, enrollments, completion records, client data, field reports, or production sync jobs.

## Ownership Reality

MLRI does not have a large in-house IT/development team for this platform. The practical owner is currently one internal developer.

That means:

- If Supabase is down, misconfigured, over quota, or locked, the internal LACE owner is first responder.
- If the Brightspace API disconnects, OAuth expires, scopes change, or sync fails, the internal LACE owner is first responder.
- If the deployment breaks, environment variables are wrong, or GitHub/Vercel/build settings fail, the internal LACE owner is first responder.
- Outsourced IT may support network, identity, vendor access, security review, and escalation, but should not be assumed to operate the app day to day unless they explicitly agree.

This is manageable only if the first production version stays small, observable, documented, and easy to recover.

## Questions For Outsourced IT

### Hosting And Deployment

- Is the proposed hosting platform approved for MLRI use?
- Who owns DNS if LACE gets a custom domain such as `learning.mlri.org`?
- Are there restrictions on GitHub Pages, Vercel, Supabase, or other external hosting tools?
- Does IT require security review before production launch?
- Does IT require IP allowlisting, firewall changes, or vendor approval for backend services?
- Who has admin access to deployment settings?
- Who can redeploy or roll back if I am unavailable?

### Supabase

- Is Supabase approved as a cloud backend for MLRI?
- What kinds of data may be stored there?
- Is non-sensitive catalog metadata acceptable?
- Are staff profile fields acceptable?
- Are learning progress, enrollment, or completion records acceptable, or must those remain only in Brightspace?
- Are backups, retention, and incident response MLRI-owned, IT-owned, or vendor-owned?
- Who should hold the Supabase project owner/admin account?
- Who should have access to the service role key?
- Do we need a data processing agreement or vendor/security review before storing anything beyond test metadata?

### Brightspace API

- Who at MLRI or outsourced IT can register or approve Brightspace OAuth/API apps?
- Who coordinates with D2L support when API access breaks?
- Should LACE use user-delegated OAuth or server-to-server OAuth for catalog sync?
- Can we get a sandbox/test course before touching real training content?
- Which API scopes are allowed?
- Are we allowed to read course metadata?
- Are we allowed to read module/topic structure?
- Are we allowed to read enrollments?
- Are we allowed to read progress/completion data?
- What API rate limits or support boundaries apply?
- Who will be notified if D2L changes OAuth settings, API versions, permissions, or URLs?

### Authentication And SSO

- Does MLRI use Microsoft Entra ID, Google Workspace, Okta, or another identity provider?
- Should LACE eventually use the same staff login as email or Brightspace?
- Is Supabase Auth acceptable, or must authentication use MLRI-managed SSO?
- Who approves OAuth apps?
- Who handles account deactivation when staff leave?
- Can LACE rely on Brightspace identity, or does it need its own user profile table?
- What is the minimum acceptable auth approach for a private pilot?

### Secrets And Access

- Where should production secrets live?
- Is there a password manager, secrets vault, or standard process?
- Who can access Brightspace API credentials?
- Who can access Supabase admin keys?
- Are local `.env.local` files acceptable for development?
- What is the process if a key leaks?
- Who rotates credentials?
- How often should keys be reviewed?

### Data Classification

- How should LACE classify data?
- Is course catalog metadata considered low-risk/internal?
- Are staff names, roles, assignments, and learning paths internal or sensitive?
- Are progress and completion records sensitive?
- Are search logs sensitive?
- Are field reports/community posts legally sensitive?
- What data should LACE never store?
- What data should stay only in Brightspace?

### Logging And Analytics

- Can LACE log search queries?
- Should analytics be aggregate only?
- Can analytics be tied to individual users?
- How long can logs be retained?
- Who can view logs?
- Should search terms be redacted or excluded from production logs?
- What monitoring/alerting tools are acceptable?

### Support Expectations

- If Supabase is unavailable, who is contacted first?
- If Brightspace API auth fails, who is contacted first?
- If a deployment breaks, who can restore the last working version?
- If the internal LACE owner is unavailable, is there any backup responder?
- What is the expected response time for outsourced IT on vendor/API issues?
- What issues are considered IT-owned versus LACE-owner-owned?
- Do we need a lightweight runbook before launch?

## Minimum Runbook Needed Before Production

Before LACE depends on Supabase or Brightspace APIs in production, create a short runbook with:

- Where the app is hosted
- Where environment variables live
- How to redeploy
- How to roll back
- How to check Supabase health
- How to check Brightspace API health
- Who owns each vendor account
- Who to contact at outsourced IT
- Who to contact at D2L
- What data is safe to sync
- What data is explicitly out of scope

## Single-Developer Design Rules

Because the tech team is currently one person:

- Prefer simple scheduled/manual sync over complex real-time integration.
- Keep Brightspace as the official record for enrollments, progress, completions, and certificates.
- Keep Supabase data small and recoverable at first.
- Build health checks before features that depend on the integration.
- Log enough to diagnose sync failures, but avoid sensitive user/search data.
- Make failure states visible in the admin UI.
- Avoid custom auth complexity until SSO direction is confirmed.
- Document every secret, vendor account, and recovery step.

## Safe First Spike

The safe first version is:

- Supabase stores one test `learning_items` row.
- LACE has `/api/health/supabase`.
- LACE has `/api/health/brightspace`.
- Brightspace API test uses one sandbox/test course or harmless `whoami` call.
- No real learner data is synced.
- No automated production sync runs.
- Findings are documented before expanding scope.

## Decision Needed

Before production, leadership/IT should explicitly confirm:

- Supabase is acceptable for the data we plan to store.
- Brightspace API access is approved.
- Authentication direction is known.
- The internal LACE owner is the first responder.
- Outsourced IT escalation boundaries are documented.
- The first production scope is limited enough for a one-person technical owner to maintain.
