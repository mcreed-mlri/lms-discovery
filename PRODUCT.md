# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: new legal aid attorneys.** These are advocates in roughly their first year or two of legal aid practice. They are building both lawyering skills and substantive-law knowledge while already carrying cases.

**The defining scene is just-in-time, before a case task.** A hearing, client meeting, intake, or filing is coming up, and they need the one thing that answers the question in front of them. That might be a short reference page, a module, a law change, a MassLegalServices resource, or a note they wrote themselves last month. Success is measured against that moment, not against browsing sessions or course completions.

Secondary audiences already modeled in the app, served but not prioritized:

- **Non-lawyer advocates and paralegals.** They use the same binders with narrower access (see UPL gating below).
- **Faculty and content creators.** They preview any item and orient in the curriculum while authoring.
- **Program staff and training leadership.** They get admin and program views, which are largely future scope.

## Product Purpose

**The attorney's binder.** In a legal aid practice, the hub is the one place to open when you're stuck. It gathers everything an advocate needs for a topic into binders that you can open, tab through and make your own:

- Brightspace training, at the course, module and lesson level
- Short reference pages
- MassLegalServices resources
- Law and rule changes
- The advocate's own notes

**Legal Skills comes first, as three binders** that group the curriculum map's columns along the life of a case:

- **Practice Foundations:** Foundations, Ethics, Intake, Research, Writing.
- **Litigation:** Case Prep, Trial, Post-Trial, Appeals. The Hearsay pilot lives under Trial.
- **Beyond the Courtroom:** ADR, Legislative, Community.

Each column stays one tab and the curriculum map stays the source of truth, so every binder's dividers fit a laptop screen. Substantive-law binders (Housing, Family, Immigration, and the rest) follow as their areas get content.

Success: an advocate with a live case question opens the first useful thing within 15 seconds or 2 clicks, without knowing which course, site or system it lives in.

## Information Architecture

Mockups and the flow diagram: https://claude.ai/artifact/MCQCHbvATG2m4KVNQiu3QW (private canvas; board B is the chosen Home, E is a binder tab, F is the flow).

**Header navigation:** Home · Binders ▾ · My learning · Updates, with search on every page (Ctrl K). Learning paths live under My learning.

**The binder:**

- The Binders ▾ switcher opens a subject binder and remembers the last tab used.
- A binder's divider tabs are its sections: a Contents tab plus 3–5 curriculum areas. Home sits outside the binders; off binder pages the dividers show the binder you last opened.
- A tab holds every kind of item for that section. Chips narrow it to Reference, Courses, New law, My notes or Coming.

**Four ways in. All of them reach the same item:**

1. **"I need an answer now"** (most visits). Search shows the fastest answer first, then checklists and practice, then the full course, then related law changes.
2. **"I'm working in my area."** Binders ▾, then a tab, then narrow by kind.
3. **"I'm building a skill"** (every few weeks). Home or My learning, then a course or path stop, then Brightspace.
4. **"I followed a link."** From an Updates email, Brightspace or a MassLegalServices page, the advocate logs in and lands on the exact item inside its tab, never on Home.

**On every item:**

- **My notes:** private notes attached to the item or the tab.
- **Ask about this:** community, routed to the right listserv or task force.
- **What changed:** law changes that affect this item.
- **Flag as out of date:** goes to whoever owns that content.

**What happened to the old buckets:**

- **Trainings and Resources are not separate destinations.** Both are kinds of item inside a binder tab, because a learner can't know in advance which one holds the answer.
- **The dashboard becomes Home**, and Home is not stat tiles. Home is resume, what changed for you, and search. Hours, history and certificates live in My learning.
- **Community goes beside the content** ("Ask about this") rather than being its own section. It earns a section of its own only once people are actually using it.

## Positioning

The hub files things and links out. It does not take over what other systems own:

- **Brightspace** remains the system of record for courses, users, enrollment, permissions, progress, completions and official learner records.
- **MassLegalServices** remains the home of its resources, listservs and task forces.

The hub owns:

- the binders: their structure and the filing of items into tabs
- search
- MLRI-specific metadata
- reference pages written for the hub
- notes, curated paths, and the handoff to each item's home

What a neighbouring product could not truthfully copy:

- **Below the course line.** Modules, topics and short lessons are first-class, searchable results that deep-link into a specific place in Brightspace. Brightspace Discover searches only whole self-enrollable courses, by title and description.
- **Training and practice resources in one place.** MLRI runs both the training and MassLegalServices, so the hub can put a lesson, a sample form and the right listserv side by side under one tab.
- **MLRI-specific metadata as the basis for ranking:** practice areas, advocate types, jurisdictions, audience, lifecycle status, synonyms and editorial boosts. None of this exists inside Brightspace.
- **Role and UPL-aware eligibility**, so a non-lawyer advocate is not sent toward attorney-only material.

Language discipline: **learners never see the word "Brightspace".** The course wrapper makes courses feel like part of the hub, so a course simply opens or resumes, with no outbound arrow. Only sites the learner really leaves for are named and marked ↗ (MassLegalServices). Brightspace is named only in code, docs, and admin and faculty screens.

## Practice and Simulation

**The team's top request:** training must be very interactive. New attorneys want a safe place to rehearse a skill before they do it in court. Nothing is built yet beyond the Hearsay pilot's own practice steps (supported, rapid and independent practice in skill 2).

**Practice is an item kind**, filed under a tab like everything else. It is not a separate product area. A tab's "Practice" chip shows every drill for that section.

**Stages, chosen so one developer can deliver them:**

1. **Scripted practice inside the course.** This is the pattern the Hearsay package already uses: static HTML, branching choices, feedback written by a subject-matter expert, no AI. It's cheap, safe and reviewable. The hub's job is to make each drill findable and deep-linkable on its own.
2. **One AI drill, for the pilot.** A text exercise for Hearsay skill 2: the AI plays opposing counsel or the judge and raises an objection, the learner responds in writing, and the AI gives feedback against an expert-written rubric taken from the course's Procedure Reference. One skill, one rubric, labelled as practice.
3. **More drills, then voice,** only if stage 2 shows learners use it and SMEs trust the feedback.

**The hard parts are not code:**

- **Rubrics and scenarios** have to be written and reviewed by subject-matter experts. The AI is only as good as the rubric.
- **Confidentiality.** Learners may paste real client facts. The drill must tell them not to, use fictional fact patterns, and keep no transcripts by default.
- **Framing.** It's practice feedback, not legal advice, and it says so every time.
- **Cost and access.** Usage limits per learner, available only to logged-in staff, with a way to turn it off.

Until stage 2 is approved, design the slot (Practice as an item kind, a "Practice" chip, a practice card in the tab) without promising AI.

## MassLegalServices

MLRI runs MassLegalServices (masslegalservices.org), and its team works in the same office. Bringing MLS into the hub is the most important open integration and probably the most complex. Nothing below is decided.

**Likely stages, cheapest first:**

1. **Curated links.** The hub stores a record per MLS resource: title, URL, binder tab, kind, practice area, and the date it was last reviewed. The hub files and searches these records and links out. This needs no work from the MLS team, and it gives the binders a real resource library on day one.
2. **A shared vocabulary.** Agree on one list of practice areas and topics that both sites use for tagging. This is the most valuable long-term step, because it makes everything after it cheap.
3. **A feed.** If MLS can publish its resources, or its news and law changes, as a feed or API, a nightly sync fills `learning_items` with `kind = resource` (and possibly `kind = update`) instead of hand-entered records.
4. **Links back.** MLS pages link into the hub ("Training on this topic →"), which makes way in #4 a real path.
5. **Community.** "Ask about this" sends people to the right MLS listserv or task force for that tab.

**Questions for the MLS team:**

- What platform runs the site, and can it export resources (a feed, an API, a sitemap)?
- How are resources tagged today? Would they adopt a shared vocabulary of practice areas and topics?
- Who reviews MLS content for currency, and could the hub's "flag as out of date" reach them?
- Which listservs and task forces map to which skill areas and practice areas? Who is allowed to join each one?
- Does MLS publish law-change news that should feed the hub's Updates?
- Do MLS users and hub users sign in the same way? Do MLS resources need access rules (for example, advocate-only pages)?
- What would they want back from the hub: search terms that found nothing, traffic sent their way?

## Operating Context

- Users are practicing advocates, often mid-task and short on time. Reading time competes directly with case work.
- Items open in one of three places:
  - the hub itself (reference pages, the curriculum map)
  - `mlri.brightspace.com` (course home, a content page, or a module anchor)
  - masslegalservices.org
- Course operations, sync checks and Brightspace setup live in a separate app, **Brightspace Manager**. The hub links out to it rather than duplicating it.
- Jurisdiction matters to eligibility. Massachusetts (`MA`) is the jurisdiction in use today.
- The curriculum has two branches, **Legal Skills** and **Substantive Law**. These become the first binders: Legal Skills now, Substantive Law when its areas have content.
- Deployment is Vercel from `main`. CI runs the audit, typecheck, lint, format check, coverage, build, and Playwright + axe.

## Capabilities and Constraints

Confirmed and working:

- Search over courses, modules and paths with synonyms, facets and editorial ranking (`lib/search.ts`, `lib/search-metadata.ts`).
- Catalog browsing, filtering, learning-item detail pages, and a curriculum-map view.
- Real Brightspace OAuth login with an HMAC-signed session cookie. Demo personas sit behind a flag.
- Access gating by advocate type, jurisdiction and UPL acknowledgment (`lib/access.ts`).
- Availability model: `available` items route into Brightspace, and `planned` items route back to the curriculum map.

Not built yet (the binder direction needs these):

- Binders, tab membership, and an item `kind` (course, module, reference, resource, update, note). The Supabase `learning_items` table is the natural home for all of these.
- Hub-native reference pages.
- Notes beyond this device. My notes is built per binder tab (`lib/notes.ts`), stored in `localStorage` and keyed by user id so a shared office computer keeps them apart. Moving them to the server is what lets them follow the advocate across devices.
- MassLegalServices records (see above).
- Deep links that survive the login round trip to the exact item. `returnTo` already supports this; the item URLs need to exist.

Constraints:

- The stack is fixed: Next.js 16 App Router, React 19, TypeScript, Tailwind 3. Tests run under Vitest and must stay cross-platform.
- The catalog is hard-coded in `lib/data.ts`, plus items generated in `lib/curriculum-catalog.ts`. Supabase `learning_items` is the intended replacement, so don't over-invest in restructuring the current shape.
- Dashboard data is mocked (`lib/services/dashboardService.ts` → `mocks/dashboard.ts`). The swap point is a real `/api/me/dashboard`.
- Progress, saved items and search analytics live in `localStorage` (keys prefixed `lace-`), not on a server. Treat them as device-local, losable and not authoritative.
- Admin and sync routes require the `x-admin-secret` header and fail closed.
- Real logins get the most-restricted advocate type until a real role mapping exists.

Terminology:

- **Binder** is a subject collection (Legal Skills, Housing…). A **tab** is one section of a binder.
- **Item** is anything filed under a tab. Its **kind** is course, module, lesson, practice, reference, resource, update or note.
- **Course** → **Module** → **Lesson** (a short "micro-module"). A **path** is a curated journey across courses.
- A **skill area** is a curriculum-map column and a Legal Skills tab.
- **Advocate types**: attorney, non-lawyer advocate, paralegal, faculty, admin.
- **UPL** is the unauthorized practice of law. Some content requires an acknowledgment before non-attorneys may access it.

Explicitly undecided product facts:

- Everything under **MassLegalServices** above.
- Who writes and reviews the hub's reference pages, and how often they get a currency review.
- Roles are modeled today as one user type per person. The intended model is one stable user record with **multiple role assignments over time and in parallel** (learner, supervisor, program manager, super-admin, instructor, report viewer), each scoped and dated. Not built.
- Whether the hub eventually embeds inside Brightspace (a navbar link, a widget, LTI) or stays a separate front door.
- Which Brightspace progress and completion data we can actually retrieve under our permissions.
- Whether the currently mocked manager, program and admin views become real product scope.

## Brand Commitments

- The hub is **its own sub-brand**. It is related to MLRI's existing identity but not governed by it.
- **"LACE" is a placeholder. The real organization or product name is to be announced.**
  - Don't build an identity around the LACE wordmark or treat it as a fixed brand.
  - Don't invent an expansion of the acronym. None is recorded anywhere, and none has been confirmed.
- No binding logo, palette or type commitments exist yet. The icon assets in `public/` are placeholders, like the name.
- The binder is the current visual direction (see DESIGN.md). It aims to reduce screen fatigue for advocates who may be tired, rushed, or coming from dense legal work.
- Voice constraint that does hold: the hub and its courses read as one product, so never name Brightspace to learners. Name MassLegalServices when the learner actually leaves for it.

## Evidence on Hand

- **Real curriculum structure**: `lib/curriculum-map.ts` is the actual planned curriculum, not mock data.
- **The pilot course is Legal Skills: Hearsay** (source in the sibling `brightspace-courses/Legal-Skills-Hearsay` repo). Design and build the Litigation binder around it first: its Trial tab, its reference pages, its notes, its law changes.
- **Genuinely built offerings** (a small set): Legal Skills: Hearsay (pilot), Welcome to the Learning Hub, Faculty Handbook: Interactive Elements, Curriculum Map, Eviction Defense: The First 48 Hours, and Brightspace Wrapper Demo.
- **Planning research**: `docs/planning/brightspace-learning-hub-plan.md` (including cited D2L documentation on Discover's limits), plus D2L and outsourced-IT question lists and a search-governance checklist.
- **Faculty-facing artifact**: `public/tools-handbook/faculty-showcase.dc.html`.

Absences that future work must not fabricate:

- No testimonials, quotes, learner stories, usage statistics, satisfaction scores or completion metrics exist.
- No named customers, partner organizations, funders or press.
- No real learner progress or enrollment data. Every dashboard number on screen today is mock.
- No confirmed launch date, learner count or program size.
- Most curriculum topics are **planned, not built**. Never present a planned offering as available.
- No reference pages or MLS records exist yet. Titles in the mockups are samples.

## Product Principles

1. **Answer the question in front of them.** The just-in-time case moment is the design target. Anything that serves browsing at its expense is a regression.
2. **One binder, many sources.** Advocates shouldn't need to know whether the answer is a course, a reference page or an MLS resource. File it in the right tab and say where it opens.
3. **Below the course line.** Modules, topics, lessons and single resources are the unit of value. Never let course containers become the only way in.
4. **What's available leads; what's planned waits quietly.** Show the plan honestly, as a calm roadmap. Never let planned topics take the space that available ones need.
5. **Keep it current, visibly.** Law changes sit next to the items they affect, and anyone can flag an item as out of date.
6. **Eligibility is part of discovery.** Role, jurisdiction and UPL boundaries shape what a person is shown. When something is off-limits, say so instead of leaving the space silently empty.
7. **Lower visual load.** The interface should feel calm after a long day of legal work. Colour only says which binder or tab something belongs to, or what state it's in.

## Accessibility & Inclusion

**WCAG 2.2 AA is a binding requirement.** Beyond 2.1 AA, that specifically means honoring target size (minimum), dragging movements having a single-pointer alternative, focus-not-obscured, consistent help placement, and redundant entry. Users include advocates working under time pressure on unpredictable hardware, so keyboard operability and legibility at real reading distances are not optional polish.
