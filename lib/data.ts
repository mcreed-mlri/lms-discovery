export type Level = "Foundations" | "Intermediate" | "Advanced";

export type Course = {
  id: string;
  title: string;
  description: string;
  level: Level;
  practiceArea: string;
  duration: string;
  brightspaceUrl: string;
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
};

export type Path = {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
  totalDuration: string;
  level: Level;
};

export type LearningItem =
  | (Course & { type: "COURSE" })
  | (Module & { type: "MODULE" })
  | (Path & { type: "PATH" });

export const courses: Course[] = [
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
    id: "professional-foundations",
    title: "Professional Foundations for Legal Aid",
    description:
      "Core legal aid habits for new advocates: ethics, client service, documentation, and sound judgment.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "1 hr 45 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/professional-foundations",
  },
  {
    id: "client-centered-practice",
    title: "Client-Centered Communication",
    description:
      "Interview, listen, and counsel in ways that build trust and surface the facts that matter.",
    level: "Foundations",
    practiceArea: "Client Services",
    duration: "1 hr 50 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/client-centered-practice",
  },
  {
    id: "first-steps-in-court",
    title: "Your First Steps in Court",
    description:
      "Prepare for the first hearing: procedure, courtroom conduct, and what your client needs to know.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "1 hr 55 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
  },
  {
    id: "eviction-defense-48h",
    title: "Eviction Defense: The First 48 Hours",
    description:
      "Five short topics for the first moments after a notice to quit: deadlines, defenses, service, and the first court ask.",
    level: "Foundations",
    practiceArea: "Housing",
    duration: "12 min",
    brightspaceUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "upl-boundaries-advocates",
    title: "UPL Boundaries for Advocates",
    description:
      "A practical guide to recognizing legal-advice boundaries, documenting next steps, and escalating to attorney supervision.",
    level: "Foundations",
    practiceArea: "Ethics",
    duration: "35 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/upl-boundaries-advocates",
  },
];

export const modules: Module[] = [
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

  // Professional Foundations modules
  {
    id: "ethics-and-confidentiality",
    title: "Ethics and Confidentiality in Legal Aid",
    description:
      "Apply core confidentiality, privilege, and conflict rules in everyday legal aid practice.",
    courseId: "professional-foundations",
    parentCourseTitle: "Professional Foundations for Legal Aid",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["ethics", "confidentiality", "professional conduct"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/professional-foundations",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/professional-foundations/viewContent/1001/View",
  },
  {
    id: "legal-aid-environment",
    title: "Working in a Legal Aid Environment",
    description:
      "Understand the legal aid mission, how cases are prioritized, and what that means for client service.",
    courseId: "professional-foundations",
    parentCourseTitle: "Professional Foundations for Legal Aid",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["legal aid", "organization", "mission"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/professional-foundations",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/professional-foundations/viewContent/1002/View",
  },
  {
    id: "case-notes-and-compliance",
    title: "Case Notes, Time Records, and Compliance",
    description:
      "Build simple habits for accurate notes, time records, and grant-reporting requirements.",
    courseId: "professional-foundations",
    parentCourseTitle: "Professional Foundations for Legal Aid",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["documentation", "compliance", "time records"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/professional-foundations",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/professional-foundations/viewContent/1003/View",
  },

  // Client-Centered Communication modules
  {
    id: "first-client-interview",
    title: "Conducting Your First Client Interview",
    description:
      "Open the conversation, gather key facts, identify urgency, and help the client feel heard.",
    contentStatus: "Updated",
    courseId: "client-centered-practice",
    parentCourseTitle: "Client-Centered Communication",
    practiceArea: "Client Services",
    level: "Foundations",
    tags: ["client intake", "interviewing", "fact gathering"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/client-centered-practice",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/client-centered-practice/viewContent/2001/View",
  },
  {
    id: "trauma-informed-communication",
    title: "Trauma-Informed Communication",
    description:
      "Use clear, respectful communication when sensitive facts or trauma may shape the conversation.",
    courseId: "client-centered-practice",
    parentCourseTitle: "Client-Centered Communication",
    practiceArea: "Client Services",
    level: "Foundations",
    tags: ["trauma-informed", "communication", "client services"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/client-centered-practice",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/client-centered-practice/viewContent/2002/View",
  },
  {
    id: "safety-screening",
    title: "Safety Screening and Crisis Recognition",
    description:
      "Spot safety risks early and know when to connect a client to immediate support.",
    contentStatus: "New",
    courseId: "client-centered-practice",
    parentCourseTitle: "Client-Centered Communication",
    practiceArea: "Client Services",
    level: "Foundations",
    tags: ["safety screening", "crisis", "domestic violence"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/client-centered-practice",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/client-centered-practice/viewContent/2003/View",
  },

  // First Steps in Court modules
  {
    id: "courtroom-roles-etiquette",
    title: "Courtroom Roles and Etiquette",
    description:
      "Know who does what, how to address the court, and how to move through the room professionally.",
    courseId: "first-steps-in-court",
    parentCourseTitle: "Your First Steps in Court",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["courtroom procedures", "etiquette", "professionalism"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/first-steps-in-court/viewContent/3001/View",
  },
  {
    id: "preparing-client-for-court",
    title: "Preparing Your Client for Court",
    description:
      "Help clients understand what to bring, what to expect, and how the hearing day may unfold.",
    courseId: "first-steps-in-court",
    parentCourseTitle: "Your First Steps in Court",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["client preparation", "hearings", "courtroom procedures"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/first-steps-in-court/viewContent/3002/View",
  },
  {
    id: "first-appearance-checklist",
    title: "The First Appearance Checklist",
    description:
      "Organize the file, confirm the facts, and prepare the first ask before the case is called.",
    contentStatus: "Updated",
    courseId: "first-steps-in-court",
    parentCourseTitle: "Your First Steps in Court",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["courtroom procedures", "first appearance", "preparation"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/first-steps-in-court/viewContent/3003/View",
  },
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
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
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
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
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
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
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
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
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
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/housing-court.html?ou=6703&d2l_body_type=3",
  },
  {
    id: "upl-scenarios",
    title: "UPL Scenarios for Frontline Advocates",
    description:
      "Work through common intake and follow-up moments where an advocate should document facts, share approved information, or escalate.",
    courseId: "upl-boundaries-advocates",
    parentCourseTitle: "UPL Boundaries for Advocates",
    practiceArea: "Ethics",
    level: "Foundations",
    tags: ["upl", "advocate boundaries", "supervision", "ethics"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/upl-boundaries-advocates",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/upl-boundaries-advocates/viewContent/5001/View",
  },
  {
    id: "when-to-escalate-attorney",
    title: "When to Escalate to an Attorney",
    description:
      "Use a simple decision framework for moving from advocate support to attorney review without delaying urgent client needs.",
    courseId: "upl-boundaries-advocates",
    parentCourseTitle: "UPL Boundaries for Advocates",
    practiceArea: "Ethics",
    level: "Foundations",
    tags: ["upl", "attorney review", "supervision", "client support"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/upl-boundaries-advocates",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/upl-boundaries-advocates/viewContent/5002/View",
  },
];

export const paths: Path[] = [
  {
    id: "new-attorney-foundations",
    title: "New Attorney Foundations",
    description:
      "A first-year path for the core moves of legal aid practice: ethics, communication, case records, and court readiness.",
    courseIds: ["professional-foundations", "client-centered-practice", "first-steps-in-court"],
    totalDuration: "5 hr 30 min total",
    level: "Foundations",
  },
  {
    id: "client-centered-communication-path",
    title: "Client-Centered Communication",
    description:
      "Build interviewing, listening, and counseling habits that make client conversations clearer.",
    courseIds: ["client-centered-practice"],
    totalDuration: "1 hr 50 min total",
    level: "Foundations",
  },
  {
    id: "courtroom-readiness",
    title: "Your First Steps in Court",
    description:
      "A short path for understanding court procedure, preparing clients, and showing up ready.",
    courseIds: ["first-steps-in-court"],
    totalDuration: "1 hr 55 min total",
    level: "Foundations",
  },
  {
    id: "advocate-upl-onboarding",
    title: "Advocate UPL Onboarding",
    description:
      "A short, safe starting path for non-lawyer advocates: professional boundaries, escalation, and client-centered support.",
    courseIds: ["upl-boundaries-advocates", "client-centered-practice"],
    totalDuration: "2 hr 25 min total",
    level: "Foundations",
  },
];

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
      "https://mlri.brightspace.com/content/enforced/6703-course.outline/notice-types.html?ou=6703&d2l_body_type=3",
  },
  { id: "wrapper-self-checks", type: "MODULE", title: "Self Checks", detail: "Brightspace Wrapper Demo", status: "In progress" },
  { id: "professional-foundations", type: "COURSE", title: "Professional Foundations for Legal Aid", detail: "Module 2 of 3", progress: 45 },
  { id: "first-client-interview", type: "MODULE", title: "Conducting Your First Client Interview", detail: "Client-Centered Communication", status: "In progress" },
  { id: "new-attorney-foundations", type: "PATH", title: "New Attorney Foundations", detail: "1 of 3 courses complete", progress: 33 },
];

// Learner progress for the home hero — training-hour goal + this-week activity.
// Demo values; replace with real progress data when available.
export type WeekDayActivity = "done" | "today" | "upcoming";

export const learnerProgress = {
  cleEarned: 8.5,
  cleRequired: 12,
  // Mon–Sun: completed a module, the current day, or still to come.
  weeklyActivity: ["done", "done", "done", "today", "upcoming", "upcoming", "upcoming"] as WeekDayActivity[],
};

export const popularTopics = ["Notice to Quit", "First Appearance", "Client Intake", "Confidentiality", "Safety Screening", "Court Preparation"];

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
  "ethics-and-confidentiality": { minutes: 14, skillId: "ethics" },
  "legal-aid-environment": { minutes: 10, skillId: "triage" },
  "case-notes-and-compliance": { minutes: 12, skillId: "drafting" },
  "first-client-interview": { minutes: 13, skillId: "interviewing" },
  "trauma-informed-communication": { minutes: 11, skillId: "counseling" },
  "safety-screening": { minutes: 9, skillId: "triage" },
  "courtroom-roles-etiquette": { minutes: 8, skillId: "courtroom" },
  "preparing-client-for-court": { minutes: 12, skillId: "counseling" },
  "first-appearance-checklist": { minutes: 10, skillId: "courtroom" },
  "clock-starts": { minutes: 2, skillId: "triage" },
  "notice-types": { minutes: 3, skillId: "research" },
  "service-of-process": { minutes: 3, skillId: "triage" },
  "drafting-answer": { minutes: 3, skillId: "drafting" },
  "walking-into-housing-court": { minutes: 1, skillId: "courtroom" },
  "upl-scenarios": { minutes: 18, skillId: "ethics" },
  "when-to-escalate-attorney": { minutes: 17, skillId: "ethics" },
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
  | "interview"
  | "draft"
  | "counsel"
  | "triage"
  | "negotiate"
  | "court"
  | "ethics"
  | "research";

export type Skill = {
  id: SkillId;
  name: string;
  glyph: SkillGlyphKind;
  blurb: string;
};

export const skills: Skill[] = [
  { id: "interviewing", name: "Client interviewing", glyph: "interview", blurb: "Start the conversation and gather the facts that matter." },
  { id: "drafting", name: "Drafting & writing", glyph: "draft", blurb: "Write notes, letters, and motions clearly and accurately." },
  { id: "counseling", name: "Client counseling", glyph: "counsel", blurb: "Explain options and help clients prepare for what is next." },
  { id: "triage", name: "Case triage", glyph: "triage", blurb: "Spot urgency, name the deadline, and choose the first step." },
  { id: "negotiation", name: "Negotiation", glyph: "negotiate", blurb: "Prepare for conversations with agencies and opposing counsel." },
  { id: "courtroom", name: "Courtroom skills", glyph: "court", blurb: "Understand procedure and walk into hearings ready." },
  { id: "ethics", name: "Ethical judgment", glyph: "ethics", blurb: "Handle confidentiality, conflicts, and daily judgment calls." },
  { id: "research", name: "Legal research", glyph: "research", blurb: "Find the rule, form, or authority you need quickly." },
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
  "professional-foundations": "Foundations",
  "client-centered-practice": "Client Communication",
  "first-steps-in-court": "Court Skills",
  "eviction-defense-48h": "Housing Court",
  "upl-boundaries-advocates": "UPL",
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
  { id: "housing", name: "Housing", query: "housing", count: Math.max(countModulesMatching("housing"), 5), hueIndex: 0 },
  { id: "benefits", name: "Public Benefits", query: "benefits", count: 6, hueIndex: 1 },
  { id: "family", name: "Family Law", query: "family", count: 4, hueIndex: 2 },
  { id: "ethics", name: "Ethics", query: "ethics", count: Math.max(countModulesMatching("ethics"), 3), hueIndex: 3 },
  { id: "skills", name: "Practice Skills", query: "court", count: Math.max(countModulesMatching("court"), 8), hueIndex: 4 },
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
    id: "u-first-appearance",
    title: "First Appearance Checklist updated for the 2026 call sequence",
    summary:
      "The checklist now walks through the new sequence and what to have ready before your case is called.",
    courseId: "first-steps-in-court",
    moduleId: "first-appearance-checklist",
    when: "2 days ago",
    severity: "high",
    tag: "Process changed",
  },
  {
    id: "u-safety-screening",
    title: "New module: Safety Screening and Crisis Recognition",
    summary:
      "A short framework for spotting safety risks during an intake call and choosing the next support step.",
    courseId: "client-centered-practice",
    moduleId: "safety-screening",
    when: "Yesterday",
    severity: "standard",
    tag: "New",
  },
  {
    id: "u-first-interview",
    title: "Conducting Your First Client Interview refreshed",
    summary:
      "Updated intake language gives advocates a clearer opening for the first five minutes of the call.",
    courseId: "client-centered-practice",
    moduleId: "first-client-interview",
    when: "4 days ago",
    severity: "standard",
    tag: "Updated",
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

export function getPathBrightspaceUrl(path: Path) {
  const firstCourse = courses.find((course) => course.id === path.courseIds[0]);
  return firstCourse?.brightspaceUrl ?? "https://brightspace.example.edu/d2l/home";
}

export function getModuleBrightspaceUrl(module: Module) {
  return module.brightspaceModuleUrl ?? module.moduleAnchorUrl ?? module.brightspaceCourseUrl;
}

export function getLearningItemUrl(item: LearningItem) {
  return "#content-coming-soon";
}
