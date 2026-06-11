# Brightspace Learning Hub Plan

## Purpose

MLRI wants a modern learning discovery experience where users can quickly find the right training, module, resource, or learning path. Brightspace should remain the LMS system of record, but its native discovery tools appear too course-centered for the experience we want.

The recommended approach is a hybrid model:

- Brightspace handles course delivery, enrollments, permissions, progress, completions, and official learner records.
- The MLRI Learning Hub handles discovery, search, browsing, curated pathways, and user-friendly navigation into Brightspace.

## Why Not Brightspace Discover Alone?

Brightspace Discover lets learners search active, self-enrollable courses by title and description, then enroll in those courses. It can support sections such as New, Updated, Featured, and All, but it is still primarily a course-discovery feature.

Source: [D2L: About Discover](https://community.d2l.com/brightspace/kb/articles/4309-about-discover)

D2L also notes that Discover does not support multiple course catalogs, prerequisites/co-requisites, seat limits, waitlists, enrollment windows, sections or groups self-enrollment, role selection during self-enrollment, SIS integration, or bulk self-enrollment setup.

Source: [D2L: Search for courses and self-enroll using Discover](https://community.d2l.com/brightspace/kb/articles/2902-search-for-courses-and-self-enroll-using-discover)

## Target Architecture

```text
[User]
   |
   v
[MLRI Learning Hub]
Discovery, search, pathways, recommendations, browsing
   |
   v
[Discovery Metadata Layer]
Tags, practice areas, learner types, curated paths, search index
   |
   v
[Brightspace APIs / Integration Links]
Course metadata, content structure, enrollments, progress where available
   |
   v
[Brightspace LMS]
Courses, modules, users, enrollments, activities, completions, records
```

## Responsibilities

| Need                          | Owner        | Notes                                                             |
| ----------------------------- | ------------ | ----------------------------------------------------------------- |
| Course hosting                | Brightspace  | Brightspace remains the official LMS.                             |
| Users, roles, and permissions | Brightspace  | Avoid duplicating identity or access logic.                       |
| Enrollments                   | Brightspace  | Learning Hub can link to enrollment or launch flows.              |
| Progress and completions      | Brightspace  | Pull into the hub only where API access allows.                   |
| Course and module discovery   | Learning Hub | Search should include courses, modules, topics, and paths.        |
| Curated pathways              | Learning Hub | Paths can group Brightspace content in a user-friendly way.       |
| Tags and practice areas       | Learning Hub | MLRI-specific metadata likely belongs outside Brightspace.        |
| Recommendations               | Learning Hub | Start simple with curated recommendations before personalization. |

## Role-Aware Dashboard Model

The dashboard should be designed around roles and permissions, not fixed user types. A person may be a learner today, become a supervisor later, or hold more than one role at the same time. For example, a supervisor may have lawyers assigned to them while also being enrolled in learning themselves.

The first role set should account for:

- **Learners**: see their own courses, progress, deadlines, notices, feedback, certificates, and next recommended actions.
- **Supervisors**: see progress and risk signals for the lawyers or learners assigned to them, while retaining access to their own learning view if they are also enrolled.
- **Super-admins**: the training unit leadership group with full program insight across enrollment, progress, completion, engagement, course performance, supervisor coverage, alerts, exports, and admin controls.
- **Program or cohort managers**: optional future role for people managing specific programs, cohorts, offices, practice areas, or reporting slices without needing full super-admin access.
- **Instructors or content managers**: optional future role for people responsible for course facilitation, content updates, or learning materials.
- **Report viewers or observers**: optional future role for leadership or stakeholders who need read-only reporting access.

The data model should keep a stable user record and attach role assignments over time instead of overwriting a single user type. A future user-role assignment could include:

```text
user_id
role
scope_type        program, team, cohort, course, practice_area, or global
scope_id
start_date
end_date
status
```

This allows a learner to transition into a supervisor without losing learner history, certificates, cohort participation, or audit context. It also allows one person to see multiple dashboard lenses such as **My Learning**, **My Team**, and **Program Admin** when their permissions allow it.

May 21 D2L planning note: Brightspace manager reporting is optional and depends on manager-role setup. A learner cannot have two direct managers, so the hub should not assume many-to-many direct manager relationships unless MLRI owns that logic outside Brightspace.

The dashboard should therefore use:

- A shared shell for navigation, profile, notifications, search, and account controls.
- Role-aware landing views such as Learner Home, Supervisor Overview, Program Overview, and Super-admin Overview.
- Shared underlying objects such as users, courses, cohorts, assignments, progress, completions, alerts, and reports.
- Permission-gated views that use the same data but limit scope and available actions by role assignment.

## Brightspace Data We May Use

Before relying on reporting automation, MLRI needs a clean User Attributes and Learning Groups plan. Attributes can drive automatic Learning Groups, due dates, enrollment/routing, and reporting, but the current planning constraint is a maximum of 10 User Attributes. Some groups may need to remain manually controlled.

Brightspace developer documentation suggests this companion model is feasible:

- Course information can be retrieved through the Courses API.
  Source: [Brightspace Courses API](https://docs.valence.desire2learn.com/res/course.html)
- Course content structures include modules and topics.
  Source: [Brightspace Content API](https://docs.valence.desire2learn.com/res/content.html)
- Enrollment information can be retrieved for users and org units, subject to permissions.
  Source: [Brightspace Enrollments API](https://docs.valence.desire2learn.com/res/enroll.html)
- Brightspace supports UI integration patterns such as links, widgets, navigation extensions, and LTI.
  Source: [Integrating with the Brightspace UI](https://docs.valence.desire2learn.com/basic/ui-ext.html)

## Phased Plan

### Phase 1: Thin Discovery Layer

Build a lightweight hub that does not depend on deep Brightspace automation yet.

- Maintain a local content index of courses, modules, tags, practice areas, levels, and pathways.
- Link each result to the relevant Brightspace course or module.
- Support search, filters, and curated learning paths.
- Use this phase to validate the user experience with real learners.

### Phase 2: Brightspace Metadata Sync

Connect to Brightspace APIs once access, permissions, and data quality are confirmed.

- Pull course metadata from Brightspace.
- Pull module/topic structures where useful.
- Keep MLRI-specific tags and pathway metadata in the hub.
- Establish a sync process and ownership model.

### Phase 3: Personalized Learning Signals

Add user-specific features only after the basic model works.

- Show enrolled courses.
- Show continue-learning entry points.
- Surface progress and completion data where Brightspace permissions allow.
- Add recommendations based on practice area, role, learning path, or recent activity.

### Phase 4: Deeper Integration

Evaluate whether the hub should be embedded inside Brightspace or remain a separate front door.

- Add Brightspace navbar links or homepage widgets.
- Evaluate LTI launch if single sign-on and embedded experiences are needed.
- Confirm support boundaries with D2L before relying on deeper integrations.

## Risks And Mitigations

| Risk                                       | Mitigation                                                                                                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom layer becomes too complex           | Keep the first version thin: discovery, metadata, and links only.                                                                                                                              |
| Brightspace API permissions are limited    | Validate API access early with a technical discovery session.                                                                                                                                  |
| Metadata gets stale                        | Define one owner and a simple update workflow.                                                                                                                                                 |
| Attributes or groups are defined casually  | Freeze the minimum User Attributes and Learning Groups before using them for automation or reports.                                                                                            |
| Video completion is overstated             | Treat page visits/time-on-page as weak signals; use H5P, check-in questions, quizzes, reflections, completion conditions, or a mark-complete step when completion must mean more than visited. |
| D2L support will not cover custom behavior | Treat the hub as MLRI-owned and keep Brightspace responsibilities clear.                                                                                                                       |
| Team capacity is limited                   | Start with a maintainable MVP before adding personalization.                                                                                                                                   |
| Users get confused between systems         | Use clear language: the hub helps find content; Brightspace delivers it.                                                                                                                       |

## Questions For Brightspace / D2L

- Can our instance expose course metadata through the Brightspace Courses API?
- Can we retrieve module and topic structures through the Content API?
- Can we retrieve a user's enrollments and progress data for a "continue learning" view?
- What authentication pattern does D2L recommend for a companion app?
- Can we link users directly into a specific course module or topic?
- What are the support boundaries for a custom discovery layer?
- Would D2L recommend navbar links, widgets, LTI, or a separate portal for this use case?
- Are there rate limits or permission constraints we should design around?

## Decision Summary

This should be framed as a learning discovery layer, not a replacement for Brightspace.

Brightspace remains responsible for the official LMS functions: courses, users, enrollments, progress, completions, and records. The MLRI Learning Hub solves the user experience gap: helping people search, browse, understand, and navigate learning content faster than Brightspace Discover can support on its own.
