# Questions For D2L

Use these questions to confirm whether the MLRI Learning Hub can sit in front of Brightspace as a lightweight discovery layer.

## Current Vendor Response Status - 2026-05-31

D2L is working to bring in an implementation specialist for the API-specific items below. The following pieces are confirmed enough to act on:

- The Brightspace test site has not launched yet.
- D2L recommends launching the test site now for API testing before syncing from the live catalog.
- For the vanity URL, MLRI must send D2L the desired URL; D2L will submit an internal request and provide DNS records.
- SSL Option 1: D2L manages the SSL certificate and renewal for the non-Brightspace subdomain through AWS Certificate Manager. MLRI IT adds a D2L-provided validation DNS record.
- SSL Option 2: MLRI can provide an existing valid wildcard certificate and private key to D2L, but MLRI owns renewal cost, timing, and replacement.

Recommended reply: ask D2L to launch the Brightspace test instance, provide the desired vanity URL once selected, and prefer D2L-managed SSL unless MLRI IT requires the wildcard-certificate path.

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

## API Specialist Follow-Up

- What custom Brightspace role should a Service User use for read-only course/catalog metadata and content structure?
- Does the Service User need enrollment in every Course Offering it syncs, or can it inherit access from Department, Training Area, or top-level Org assignment?
- If Client Credentials/server-to-server OAuth is recommended, what are the exact HTTPS JWKS URL and JWT client assertion requirements for MLRI's instance?
- Are the spike versions LP `1.49` and LE `1.82` appropriate for Org Unit metadata and Content ToC calls in MLRI's instance?
- Which scopes should production use for read-only catalog and content-structure sync? Should `core:*:*` remain temporary testing-only while production uses narrower resource-group scopes?
- Do other D2L clients use APIs for external catalogs, frontend companion apps, or custom discovery layers, and are there general lessons learned for support boundaries?

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
