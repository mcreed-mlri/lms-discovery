# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: new legal aid attorneys** — advocates in roughly their first year or two of legal aid practice, building both lawyering skills and substantive-law knowledge while already carrying cases.

**The defining scene is just-in-time, before a case task.** A hearing, client meeting, intake, or filing is imminent and they need the one topic that answers the question in front of them. Success is measured against that moment, not against browsing sessions or course completions.

Secondary audiences already modeled in the app, served but not prioritized:

- Non-lawyer advocates and paralegals — same catalog, narrower access (see UPL gating below).
- Faculty / content creators — preview any catalog item and orient in the curriculum map while authoring.
- Program staff and training leadership — admin and program lenses; largely future scope.

## Product Purpose

A discovery layer in front of Brightspace. It helps advocates search, browse, understand, and navigate to the right training, module, topic, or learning path faster than Brightspace's native course-centered discovery allows, then hands off into Brightspace to actually do the learning.

Success: an advocate with a live case question finds the relevant topic and lands in the right place in Brightspace, in one pass, without knowing which course it lives inside.

## Positioning

**Brightspace remains the system of record**; the hub never competes with it. Brightspace owns courses, users, enrollment, permissions, progress, completions, and official learner records. The hub owns discovery, search, MLRI-specific metadata, curated paths, and the handoff.

The mechanism a neighboring product could not truthfully copy:

- **Discovery below the course line.** Modules, topics, and short lessons are first-class, searchable results that deep-link into a specific place in Brightspace. Brightspace Discover searches whole self-enrollable courses by title and description only.
- **MLRI-specific metadata as the ranking substrate** — practice areas, advocate types, jurisdictions, audience, lifecycle status, synonyms, and editorial boosts — which does not exist inside Brightspace.
- **Role and UPL-aware eligibility**, so a non-lawyer advocate is not sent toward attorney-only material.
- **The curriculum plan is the catalog.** Planned-but-unbuilt offerings are browsable alongside built ones, so the hub shows the whole intended curriculum rather than only what shipped.

Language discipline: the hub helps people _find_ content; Brightspace _delivers_ it. Users must never be confused about which system they are in.

## Operating Context

- Users are practicing advocates, often mid-task and time-pressed. Reading time competes directly with case work.
- Every meaningful action ends in a handoff to `mlri.brightspace.com` — course home, a content page, or a module anchor. A few internal destinations exist (the curriculum map, the faculty handbook).
- Course operations, sync checks, and Brightspace setup live in a separate app, **Brightspace Manager**; the hub links out rather than duplicating them.
- Jurisdiction matters to eligibility; Massachusetts (`MA`) is the jurisdiction in use today.
- The curriculum is organized into two branches, **Legal Skills** and **Substantive Law**. Only the Legal Skills branch currently generates catalog items; Substantive Law waits until its areas have topics.
- Deployment is Vercel from `main`; CI runs typecheck, lint, format check, tests, and a production build.

## Capabilities and Constraints

Confirmed and working:

- Search over courses, modules, and paths with synonyms, facets, and editorial ranking (`lib/search.ts`, `lib/search-metadata.ts`).
- Catalog browsing, filtering, learning-item detail pages, and a curriculum-map view.
- Real Brightspace OAuth login with an HMAC-signed session cookie; demo personas behind a flag.
- Access gating by advocate type, jurisdiction, and UPL acknowledgment (`lib/access.ts`).
- Availability model: `available` items route into Brightspace; `planned` items route back to the curriculum map.

Constraints:

- Stack is fixed: Next.js 16 App Router, React 19, TypeScript, Tailwind 3. Tests run under `node:test` via `tsx` and must stay cross-platform.
- The catalog is hard-coded in `lib/data.ts` plus generated in `lib/curriculum-catalog.ts`. Supabase `learning_items` is the intended replacement; do not over-invest in restructuring the current shape.
- Dashboard data is mocked (`lib/services/dashboardService.ts` → `mocks/dashboard.ts`); the swap point is a real `/api/me/dashboard`.
- Progress, saved items, and search analytics live in `localStorage` (`lace-` prefixed keys), not on a server. Treat them as device-local, losable, and not authoritative.
- Admin and sync routes require the `x-admin-secret` header and fail closed.
- Real logins get the most-restricted advocate type until a real role mapping exists.

Terminology:

- **Course** → **Module** → **Lesson** (short "micro-module"). **Path** = a curated journey across courses.
- **Skill Area** = a curriculum-map column, generated as a course.
- **Advocate types**: attorney, non-lawyer advocate, paralegal, faculty, admin.
- **UPL** = unauthorized practice of law; some content requires an acknowledgment before non-attorneys may access it.

Explicitly undecided product facts:

- Roles are modeled today as one user type per person. The intended model is one stable user record with **multiple role assignments over time and in parallel** (learner, supervisor, program manager, super-admin, instructor, report viewer), each scoped and dated. Not built.
- Whether the hub eventually embeds inside Brightspace (navbar link, widget, LTI) or stays a separate front door.
- Which Brightspace progress and completion data is actually retrievable under our permissions.
- Whether the currently mocked manager, program, and admin lenses become real product scope.

## Brand Commitments

- The hub is **its own sub-brand**, related to but not governed by MLRI's existing identity. Future design work has room to define the visual identity.
- **"LACE" is a placeholder. The real organization/product name is to be announced.** Do not build identity around the LACE wordmark, do not treat it as a fixed brand, and do not invent an expansion of the acronym — it is not recorded anywhere and has not been confirmed.
- No binding logo, palette, or type commitments exist yet. Existing icon assets in `public/` (`icon.svg`, `icon-192.png`, `icon-512.png`) are placeholders of the same status as the name.
- Voice constraint that does hold: never blur the line between this app and Brightspace.

## Evidence on Hand

- **Real curriculum structure**: `lib/curriculum-map.ts` — the actual planned curriculum, not mock data.
- **Genuinely built offerings** (a small set): Welcome to the Learning Hub, Faculty Handbook: Interactive Elements, Curriculum Map, Eviction Defense: The First 48 Hours, Brightspace Wrapper Demo.
- **Planning research**: `docs/planning/brightspace-learning-hub-plan.md` (including cited D2L documentation on Discover's limits), plus D2L and outsourced-IT question lists and a search-governance checklist.
- **Faculty-facing artifact**: `public/tools-handbook/faculty-showcase.dc.html`.

Absences future work must not fabricate:

- No testimonials, quotes, learner stories, usage statistics, satisfaction scores, or completion metrics exist.
- No named customers, partner organizations, funders, or press.
- No real learner progress or enrollment data — every dashboard number on screen today is mock.
- No confirmed launch date, learner count, or program size.
- Most catalog items are **planned, not built**. Never present a planned offering as available.

## Product Principles

1. **Answer the question in front of them.** The just-in-time case moment is the design target; anything that serves browsing at its expense is a regression.
2. **Find here, learn there.** Every surface makes it obvious the hub is the front door and Brightspace is the destination. Handoffs are precise — deepest available link, not the course home.
3. **Below the course line.** Modules, topics, and lessons are the unit of value. Do not let course containers become the only way in.
4. **Eligibility is part of discovery.** Role, jurisdiction, and UPL boundaries shape what a person is shown, and being ineligible must be legible rather than silently empty.
5. **Show the whole curriculum, honestly.** Planned offerings are visible so the plan is legible, and always distinguishable from what a learner can start today.

## Accessibility & Inclusion

**WCAG 2.2 AA is a binding requirement.** Beyond 2.1 AA, that specifically means honoring target size (minimum), dragging movements having a single-pointer alternative, focus-not-obscured, consistent help placement, and redundant entry. Users include advocates working under time pressure on unpredictable hardware, so keyboard operability and legibility at real reading distances are not optional polish.
