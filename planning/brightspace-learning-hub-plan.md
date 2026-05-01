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

| Need | Owner | Notes |
| --- | --- | --- |
| Course hosting | Brightspace | Brightspace remains the official LMS. |
| Users, roles, and permissions | Brightspace | Avoid duplicating identity or access logic. |
| Enrollments | Brightspace | Learning Hub can link to enrollment or launch flows. |
| Progress and completions | Brightspace | Pull into the hub only where API access allows. |
| Course and module discovery | Learning Hub | Search should include courses, modules, topics, and paths. |
| Curated pathways | Learning Hub | Paths can group Brightspace content in a user-friendly way. |
| Tags and practice areas | Learning Hub | MLRI-specific metadata likely belongs outside Brightspace. |
| Recommendations | Learning Hub | Start simple with curated recommendations before personalization. |

## Brightspace Data We May Use

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

| Risk | Mitigation |
| --- | --- |
| Custom layer becomes too complex | Keep the first version thin: discovery, metadata, and links only. |
| Brightspace API permissions are limited | Validate API access early with a technical discovery session. |
| Metadata gets stale | Define one owner and a simple update workflow. |
| D2L support will not cover custom behavior | Treat the hub as MLRI-owned and keep Brightspace responsibilities clear. |
| Team capacity is limited | Start with a maintainable MVP before adding personalization. |
| Users get confused between systems | Use clear language: the hub helps find content; Brightspace delivers it. |

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
