# Questions For D2L

Use these questions to confirm whether the MLRI Learning Hub can sit in front of Brightspace as a lightweight discovery layer.

## Discovery And Architecture

- We are not trying to replace Brightspace. We want Brightspace to remain the LMS system of record while a custom Learning Hub improves discovery, search, pathways, and navigation. Is this architecture compatible with D2L's recommended integration patterns?
- Would D2L recommend this experience live as a separate portal, a Brightspace navbar link, a homepage widget, an LTI tool, or another integration pattern?
- Are there examples of other Brightspace customers using an external learning hub, LXP, custom catalog, or discovery layer in front of Brightspace?
- What parts of this approach would D2L consider supported, and what parts would be MLRI-owned custom behavior?

## Deep Linking

- Can we create stable learner-facing links directly to a specific Brightspace course module?
- Can we create stable learner-facing links directly to a specific Brightspace content topic, lesson, quiz, assignment, discussion, or activity?
- If we link directly to a topic or activity, will Brightspace still enforce enrollment, role permissions, release conditions, date restrictions, hidden/locked status, and completion tracking?
- Does the recommended link format differ between Classic Content and the newer Brightspace content experience?
- Are topic-level links more reliable than module-level links?
- Can the Brightspace Content API return the learner-facing URL we should use for each module or topic?
- If direct module/topic links are not recommended, what is the best fallback: course home, content table of contents, Quicklink, or another route?

## API Access

- Can our Brightspace instance expose course metadata through the Courses API?
- Can we retrieve course content structures, including modules and topics, through the Content API?
- Can we retrieve title, description, parent module, activity type, hidden/locked status, and learner-facing URL for each topic?
- Can we retrieve a user's enrollments for a "my learning" or "continue learning" view?
- Can we retrieve progress or completion data for courses, modules, or topics?
- What OAuth scopes and role permissions would be required for these API calls?
- Are there API rate limits, paging constraints, or performance concerns we should design around?

## Authentication And User Experience

- What authentication pattern does D2L recommend for a companion app like this?
- Can users move from the Learning Hub into Brightspace without signing in again?
- Can we use the same user identity across the hub and Brightspace so progress and enrollment data match reliably?
- Are there constraints around embedding the Learning Hub inside Brightspace versus linking out to it?

## Metadata And Content Management

- Where does D2L recommend storing custom metadata such as practice area, learner type, skill level, tags, and curated learning path membership?
- Can Brightspace store enough metadata for discovery, or should MLRI keep that metadata in the custom hub?
- If courses or modules change in Brightspace, how can the hub detect those updates?
- Is there a recommended way to sync Brightspace course/module data into an external search index?

## Reporting And Tracking

- Can Brightspace reporting distinguish between users who launch content from the Learning Hub and users who navigate there directly inside Brightspace?
- Can we report across multiple courses for a curated pathway?
- Can Brightspace track "done once, done everywhere" if the same content appears in multiple courses, or would that need to be custom logic?
- What data can be exported through Brightspace Data Hub or APIs for cross-course analytics?

## Implementation Risk

- What would D2L see as the biggest technical risks with this approach?
- Which parts should we validate first in a proof of concept?
- What is the smallest safe version D2L would recommend building first?
- Are there any licensing, security, privacy, or support implications we should understand before proceeding?

## Sources To Reference

- [D2L: About Discover](https://community.d2l.com/brightspace/kb/articles/4309-about-discover)
- [D2L: Search for courses and self-enroll using Discover](https://community.d2l.com/brightspace/kb/articles/2902-search-for-courses-and-self-enroll-using-discover)
- [Brightspace Courses API](https://docs.valence.desire2learn.com/res/course.html)
- [Brightspace Content API](https://docs.valence.desire2learn.com/res/content.html)
- [Brightspace Enrollments API](https://docs.valence.desire2learn.com/res/enroll.html)
- [Integrating with the Brightspace UI](https://docs.valence.desire2learn.com/basic/ui-ext.html)
