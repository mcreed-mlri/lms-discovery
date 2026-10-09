/* The binders: subject collections an advocate opens, whose divider tabs are
   its sections. Legal Skills is the first and, for now, only binder; its tabs
   are the Legal Skills columns of the curriculum map, plus Contents (Home).

   Pure data, no "use client": the tab pages are server components and read it
   directly, and the client dividers import it the same way. See PRODUCT.md
   ("Information Architecture") and DESIGN.md ("Binder dividers"). */

import { curriculumMap, type CurriculumColumn } from "@/lib/curriculum-map";

export type BinderTab = {
  id: string;
  /** Short label set vertically on the divider. */
  label: string;
  /** Full name, used as the section's page title. */
  title: string;
  href: string;
};

export type Binder = {
  id: string;
  name: string;
  /** Contents, then one tab per section. */
  tabs: BinderTab[];
};

// Divider labels are short; the curriculum names are the page titles.
const shortLabels: Record<string, string> = {
  foundations: "Foundations",
  ethics: "Ethics",
  "pre-engagement": "Pre-Engagement",
  "legal-writing": "Writing",
  "legal-research": "Research",
  "pre-trial": "Pre-Trial",
  "trial-skills": "Trial",
  "post-trial": "Post-Trial",
  appellate: "Appellate",
  adr: "ADR",
  legislative: "Legislative",
  community: "Community",
};

function legalSkillsColumns(): CurriculumColumn[] {
  const branch = curriculumMap.branches.find((b) => b.id === "legal-skills");
  return branch && branch.type === "columns" ? branch.columns : [];
}

export const BINDER_ROOT = "/binder/legal-skills";

export const legalSkillsBinder: Binder = {
  id: "legal-skills",
  name: "Legal Skills",
  tabs: [
    { id: "contents", label: "Contents", title: "Contents", href: "/" },
    ...legalSkillsColumns().map((column) => ({
      id: column.id,
      label: shortLabels[column.id] ?? column.title,
      title: column.title,
      href: `${BINDER_ROOT}/${column.id}`,
    })),
  ],
};

/** Binders named in the switcher before they have content. Shown as coming,
 *  never as an empty shell to click into. */
export const comingBinders = ["Housing", "Family", "Immigration", "Education"] as const;

/** The section tabs only, without Contents. */
export function getSectionTabs(): BinderTab[] {
  return legalSkillsBinder.tabs.filter((tab) => tab.id !== "contents");
}

export function getSectionTab(id: string): BinderTab | undefined {
  return getSectionTabs().find((tab) => tab.id === id);
}

/** The divider that is open for a pathname. Contents is Home; anything outside
 *  the binder (My learning, Updates, the library) opens no divider. */
export function openTabId(pathname: string): string | null {
  if (pathname === "/") return "contents";
  const prefix = `${BINDER_ROOT}/`;
  if (!pathname.startsWith(prefix)) return null;
  const id = pathname.slice(prefix.length).split("/")[0];
  return getSectionTab(id) ? id : null;
}

/** Planned topics for a section, straight from the curriculum map. Sub-topics
 *  fold into their parent, so the count matches the map's topic count. */
export function getPlannedTopics(tabId: string): string[] {
  const column = legalSkillsColumns().find((c) => c.id === tabId);
  return column ? column.notes.filter((note) => note.level === "topic").map((n) => n.text) : [];
}

/** Built catalog items filed under each tab, by learning-item id. The Supabase
 *  `learning_items` table replaces this when items carry their own tab. */
export const filedItems: Record<string, string[]> = {
  "trial-skills": ["legal-skills-hearsay"],
};

export type PilotSkill = {
  title: string;
  /** Open in the hosted course package, or not built yet. */
  status: "open" | "coming";
  href?: string;
  minutes?: number;
};

const HEARSAY_ROOT = "/legal-skills-hearsay";

/** The Hearsay pilot's five subskills, mirroring its course-config.js. Only
 *  subskill 2 is built. */
export const hearsaySkills: PilotSkill[] = [
  { title: "Objecting to hearsay in written documents", status: "coming" },
  {
    title: "Defending against a hearsay objection in writing",
    status: "open",
    href: `${HEARSAY_ROOT}/defending-hearsay-objection-writing.html`,
    minutes: 12,
  },
  { title: "Objecting to hearsay during oral advocacy", status: "coming" },
  { title: "Defending against a hearsay objection during oral advocacy", status: "coming" },
  { title: "Strategic and external considerations", status: "coming" },
];

export const hearsayCourseHref = `${HEARSAY_ROOT}/Home.html`;
