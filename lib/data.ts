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
    id: "using-interactive-elements",
    title: "Using Interactive Elements in Brightspace",
    description:
      "Demo course for LACE wrappers - accordions, tabs, callouts, and interactive checks.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "~2 hr",
    brightspaceUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
  },
  {
    id: "brightspace-wrapper-demo",
    title: "Brightspace Wrapper Demo",
    description:
      "A short demo course for reviewing LACE wrapper behavior before handing learners into Brightspace.",
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
      "Understand your ethical obligations, the legal aid mission, and the professional standards that shape your daily practice as a new attorney.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "1 hr 45 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/professional-foundations",
  },
  {
    id: "client-centered-practice",
    title: "Client-Centered Communication",
    description:
      "Develop the interviewing, listening, and counseling skills that build trust and surface the full picture of a client's legal situation.",
    level: "Foundations",
    practiceArea: "Client Services",
    duration: "1 hr 50 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/client-centered-practice",
  },
  {
    id: "first-steps-in-court",
    title: "Your First Steps in Court",
    description:
      "A practical guide to showing up prepared — understanding court procedure, interacting professionally, and getting your client ready for their hearing.",
    level: "Foundations",
    practiceArea: "All Practice Areas",
    duration: "1 hr 55 min",
    brightspaceUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
  },
];

export const modules: Module[] = [
  // Brightspace Wrapper Demo modules
  {
    id: "wrapper-static-layouts",
    title: "Static Layouts",
    description:
      "Preview static wrapper patterns for accordions, tabs, callouts, and stylized quotes inside Brightspace.",
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
      "Review interactive checks such as sorting galleries, sequencing, flip cards, and fill-in-the-blank prompts.",
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
      "Mock upcoming media examples for image hotspots and integrated video inside the Brightspace wrapper.",
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

  // Brightspace Interactive Elements modules
  {
    id: "interactive-accordion",
    title: "Accordion",
    description:
      "Use accordions to reveal supporting content in small, scannable sections without overwhelming the learner.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["accordion", "interactive elements", "static layouts", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#accordion",
  },
  {
    id: "interactive-tabs",
    title: "Tabs",
    description:
      "Compare related ideas in a compact tabbed layout that keeps learners oriented inside one Brightspace topic.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["tabs", "interactive elements", "static layouts", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#tabs",
  },
  {
    id: "interactive-callouts",
    title: "Callouts",
    description:
      "Create visual emphasis for cautions, practice tips, definitions, and reminders using consistent callout styles.",
    contentStatus: "Updated",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["callouts", "interactive elements", "static layouts", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#callouts",
  },
  {
    id: "interactive-stylized-quotes",
    title: "Stylized Quotes",
    description:
      "Highlight quoted material with accessible styling that draws attention without breaking reading flow.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["quotes", "interactive elements", "static layouts", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#stylized-quotes",
  },
  {
    id: "interactive-sorting-gallery",
    title: "Sorting Gallery",
    description:
      "Let learners classify examples into categories and receive lightweight feedback as they practice.",
    contentStatus: "New",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["sorting", "gallery", "self checks", "interactive elements"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#sorting-gallery",
  },
  {
    id: "interactive-sequencing",
    title: "Sequencing",
    description:
      "Ask learners to place steps in the correct order before moving into a practical application.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["sequencing", "self checks", "interactive elements", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#sequencing",
  },
  {
    id: "interactive-flip-cards",
    title: "Flip Cards",
    description:
      "Use flip cards for vocabulary, concept checks, and quick reveal moments that keep the page compact.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["flip cards", "self checks", "interactive elements", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#flip-cards",
  },
  {
    id: "interactive-fill-in-the-blanks",
    title: "Fill in the Blanks",
    description:
      "Prompt learners to recall key terms or decisions inside a short formative check.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["fill in the blanks", "self checks", "interactive elements", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#fill-in-the-blanks",
  },
  {
    id: "interactive-image-hotspots",
    title: "Image Hotspots",
    description:
      "Preview an upcoming media interaction where learners explore annotated areas of a single image.",
    courseId: "using-interactive-elements",
    parentCourseTitle: "Using Interactive Elements in Brightspace",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["image hotspots", "insert media", "interactive elements", "brightspace"],
    brightspaceCourseUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3",
    brightspaceModuleUrl:
      "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Brightspace%20Interactive%20Elements.html?ou=6698&d2l_body_type=3#image-hotspots",
  },
  // Professional Foundations modules
  {
    id: "ethics-and-confidentiality",
    title: "Ethics and Confidentiality in Legal Aid",
    description:
      "Cover the core rules of professional conduct, attorney-client privilege, and how to navigate conflicts of interest in a high-volume practice.",
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
      "Learn how legal aid organizations are structured, how cases are prioritized, and what the mission means for how you serve clients every day.",
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
      "Build habits around accurate time tracking, case documentation standards, and grant-reporting requirements from your very first week.",
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
      "Structure an intake conversation to gather facts efficiently, identify urgent legal issues, and help the client feel heard.",
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
      "Recognize signs of trauma, adjust your communication style, and avoid re-traumatization when working through sensitive facts with clients.",
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
      "Identify domestic violence, housing instability, and other safety risks early, and connect clients to the right resources before problems escalate.",
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
      "Learn who does what in a courtroom, how to address the bench, interact with clerks, and carry yourself professionally as a new advocate.",
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
      "Walk through what clients need to know before a hearing — what to wear, what to bring, what to expect, and how to manage anxiety on the day.",
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
      "Use a step-by-step framework to organize your file, confirm the facts, and know exactly what to say when the judge calls your case for the first time.",
    contentStatus: "Updated",
    courseId: "first-steps-in-court",
    parentCourseTitle: "Your First Steps in Court",
    practiceArea: "All Practice Areas",
    level: "Foundations",
    tags: ["courtroom procedures", "first appearance", "preparation"],
    brightspaceCourseUrl: "https://brightspace.example.edu/d2l/home/first-steps-in-court",
    brightspaceModuleUrl: "https://brightspace.example.edu/d2l/le/content/first-steps-in-court/viewContent/3003/View",
  },
];

export const paths: Path[] = [
  {
    id: "new-attorney-foundations",
    title: "New Attorney Foundations",
    description:
      "A structured first-year path covering the core skills every new legal aid attorney needs — from ethics and client communication to your first day in court.",
    courseIds: ["professional-foundations", "client-centered-practice", "first-steps-in-court"],
    totalDuration: "5 hr 30 min total",
    level: "Foundations",
  },
  {
    id: "client-centered-communication-path",
    title: "Client-Centered Communication",
    description:
      "Develop the interviewing, listening, and counseling skills that build trust and surface the full picture of a client's legal needs.",
    courseIds: ["client-centered-practice"],
    totalDuration: "1 hr 50 min total",
    level: "Foundations",
  },
  {
    id: "courtroom-readiness",
    title: "Your First Steps in Court",
    description:
      "A practical guide to showing up prepared - understanding court procedure, interacting professionally, and getting started with confidence.",
    courseIds: ["first-steps-in-court"],
    totalDuration: "1 hr 55 min total",
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
    }
  | {
      id: string;
      type: "MODULE";
      title: string;
      detail: string;
      status: LearningStatus;
    };

export const continueLearning: ContinueLearningItem[] = [
  { id: "using-interactive-elements", type: "COURSE", title: "Using Interactive Elements in Brightspace", detail: "5 of 9 modules complete", progress: 56 },
  { id: "interactive-stylized-quotes", type: "MODULE", title: "Stylized Quotes", detail: "Using Interactive Elements in Brightspace", status: "In progress" },
  { id: "professional-foundations", type: "COURSE", title: "Professional Foundations for Legal Aid", detail: "Module 2 of 3", progress: 45 },
  { id: "first-client-interview", type: "MODULE", title: "Conducting Your First Client Interview", detail: "Client-Centered Communication", status: "In progress" },
  { id: "new-attorney-foundations", type: "PATH", title: "New Attorney Foundations", detail: "1 of 3 courses complete", progress: 33 },
];

export const popularTopics = ["Interactive Elements", "Brightspace Wrappers", "Ethics & Confidentiality", "Client Interviews", "Courtroom Etiquette", "Trauma-Informed Practice"];

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
