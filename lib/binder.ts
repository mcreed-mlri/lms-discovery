/* The binders: subject collections an advocate opens, whose divider tabs are
   its sections. Legal Skills is split into three binders, each grouping
   curriculum-map columns along the life of a case, so every binder's dividers
   fit a laptop screen. Each column stays exactly one tab; the curriculum map
   is still the source of truth for topics.

   Pure data, no "use client": the binder pages are server components and read
   it directly, and the client dividers import it the same way. See PRODUCT.md
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
  /** One line under the name in the switcher and on the Contents page. */
  blurb: string;
  href: string;
  /** Contents, then one tab per section. */
  tabs: BinderTab[];
};

export const BINDER_ROOT = "/binder";

// Divider labels are short; the curriculum names are the page titles.
const shortLabels: Record<string, string> = {
  foundations: "Foundations",
  ethics: "Ethics",
  "pre-engagement": "Intake",
  "legal-research": "Research",
  "legal-writing": "Writing",
  "pre-trial": "Case Prep",
  "trial-skills": "Trial",
  "post-trial": "Post-Trial",
  appellate: "Appeals",
  adr: "ADR",
  legislative: "Legislative",
  community: "Community",
};

const binderPlan: { id: string; name: string; blurb: string; columns: string[] }[] = [
  {
    id: "practice-foundations",
    name: "Practice Foundations",
    blurb: "What every legal aid lawyer uses on every case.",
    columns: ["foundations", "ethics", "pre-engagement", "legal-research", "legal-writing"],
  },
  {
    id: "litigation",
    name: "Litigation",
    blurb: "A case from the first interview to appeal.",
    columns: ["pre-trial", "trial-skills", "post-trial", "appellate"],
  },
  {
    id: "beyond-the-courtroom",
    name: "Beyond the Courtroom",
    blurb: "Advocacy that doesn’t run through a court.",
    columns: ["adr", "legislative", "community"],
  },
];

function legalSkillsColumns(): CurriculumColumn[] {
  const branch = curriculumMap.branches.find((b) => b.id === "legal-skills");
  return branch && branch.type === "columns" ? branch.columns : [];
}

export const binders: Binder[] = binderPlan.map((plan) => {
  const href = `${BINDER_ROOT}/${plan.id}`;
  const columns = legalSkillsColumns();
  return {
    id: plan.id,
    name: plan.name,
    blurb: plan.blurb,
    href,
    tabs: [
      { id: "contents", label: "Contents", title: "Contents", href },
      ...plan.columns
        .map((id) => columns.find((c) => c.id === id))
        .filter((c): c is CurriculumColumn => c !== undefined)
        .map((column) => ({
          id: column.id,
          label: shortLabels[column.id] ?? column.title,
          title: column.title,
          href: `${href}/${column.id}`,
        })),
    ],
  };
});

/** The binder the pilot lives in, opened by default before the visitor picks one. */
export const DEFAULT_BINDER_ID = "litigation";

/** Substantive-law binders named in the switcher before they have content.
 *  Shown as coming, never as an empty shell to click into. */
export const comingBinders = ["Housing", "Family", "Immigration", "Education"] as const;

export function getBinder(id: string): Binder | undefined {
  return binders.find((binder) => binder.id === id);
}

export function getDefaultBinder(): Binder {
  return getBinder(DEFAULT_BINDER_ID) ?? binders[0];
}

/** A binder's section tabs, without Contents. */
export function getSectionTabs(binder: Binder): BinderTab[] {
  return binder.tabs.filter((tab) => tab.id !== "contents");
}

export function getSectionTab(binder: Binder, tabId: string): BinderTab | undefined {
  return getSectionTabs(binder).find((tab) => tab.id === tabId);
}

/** Which binder and divider a pathname opens. Anything outside /binder (Home,
 *  My learning, Updates, the library) opens neither. */
export function locateInBinder(pathname: string): { binder: Binder; tabId: string } | null {
  const prefix = `${BINDER_ROOT}/`;
  if (!pathname.startsWith(prefix)) return null;
  const [binderId, tabId] = pathname.slice(prefix.length).split("/");
  const binder = getBinder(binderId);
  if (!binder) return null;
  if (!tabId) return { binder, tabId: "contents" };
  return getSectionTab(binder, tabId) ? { binder, tabId } : null;
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

/** The binder and tab a built item is filed under, if any. */
export function findFiling(itemId: string): { binder: Binder; tab: BinderTab } | undefined {
  for (const binder of binders) {
    const tab = getSectionTabs(binder).find((t) => filedItems[t.id]?.includes(itemId));
    if (tab) return { binder, tab };
  }
  return undefined;
}

export type ReferencePage = {
  title: string;
  /** Kind and source, shown under the title. */
  meta: string;
  href: string;
};

/** Short reference an advocate keeps open at counsel table, filed by tab. The
 *  Hearsay course's own panels open directly through their #anchors. */
export const referencePages: Record<string, ReferencePage[]> = {
  "trial-skills": [
    {
      title: "Hearsay: key concepts",
      meta: "Reference · from Legal Skills: Hearsay",
      href: "/legal-skills-hearsay/defending-hearsay-objection-writing.html#key-concepts",
    },
    {
      title: "Procedure: answering a hearsay objection in writing",
      meta: "Five steps and a drafting frame · from Legal Skills: Hearsay",
      href: "/legal-skills-hearsay/defending-hearsay-objection-writing.html#procedure",
    },
  ],
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
