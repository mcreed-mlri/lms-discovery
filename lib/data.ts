import {
  plannedCourses,
  plannedModuleMeta,
  plannedModules,
  plannedPaths,
} from "@/lib/curriculum-catalog";

export type Level = "Foundations" | "Intermediate" | "Advanced";

// Whether an offering is live today ("available", the default) or planned as
// the curriculum is built out ("planned"). Planned items come from the
// curriculum map (lib/curriculum-catalog.ts); they're browsable but route back
// to the map rather than into Brightspace.
export type Availability = "available" | "planned";

export type Course = {
  id: string;
  title: string;
  description: string;
  level: Level;
  practiceArea: string;
  duration: string;
  brightspaceUrl: string;
  availability?: Availability;
  plannedTag?: "tentative";
  /** Skill-area colour index (into the 8-hue palette) shared by a path and all
   *  its courses/modules. Set on curriculum-generated items; absent on built
   *  ones (which fall back to their topic-family colour). */
  hueIndex?: number;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  contentStatus?: "New" | "Updated";
  courseId: string;
  parentCourseTitle: string;
  practiceArea: string;
  level: Level;
  tags: string[];
  brightspaceCourseUrl: string;
  brightspaceModuleUrl?: string;
  moduleAnchorUrl?: string;
  availability?: Availability;
  plannedTag?: "tentative";
  hueIndex?: number;
  /** Short lessons ("micro-modules") inside a module — the curriculum map's
   *  sub-topics. Shown in the module's detail, not as separate catalog cards. */
  lessons?: string[];
};

export type Path = {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
  totalDuration: string;
  level: Level;
  availability?: Availability;
  plannedTag?: "tentative";
  hueIndex?: number;
};

export type LearningItem =
  (Course & { type: "COURSE" }) | (Module & { type: "MODULE" }) | (Path & { type: "PATH" });

const builtCourses: Course[] = [
  {
    id: "welcome-to-lace",
    title: "Welcome to the Learning Hub",
    description:
      "A simple onboarding course that helps new learners find assigned courses, choose Read or Practice mode, understand completion, and get help.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "10 min",
    brightspaceUrl:
      "https://mlri.brightspace.com/content/enforced/6706-demo.onboarding_mc/Home.html?ou=6706&d2l_body_type=3",
  },
  {
    id: "brightspace-wrapper-demo",
    title: "Brightspace Wrapper Demo",
    description:
      "A quick review space for Brightspace wrapper patterns before they reach learners.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "~2 hr",
    brightspaceUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
  },
  {
    id: "faculty-handbook",
    title: "Faculty Handbook: Interactive Elements",
    description:
      "A faculty-facing guide for choosing interactive elements, writing handoff notes, and preparing course content for the LACE builder.",
    level: "Foundations",
    practiceArea: "Faculty Support",
    duration: "15 min",
    brightspaceUrl: "/tools-handbook/faculty-showcase.dc.html",
  },
  {
    id: "curriculum-map",
    title: "Curriculum Map",
    description:
      "How the LACE curriculum is organized across Legal Skills and Substantive Law. Browse where your content fits; built topics link straight to their course.",
    level: "Foundations",
    practiceArea: "Faculty Support",
    duration: "Browse",
    brightspaceUrl: "/curriculum-map",
  },
  {
    id: "eviction-defense-48h",
    title: "Eviction Defense: The First 48 Hours",
    description:
      "Five short topics for the first moments after a notice to quit: deadlines, defenses, service, and the first court ask.",
    level: "Foundations",
    practiceArea: "Housing",
    duration: "12 min",
    brightspaceUrl: "https://mlri.brightspace.com/d2l/home/6703",
  },
];

const builtModules: Module[] = [
  // Brightspace Wrapper Demo modules
  {
    id: "wrapper-static-layouts",
    title: "Static Layouts",
    description:
      "Preview wrapper patterns for accordions, tabs, callouts, and quotes inside Brightspace.",
    courseId: "brightspace-wrapper-demo",
    parentCourseTitle: "Brightspace Wrapper Demo",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["brightspace wrapper", "static layouts", "accordion", "tabs", "callouts"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#static-layouts",
  },
  {
    id: "wrapper-self-checks",
    title: "Self Checks",
    description:
      "Review interactive checks like sequencing, flip cards, sorting, and fill-in-the-blank prompts.",
    courseId: "brightspace-wrapper-demo",
    parentCourseTitle: "Brightspace Wrapper Demo",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["brightspace wrapper", "self checks", "sequencing", "flip cards"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Sequencing.html?ou=6698&d2l_body_type=3&ou=6698",
  },
  {
    id: "wrapper-insert-media",
    title: "Insert Media",
    description:
      "Review upcoming patterns for image hotspots and integrated video inside the Brightspace wrapper.",
    courseId: "brightspace-wrapper-demo",
    parentCourseTitle: "Brightspace Wrapper Demo",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["brightspace wrapper", "insert media", "image hotspots", "video"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#insert-media",
  },

  // Eviction Defense: The First 48 Hours modules
  {
    id: "clock-starts",
    title: "When the Clock Starts",
    description:
      "Read the notice dates, identify the first deadline, and name what has to happen next.",
    courseId: "eviction-defense-48h",
    parentCourseTitle: "Eviction Defense: The First 48 Hours",
    practiceArea: "Housing",
    level: "Foundations",
    tags: ["housing", "eviction defense", "notice to quit", "deadlines"],
    brightspaceCourseUrl: "https://mlri.brightspace.com/d2l/home/6703",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/clock-starts.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "notice-types",
    title: "The Four Notice Types",
    description:
      "Compare 14-day, 30-day, no-fault, and cause notices, and name what the landlord must prove.",
    courseId: "eviction-defense-48h",
    parentCourseTitle: "Eviction Defense: The First 48 Hours",
    practiceArea: "Housing",
    level: "Foundations",
    tags: ["housing", "eviction defense", "notice types", "notice to quit"],
    brightspaceCourseUrl: "https://mlri.brightspace.com/d2l/home/6703",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/notice-types.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "service-of-process",
    title: "Service of Process Checklist",
    description:
      "Check how the notice arrived and whether service problems affect the case strategy.",
    courseId: "eviction-defense-48h",
    parentCourseTitle: "Eviction Defense: The First 48 Hours",
    practiceArea: "Housing",
    level: "Foundations",
    tags: ["housing", "eviction defense", "service of process", "checklist"],
    brightspaceCourseUrl: "https://mlri.brightspace.com/d2l/home/6703",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/topic-template.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "drafting-answer",
    title: "Drafting the Answer",
    description:
      "Draft the first response with defenses, procedural asks, and motion language in view.",
    contentStatus: "New",
    courseId: "eviction-defense-48h",
    parentCourseTitle: "Eviction Defense: The First 48 Hours",
    practiceArea: "Housing",
    level: "Foundations",
    tags: ["housing", "eviction defense", "drafting", "answer", "motions"],
    brightspaceCourseUrl: "https://mlri.brightspace.com/d2l/home/6703",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/drafting-answer.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "walking-into-housing-court",
    title: "Walking into Housing Court",
    description:
      "Prepare the next ask, the strongest issue, and the client goal before the case is called.",
    courseId: "eviction-defense-48h",
    parentCourseTitle: "Eviction Defense: The First 48 Hours",
    practiceArea: "Housing",
    level: "Foundations",
    tags: ["housing", "eviction defense", "housing court", "client goals"],
    brightspaceCourseUrl: "https://mlri.brightspace.com/d2l/home/6703",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/housing-court.html?ou=6703&d2l_body_type=3",
  },
];

const builtPaths: Path[] = [
  {
    id: "faculty-starter",
    title: "Faculty & Content Creator Starter",
    description:
      "Where your content fits, how to build it, and what a finished course looks like: the curriculum map, the faculty handbook, and a sample course.",
    courseIds: ["curriculum-map", "faculty-handbook", "welcome-to-lace"],
    totalDuration: "~30 min",
    level: "Foundations",
  },
];

// The catalog = the handful of built offerings above + everything generated
// from the curriculum map (Legal Skills). This is the seam a future
// Supabase-backed catalog can replace.
export const courses: Course[] = [...builtCourses, ...plannedCourses];
export const modules: Module[] = [...builtModules, ...plannedModules];
export const paths: Path[] = [...plannedPaths, ...builtPaths]; // curated journeys, then faculty-starter

// Skill areas for the left rail — the Legal Skills curriculum areas (each is a
// course), coloured by the same hue as their course/module cards. Derived from
// the generated courses so the rail stays in sync with the curriculum map.
export type SkillArea = {
  id: string;
  name: string;
  hueIndex: number;
  count: number;
  href: string;
};

export const skillAreas: SkillArea[] = plannedCourses.map((course) => ({
  id: course.id,
  name: course.title,
  hueIndex: course.hueIndex ?? 0,
  count: modules.filter((module) => module.courseId === course.id).length,
  href: `/learn/${course.id}`,
}));

export type LearningStatus = "Not started" | "In progress" | "Completed";

export type ContinueLearningItem =
  | {
      id: string;
      type: "COURSE" | "PATH";
      title: string;
      detail: string;
      progress: number;
      progressLabel?: string;
      resumeUrl?: string;
    }
  | {
      id: string;
      type: "MODULE";
      title: string;
      detail: string;
      status: LearningStatus;
    };

export const continueLearning: ContinueLearningItem[] = [
  {
    id: "eviction-defense-48h",
    type: "COURSE",
    title: "Eviction Defense: The First 48 Hours",
    detail: "The Four Notice Types",
    progress: 40,
    progressLabel: "2/5",
    resumeUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "wrapper-self-checks",
    type: "MODULE",
    title: "Self Checks",
    detail: "Brightspace Wrapper Demo",
    status: "In progress",
  },
];

// Learner progress for the home hero — training-hour goal + this-week activity.
// Demo values; replace with real progress data when available.
export type WeekDayActivity = "done" | "today" | "upcoming";

export const learnerProgress = {
  cleEarned: 8.5,
  cleRequired: 12,
  // Mon–Sun: completed a module, the current day, or still to come.
  weeklyActivity: [
    "done",
    "done",
    "done",
    "today",
    "upcoming",
    "upcoming",
    "upcoming",
  ] as WeekDayActivity[],
};

export const popularTopics = [
  "Notice to Quit",
  "First Appearance",
  "Client Intake",
  "Confidentiality",
  "Safety Screening",
  "Court Preparation",
];

// Quick searches surfaced under the command bar — the things a busy advocate
// reaches for most. Short, scannable, thumb-friendly on mobile.
export const quickSearches = [
  "notice to quit",
  "first appearance",
  "client intake",
  "confidentiality",
  "safety screening",
  "court preparation",
];

// ── Microlearning metadata ────────────────────────────────────────────────
// Estimated minutes + the legal skill each module practices. Keyed by module
// id so the catalog above stays declarative and easy to scan.
const moduleMeta: Record<string, { minutes: number; skillId: SkillId }> = {
  "wrapper-static-layouts": { minutes: 9, skillId: "research" },
  "wrapper-self-checks": { minutes: 11, skillId: "research" },
  "wrapper-insert-media": { minutes: 7, skillId: "research" },
  "clock-starts": { minutes: 2, skillId: "triage" },
  "notice-types": { minutes: 3, skillId: "research" },
  "service-of-process": { minutes: 3, skillId: "triage" },
  "drafting-answer": { minutes: 3, skillId: "drafting" },
  "walking-into-housing-court": { minutes: 1, skillId: "courtroom" },
  // Planned modules from the curriculum map carry their skill lens so the
  // homepage skills tiles stay coherent (see lib/curriculum-catalog.ts).
  ...plannedModuleMeta,
};

export function getModuleMinutes(moduleId: string): number {
  return moduleMeta[moduleId]?.minutes ?? 10;
}

export function getModuleSkillId(moduleId: string): SkillId {
  return moduleMeta[moduleId]?.skillId ?? "research";
}

// ── Skills — the primary lens ─────────────────────────────────────────────
// Legal practice as verbs: what an advocate actually does. Substantive
// courses are the secondary lens (see practiceAreaChips below).
export type SkillId =
  | "interviewing"
  | "drafting"
  | "counseling"
  | "triage"
  | "negotiation"
  | "courtroom"
  | "ethics"
  | "research";

export type SkillGlyphKind =
  "interview" | "draft" | "counsel" | "triage" | "negotiate" | "court" | "ethics" | "research";

export type Skill = {
  id: SkillId;
  name: string;
  glyph: SkillGlyphKind;
  blurb: string;
};

export const skills: Skill[] = [
  {
    id: "interviewing",
    name: "Client interviewing",
    glyph: "interview",
    blurb: "Start the conversation and gather the facts that matter.",
  },
  {
    id: "drafting",
    name: "Drafting & writing",
    glyph: "draft",
    blurb: "Write notes, letters, and motions clearly and accurately.",
  },
  {
    id: "counseling",
    name: "Client counseling",
    glyph: "counsel",
    blurb: "Explain options and help clients prepare for what is next.",
  },
  {
    id: "triage",
    name: "Case triage",
    glyph: "triage",
    blurb: "Spot urgency, name the deadline, and choose the first step.",
  },
  {
    id: "negotiation",
    name: "Negotiation",
    glyph: "negotiate",
    blurb: "Prepare for conversations with agencies and opposing counsel.",
  },
  {
    id: "courtroom",
    name: "Courtroom skills",
    glyph: "court",
    blurb: "Understand procedure and walk into hearings ready.",
  },
  {
    id: "ethics",
    name: "Ethical judgment",
    glyph: "ethics",
    blurb: "Handle confidentiality, conflicts, and daily judgment calls.",
  },
  {
    id: "research",
    name: "Legal research",
    glyph: "research",
    blurb: "Find the rule, form, or authority you need quickly.",
  },
];

export function getSkill(skillId: string): Skill | undefined {
  return skills.find((skill) => skill.id === skillId);
}

export function getSkillModuleCount(skillId: SkillId): number {
  return modules.filter((module) => getModuleSkillId(module.id) === skillId).length;
}

// ── Practice-area chips — the secondary lens ──────────────────────────────
// Substantive courses, demoted to a quick filter strip beneath the skills.
export type PracticeAreaChip = {
  courseId: string;
  name: string;
  moduleCount: number;
};

const courseChipLabels: Record<string, string> = {
  "brightspace-wrapper-demo": "Wrapper Demo",
  "faculty-handbook": "Faculty Handbook",
  "eviction-defense-48h": "Housing Court",
};

export const practiceAreaChips: PracticeAreaChip[] = courses.map((course) => ({
  courseId: course.id,
  name: courseChipLabels[course.id] ?? course.title,
  moduleCount: modules.filter((module) => module.courseId === course.id).length,
}));

// ── Practice areas — the rail's substantive-law lens ──────────────────────
// Skills are the primary lens; practice areas are the always-visible secondary
// list in the left rail. This is a representative sample ("a little of
// everything") — some areas map onto real catalog content today (Housing,
// Ethics), others are placeholders for content still being developed. Each row
// seeds a catalog search via `query`; `hueIndex` picks its swatch colour from
// the 8-hue palette (lib/skill-hue.ts).
export type PracticeArea = {
  id: string;
  name: string;
  /** Search term used to filter the catalog when the row is clicked. */
  query: string;
  /** Module count shown beside the row (representative where content is thin). */
  count: number;
  /** Index into the skill-hue palette for the swatch colour. */
  hueIndex: number;
};

// Real catalog matches per area, by keyword across title / area / tags. Used to
// keep the counts honest where content exists.
function countModulesMatching(term: string): number {
  const q = term.toLowerCase();
  return modules.filter(
    (m) =>
      m.practiceArea.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q)),
  ).length;
}

export const practiceAreas: PracticeArea[] = [
  {
    id: "housing",
    name: "Housing",
    query: "housing",
    count: Math.max(countModulesMatching("housing"), 5),
    hueIndex: 0,
  },
  { id: "benefits", name: "Public Benefits", query: "benefits", count: 6, hueIndex: 1 },
  { id: "family", name: "Family Law", query: "family", count: 4, hueIndex: 2 },
  {
    id: "ethics",
    name: "Ethics",
    query: "ethics",
    count: Math.max(countModulesMatching("ethics"), 3),
    hueIndex: 3,
  },
  {
    id: "skills",
    name: "Practice Skills",
    query: "court",
    count: Math.max(countModulesMatching("court"), 8),
    hueIndex: 4,
  },
  { id: "immigration", name: "Immigration", query: "immigration", count: 3, hueIndex: 5 },
];

export function getPracticeArea(id: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.id === id);
}

// ── Content updates — "the law moved" ─────────────────────────────────────
// Why this exists: legal aid attorneys are often reviewing something an hour
// before court. Surfacing what changed — and when — is the homepage's job.
export type ContentUpdate = {
  id: string;
  title: string;
  summary: string;
  courseId: string;
  moduleId: string;
  when: string;
  severity: "high" | "standard";
  tag: string;
};

export const contentUpdates: ContentUpdate[] = [
  {
    id: "u-drafting-answer",
    title: "The Answer deadline changed under c.239 §5",
    summary:
      "Drafting the Answer now reflects the updated response window and the defenses to preserve before the first court date.",
    courseId: "eviction-defense-48h",
    moduleId: "drafting-answer",
    when: "2 days ago",
    severity: "high",
    tag: "Law changed",
  },
  {
    id: "u-notice-types",
    title: "Notice types refreshed for 2026 summary process",
    summary:
      "The Four Notice Types now walks through what the landlord must prove for each notice before you build the defense.",
    courseId: "eviction-defense-48h",
    moduleId: "notice-types",
    when: "Yesterday",
    severity: "standard",
    tag: "Updated",
  },
  {
    id: "u-walking-into-court",
    title: "New module: Walking into Housing Court",
    summary:
      "A short prep for the first ask, the strongest issue, and the client goal before your case is called.",
    courseId: "eviction-defense-48h",
    moduleId: "walking-into-housing-court",
    when: "4 days ago",
    severity: "standard",
    tag: "New",
  },
];

export const modulesUpdatedThisWeek = modules.filter((module) => module.contentStatus).length;

export function getLearningItems(): LearningItem[] {
  return [
    ...paths.map((path) => ({ ...path, type: "PATH" as const })),
    ...courses.map((course) => ({ ...course, type: "COURSE" as const })),
    ...modules.map((module) => ({ ...module, type: "MODULE" as const })),
  ];
}

export function getLearningItemById(id: string): LearningItem | undefined {
  return getLearningItems().find((item) => item.id === id);
}

export function getPathBrightspaceUrl(path: Path) {
  const firstCourse = courses.find((course) => course.id === path.courseIds[0]);
  return firstCourse?.brightspaceUrl ?? "https://brightspace.example.edu/d2l/home";
}

export function getModuleBrightspaceUrl(module: Module) {
  return module.brightspaceModuleUrl ?? module.moduleAnchorUrl ?? module.brightspaceCourseUrl;
}

export function getLearningItemUrl(item: LearningItem) {
  if (item.type === "COURSE" && item.id === "welcome-to-lace") {
    return item.brightspaceUrl;
  }

  if (item.type === "COURSE" && item.id === "faculty-handbook") {
    return item.brightspaceUrl;
  }

  if (item.type === "COURSE" && item.id === "curriculum-map") {
    return "/curriculum-map";
  }

  if (item.type === "MODULE" && item.courseId === "eviction-defense-48h") {
    return getModuleBrightspaceUrl(item);
  }

  return `/learn/${item.id}`;
}

export function getContinueLearningUrl(
  resumeItem: ContinueLearningItem,
  allItems: LearningItem[] = getLearningItems(),
) {
  if ("resumeUrl" in resumeItem && resumeItem.resumeUrl) {
    return resumeItem.resumeUrl;
  }

  const learningItem = allItems.find((item) => item.id === resumeItem.id);
  return learningItem ? getLearningItemUrl(learningItem) : "/";
}

const dashboardCourseLearningItemIds: Record<string, string> = {
  "6698": "wrapper-self-checks",
  "6703": "eviction-defense-48h",
};

export function getLearningUrlForDashboardCourse(course: {
  offeringId?: string;
  title: string;
  resumeUrl?: string;
}) {
  const mappedId = course.offeringId
    ? dashboardCourseLearningItemIds[course.offeringId]
    : undefined;
  const mappedItem = mappedId ? getLearningItemById(mappedId) : undefined;
  if (mappedItem) return getLearningItemUrl(mappedItem);

  const titleMatch = getLearningItems().find((item) => item.title === course.title);
  if (titleMatch) return getLearningItemUrl(titleMatch);

  return course.resumeUrl ?? "/";
}
