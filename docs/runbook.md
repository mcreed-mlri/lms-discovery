# Runbook

Operational procedures. `.env.example` documents every variable and is the
authoritative list — this covers the things a variable list cannot tell you.

## Getting a checkout running

```bash
npm ci
cp .env.example .env.local   # then fill in values
npm run dev                  # https://localhost:3000
```

Node version is pinned in `.nvmrc` (24.20.0) and enforced by `engines`. On Windows
without a global Node, prefix any script with the bundled binary:

```bash
./tools/node-v24.15.0-win-x64/npm.cmd run dev
```

`npm run dev` uses `--experimental-https` because the Brightspace OAuth redirect
URI must be `https`. Your browser will warn about the self-signed certificate;
that is expected locally.

### The minimum to see the app

You do **not** need Brightspace credentials to develop. Set:

```
NEXT_PUBLIC_SHOW_DEMO_USERS=true
```

and sign in with a demo persona. See ADR 0007 for why this is opt-in — and why it
must never be set on a deployment real advocates can reach.

### The minimum for real login

`SESSION_SECRET`, `BRIGHTSPACE_CLIENT_ID`, `BRIGHTSPACE_CLIENT_SECRET`, and
`BRIGHTSPACE_REDIRECT_URI`. Generate the session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm test              # Vitest: unit + component
npm run test:watch    # while working
npm run test:coverage # enforces the ratchet in vitest.config.ts (ADR 0011)
npm run e2e           # Playwright + axe; builds and serves the app itself
npm run build
```

`npm run e2e` needs a browser once: `npx playwright install chromium`.

CI runs all of the above as three jobs — a standalone dependency audit, the fast
checks, and a separate e2e job so a browser download and a 130-page build do not
slow down feedback.

### "CI is red but the code is fine"

Check which job failed. A red `audit` with green `checks` means a new advisory
landed against something already in `package-lock.json` — nobody's push broke it,
and the weekly scheduled run exists to catch exactly this. Reproduce it without a
full install:

```bash
npm audit --audit-level=high   # resolves from the lockfile; no node_modules needed
```

Prefer an in-range lockfile-only bump (`npm audit fix`) over widening a version
range in `package.json`. Note that a Dependabot PR bumping the _parent_ package
often does not fix the advisory — it can widen the range while leaving the
vulnerable version pinned.

## Common problems

### "format:check fails on every file"

You have a checkout predating `.gitattributes`. Run `git add --renormalize .`.
See ADR 0010 — content is unchanged, only line endings.

### Login redirects in a loop

Usually `BRIGHTSPACE_REDIRECT_URI` not matching the URI registered on the
Brightspace OAuth app **exactly**, including scheme, port, and path. Note that
`lib/brightspace/oauth.ts` silently falls back to `https://localhost:3000/...` if
the variable is unset, which looks like a mismatch in production.

### Everything redirects to /login even when signed in

`proxy.ts` gates on the `lace_session` cookie. Check `SESSION_SECRET` is set and
identical to the value used when the cookie was issued — changing it invalidates
every existing session (ADR 0002). If it is unset entirely the gate fails open
with a `console.warn` rather than locking anyone out (ADR 0004).

### Brightspace calls start failing after a while

Brightspace **rotates refresh tokens**: every refresh returns a new one, and the
old one dies. `lib/brightspace/api.ts` returns `refreshedTokens` for exactly this
reason, and any handler that receives it **must** persist it via
`applyBrightspaceTokenCookies`. Dropping it logs the user out at the next refresh.
See `lib/brightspace/tokens.ts`.

### An admin route returns 503

`ADMIN_SYNC_SECRET` is unset. `lib/admin-auth.ts` fails closed by design. A 401
means the secret is set but the `x-admin-secret` header did not match.

### A Supabase-backed route returns 202 "accepted, not stored"

The target table does not exist yet. `/api/feedback` degrades deliberately rather
than showing a learner an error for offering feedback. Apply the schema (below).

## Database schema

Draft DDL lives in `docs/planning/*.sql` and is **not** yet managed by a migration
tool — it is applied by hand in the Supabase SQL editor. Files:

| File                              | Purpose                       |
| --------------------------------- | ----------------------------- |
| `supabase-learning-items.sql`     | Catalog table                 |
| `supabase-rls-learning-items.sql` | Row Level Security policies   |
| `supabase-analytics.sql`          | Feedback and analytics tables |

Apply the RLS policies whenever you apply the table — `app/api/catalog/route.ts`
relies on RLS for scoping, so an unprotected table is a data-exposure bug, not
just an incomplete setup.

**This is the weakest part of the setup.** Moving to `supabase/migrations/` with
the Supabase CLI is the intended fix; until then, schema changes are not
versioned and there is no record of what has been applied to which environment.

## Deployment

Vercel deploys `main` automatically via its GitHub integration. CI does not
deploy. Production environment variables live in the Vercel dashboard under
Settings → Environment Variables, **not** in the repo.

Before a deploy that real users will see, confirm:

- `NEXT_PUBLIC_SHOW_DEMO_USERS` and `NEXT_PUBLIC_DEMO_MODE` are unset or `false`
- `SESSION_SECRET` is set
- `ADMIN_SYNC_SECRET` is set
- `BRIGHTSPACE_REDIRECT_URI` matches the deployed URL

Note that `NEXT_PUBLIC_*` values are inlined **at build time**. Changing one in
Vercel requires a redeploy, not just a restart.
