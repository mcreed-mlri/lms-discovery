/**
 * Legal Skills: Hearsay prototype configuration.
 *
 * This package is a stakeholder demo built from the reusable LACE course
 * template. It intentionally keeps the same static Brightspace architecture:
 * course-config.js is the single source of truth for outline, drawer,
 * breadcrumb, prev/next, and local progress.
 */

window.COURSE_CONFIG = {
  deployMode: "local",
  chromeMode: "bar",

  courseId: "legal-skills-hearsay",
  courseTitle: "Legal Skills: Hearsay",
  courseSubtitle: "Practice recognizing and responding to hearsay objections in written advocacy.",
  courseBlurb:
    "A polished prototype for a five-subskill hearsay module. Subskill 2 is fully interactive; the remaining subskills are shown as planned demo structure.",

  hubLabel: "Hub",
  courseArea: "Legal Skills",
  topic: "drafting",
  accent: "drafting",

  homeLinkText: "Exit to Hub",
  homeLinkUrl: "/",

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
      description: "Five subskills for analyzing and responding to hearsay issues.",
      topics: [
        {
          slug: "objecting-hearsay-written-documents",
          title: "Objecting to hearsay in written documents",
          file: "objecting-hearsay-written-documents.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "A future subskill on making a clear written hearsay objection.",
        },
        {
          slug: "defending-hearsay-objection-writing",
          title: "Defending against a hearsay objection in writing",
          file: "defending-hearsay-objection-writing.html",
          url: "#",
          kind: "Practice",
          minutes: 12,
          updated: "Prototype",
          description: "Recognize possible exclusions and exceptions, then draft a focused written response.",
        },
        {
          slug: "objecting-hearsay-oral-advocacy",
          title: "Objecting to hearsay during oral advocacy",
          file: "objecting-hearsay-oral-advocacy.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "A future subskill on concise, timely oral hearsay objections.",
        },
        {
          slug: "defending-hearsay-oral-advocacy",
          title: "Defending against a hearsay objection during oral advocacy",
          file: "defending-hearsay-oral-advocacy.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "A future subskill on responding in the moment during argument or hearing.",
        },
        {
          slug: "strategic-external-hearsay-considerations",
          title: "Strategic and external considerations when objecting to hearsay",
          file: "strategic-external-hearsay-considerations.html",
          url: "#",
          kind: "Planned",
          minutes: 2,
          updated: "Planned",
          description: "A future subskill on strategy, forum, record, client goals, and collateral risks.",
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
