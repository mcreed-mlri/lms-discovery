/**
 * Legal Skills: Hearsay prototype configuration.
 *
 * This package is a demo built from the reusable LACE course
 * template. It intentionally keeps the same static Brightspace architecture:
 * course-config.js is the single source of truth for outline, drawer,
 * breadcrumb, prev/next, and local progress.
 */

window.COURSE_CONFIG = {
  deployMode: "local",
  chromeMode: "hub",

  courseId: "legal-skills-hearsay",
  courseTitle: "Legal Skills: Hearsay",
  courseShortTitle: "Hearsay course",
  contentNote: "Prototype, not reviewed",
  courseSubtitle: "Recognizing and responding to hearsay objections, in writing and out loud.",
  courseBlurb:
    "Five short parts on hearsay objections, in writing and out loud. Read each part here, then practice it in the Learning Hub. Part 2 is ready now; the others are planned.",

  hubLabel: "Hub",
  courseArea: "Legal Skills",
  topic: "drafting",
  accent: "drafting",

  // The Learning Hub's address. Empty when the hub serves this package (its
  // links stay on the same site); set to the hub's full address, for example
  // "https://hub.mlri.org", when the package is hosted in Brightspace.
  hubBaseUrl: "",

  homeLinkText: "Back to Objections",
  homeLinkUrl: "/binder/litigation/trial-skills/objections/",

  // Where this course is filed in the hub, so the course shows the same
  // binder: its divider tabs on the right, and the hub's breadcrumb. Mirrors
  // lib/binder.ts in the hub; tests/course-binder.test.ts there checks it.
  binder: {
    name: "Litigation",
    colour: "#dc6a3c",
    currentTab: "trial-skills",
    tabs: [
      { id: "contents", label: "Contents", href: "/binder/litigation/" },
      { id: "pre-trial", label: "Case Prep", href: "/binder/litigation/pre-trial/" },
      { id: "trial-skills", label: "Trial", href: "/binder/litigation/trial-skills/" },
      { id: "post-trial", label: "Post-Trial", href: "/binder/litigation/post-trial/" },
      { id: "appellate", label: "Appeals", href: "/binder/litigation/appellate/" },
    ],
    crumbs: [
      { label: "Litigation", href: "/binder/litigation/" },
      { label: "Trial", href: "/binder/litigation/trial-skills/" },
      { label: "Objections", href: "/binder/litigation/trial-skills/objections/" },
    ],
  },

  beacon: {
    enabled: false,
    endpoint: "",
  },

  courseHomeUrl: "Home.html",
  completeUrl: "complete.html",

  modules: [
    {
      id: "hearsay-module",
      title: "Legal Skills: Hearsay",
      accent: "drafting",
      description: "Five parts on analyzing and responding to hearsay issues.",
      topics: [
        {
          slug: "objecting-hearsay-written-documents",
          title: "Objecting to hearsay in written documents",
          file: "objecting-hearsay-written-documents.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "Planned: making a clear written hearsay objection.",
          practice: {
            status: "coming",
            title: "Practice for objecting in writing",
            text: "Levels for this part are being written. Level 1, a written objection, is ready now.",
            href: "/binder/litigation/trial-skills/objections/hearsay/",
            linkText: "See the Hearsay levels",
          },
        },
        {
          slug: "defending-hearsay-objection-writing",
          title: "Defending against a hearsay objection in writing",
          file: "defending-hearsay-objection-writing.html",
          url: "#",
          kind: "Reading",
          minutes: 6,
          updated: "Prototype",
          description: "When a statement is hearsay, and the five steps of a written response.",
          practice: {
            title: "Hearsay, level 1: a written objection",
            href: "/binder/litigation/trial-skills/objections/hearsay/level-1/watch/",
            linkText: "Start level 1",
            steps: [
              { label: "Watch", text: "an expert answer it" },
              { label: "Help", text: "finish one the expert started" },
              { label: "Solo", text: "write the whole response" },
            ],
            note: "About 15 minutes. Plus a 2-minute drill: Hearsay or not?",
          },
        },
        {
          slug: "objecting-hearsay-oral-advocacy",
          title: "Objecting to hearsay during oral advocacy",
          file: "objecting-hearsay-oral-advocacy.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "Planned: concise, timely oral hearsay objections.",
          practice: {
            status: "coming",
            title: "Practice for objecting out loud",
            text: "Levels for this part are being written. Level 1, a written objection, is ready now.",
            href: "/binder/litigation/trial-skills/objections/hearsay/",
            linkText: "See the Hearsay levels",
          },
        },
        {
          slug: "defending-hearsay-oral-advocacy",
          title: "Defending against a hearsay objection during oral advocacy",
          file: "defending-hearsay-oral-advocacy.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "Planned: responding in the moment during argument or hearing.",
          practice: {
            status: "coming",
            title: "Practice for defending out loud",
            text: "Levels for this part are being written. Level 1, a written objection, is ready now.",
            href: "/binder/litigation/trial-skills/objections/hearsay/",
            linkText: "See the Hearsay levels",
          },
        },
        {
          slug: "strategic-external-hearsay-considerations",
          title: "Strategic and external considerations when objecting to hearsay",
          file: "strategic-external-hearsay-considerations.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "Planned: strategy, forum, record, client goals, and collateral risks.",
          practice: {
            status: "coming",
            title: "Practice for strategy",
            text: "Levels for this part are being written. Level 1, a written objection, is ready now.",
            href: "/binder/litigation/trial-skills/objections/hearsay/",
            linkText: "See the Hearsay levels",
          },
        },
      ],
    },
  ],
};

try {
  if (localStorage.getItem("lace_theme_" + (window.COURSE_CONFIG.courseId || "")) === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
} catch (e) {}
