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
    id: "courtroom-basics",
    title: "Court Procedure & Courtroom Basics",
    description:
      "A practical introduction to hearings, courtroom roles, etiquette, timelines, and client-centered preparation.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "2 hr 20 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/courtroom-basics",
  },
  {
    id: "housing-eviction-defense",
    title: "Housing & Eviction Defense",
    description:
      "Learn how to analyze notices, prepare defenses, support tenants, and navigate common housing court workflows.",
    level: "Intermediate",
    practiceArea: "Housing",
    duration: "3 hr 10 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/housing-eviction-defense",
  },
  {
    id: "client-intake",
    title: "Client Intake Essentials",
    description:
      "Build a reliable intake conversation, identify urgent issues, and document facts for legal aid teams.",
    level: "Foundations",
    practiceArea: "Client Services",
    duration: "1 hr 15 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/client-intake",
  },
  {
    id: "motions-practice",
    title: "Motions Practice for Legal Aid",
    description:
      "Draft, file, and argue common motions with examples from housing, benefits, and family law contexts.",
    level: "Intermediate",
    practiceArea: "Civil Practice",
    duration: "2 hr 45 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/motions-practice",
  },
  {
    id: "evidence-advocacy",
    title: "Evidence & Objections in Hearings",
    description:
      "A focused course on exhibits, foundations, hearsay, objections, and preserving the record.",
    level: "Advanced",
    practiceArea: "Litigation",
    duration: "2 hr",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/evidence-advocacy",
  },
];

export const modules: Module[] = [
  {
    id: "motion-dismiss",
    title: "Filing a Motion to Dismiss",
    description:
      "Use a short checklist to evaluate grounds, draft the filing, and prepare for argument.",
    courseId: "motions-practice",
    parentCourseTitle: "Motions Practice for Legal Aid",
    practiceArea: "Civil Practice",
    level: "Intermediate",
    tags: ["motions", "civil practice", "filing"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/motions-practice",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/motions-practice/viewContent/1001/View",
  },
  {
    id: "client-interview",
    title: "Client Interview Best Practices",
    description:
      "Trauma-informed interviewing techniques for gathering facts without overwhelming the client.",
    courseId: "client-intake",
    parentCourseTitle: "Client Intake Essentials",
    practiceArea: "Client Services",
    level: "Foundations",
    tags: ["client intake", "interviewing", "ethics"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/client-intake",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/client-intake/viewContent/1002/View",
  },
  {
    id: "notice-to-quit",
    title: "Reading a Notice to Quit",
    description:
      "Spot deadline issues, defective notices, and facts that may shape an eviction defense.",
    courseId: "housing-eviction-defense",
    parentCourseTitle: "Housing & Eviction Defense",
    practiceArea: "Housing",
    level: "Intermediate",
    tags: ["evictions", "housing", "notices"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/housing-eviction-defense",
    moduleAnchorUrl: "https://brightspace.example.edu/d2l/le/content/housing-eviction-defense/Home?itemIdentifier=notice-to-quit",
  },
  {
    id: "exhibit-foundation",
    title: "Laying a Foundation for Exhibits",
    description:
      "Practice the sequence of authentication questions for common documents and photos.",
    courseId: "evidence-advocacy",
    parentCourseTitle: "Evidence & Objections in Hearings",
    practiceArea: "Litigation",
    level: "Advanced",
    tags: ["evidence", "courtroom procedures", "hearings"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/evidence-advocacy",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/evidence-advocacy/viewContent/1004/View",
  },
  {
    id: "remote-hearings",
    title: "Preparing Clients for Remote Hearings",
    description:
      "Help clients understand technology, documents, expectations, and what to do when problems arise.",
    courseId: "courtroom-basics",
    parentCourseTitle: "Court Procedure & Courtroom Basics",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["courtroom procedures", "client preparation", "hearings"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/courtroom-basics",
  },
];

export const paths: Path[] = [
  {
    id: "new-attorney",
    title: "New Attorney Onboarding",
    description:
      "A guided first-year path from client intake through first hearing, with essential practice foundations.",
    courseIds: ["client-intake", "courtroom-basics", "motions-practice"],
    totalDuration: "6 hr total",
    level: "Foundations",
  },
  {
    id: "civil-litigation",
    title: "Civil Litigation Fundamentals",
    description:
      "Build practical litigation confidence through motions, evidence, procedure, and hearing preparation.",
    courseIds: ["courtroom-basics", "motions-practice", "evidence-advocacy"],
    totalDuration: "7 hr total",
    level: "Intermediate",
  },
  {
    id: "housing-defense",
    title: "Housing & Eviction Defense",
    description:
      "A focused path for representing tenants from intake through notices, negotiation, and court appearances.",
    courseIds: ["client-intake", "housing-eviction-defense", "courtroom-basics"],
    totalDuration: "6.5 hr total",
    level: "Intermediate",
  },
  {
    id: "advocacy-ready",
    title: "Hearing Advocacy Ready",
    description:
      "Sharpen courtroom procedure, objections, exhibits, and client preparation for contested hearings.",
    courseIds: ["courtroom-basics", "evidence-advocacy"],
    totalDuration: "4 hr total",
    level: "Advanced",
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
    }
  | {
      id: string;
      type: "MODULE";
      title: string;
      detail: string;
      status: LearningStatus;
    };

export const continueLearning: ContinueLearningItem[] = [
  { id: "courtroom-basics", type: "COURSE", title: "Court Procedure & Courtroom Basics", detail: "Mock course progress", progress: 60 },
  { id: "motion-dismiss", type: "MODULE", title: "Filing a Motion to Dismiss", detail: "Prototype module status", status: "In progress" },
  { id: "civil-litigation", type: "PATH", title: "Civil Litigation Fundamentals", detail: "4 of 6 completed", progress: 68 },
];

export const popularTopics = ["Evictions", "Client Intake", "Motions", "Courtroom Procedures"];

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
  if (item.type === "PATH") return getPathBrightspaceUrl(item);
  if (item.type === "MODULE") return getModuleBrightspaceUrl(item);
  return item.brightspaceUrl;
}
