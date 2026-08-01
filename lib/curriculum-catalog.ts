/* Generates the catalog from the bundled curriculum map.

   The Learning Hub catalog is the real curriculum plan, not a set of mock
   courses. A handful of genuinely-built offerings live in lib/data.ts; the rest
   is generated here from lib/curriculum-map.ts so we can envision the full
   offering as if it were built out. Generated items carry
   `availability: "planned"` for provenance, but the UI presents them the same
   as built ones (they open their own Learning Hub page).

   Mapping (Legal Skills branch only for now — Substantive Law is left out until
   its areas have topics):
     · Skill Area (column) → Course       (e.g. "Legal Research")
     · Topic note          → Module       (e.g. "Primary & Secondary Sources")
     · Sub-topic note      → lesson        (a short "micro-module" inside a module)
     · Learning Paths       → curated journeys across courses (see plannedPaths)

   Each skill-area course + its modules share a colour (hueIndex). Substantive
   Law is skipped; its built course (eviction-defense-48h) stays in lib/data.ts. */

import { curriculumMap, type CurriculumColumn } from "@/lib/curriculum-map";
import type { Course, Level, Module, Path, SkillId } from "@/lib/data";

// Skill-area column → editorial level, so the generated catalog reads as a real
// progression rather than everything landing on "Foundations".
const columnLevel: Record<string, Level> = {
  foundations: "Foundations",
  ethics: "Foundations",
  "pre-engagement": "Foundations",
  "legal-writing": "Intermediate",
  "legal-research": "Intermediate",
  "pre-trial": "Intermediate",
  "trial-skills": "Advanced",
  "post-trial": "Advanced",
  appellate: "Advanced",
  adr: "Advanced",
  legislative: "Advanced",
  community: "Advanced",
};

// Skill-area column → the skill lens its modules practice, so the homepage
// skills tiles stay coherent (otherwise every planned module would fall back to
// "research"). See getModuleSkillId in lib/data.ts.
const columnSkill: Record<string, SkillId> = {
  foundations: "ethics",
  ethics: "ethics",
  "pre-engagement": "triage",
  "legal-writing": "drafting",
  "legal-research": "research",
  "pre-trial": "interviewing",
  "trial-skills": "courtroom",
  "post-trial": "courtroom",
  appellate: "research",
  adr: "negotiation",
  legislative: "negotiation",
  community: "counseling",
};

export const plannedCourses: Course[] = [];
export const plannedModules: Module[] = [];
// Minutes + skill for each planned module, merged into moduleMeta in lib/data.ts.
export const plannedModuleMeta: Record<string, { minutes: number; skillId: SkillId }> = {};

function generateColumn(column: CurriculumColumn, hueIndex: number) {
  const level = columnLevel[column.id] ?? "Foundations";
  const skillId = columnSkill[column.id] ?? "research";
  const courseId = `course-${column.id}`;

  // Skill Area → Course.
  plannedCourses.push({
    id: courseId,
    title: column.title,
    description: `The ${column.title} track in the LACE curriculum — the topics an advocate works through in this area.`,
    level,
    practiceArea: column.title,
    duration: "Self-paced",
    brightspaceUrl: "/curriculum-map",
    availability: "planned",
    hueIndex,
  });

  // Topic → Module; the sub-topics that follow it → that module's lessons.
  let currentModule: Module | null = null;
  for (const note of column.notes) {
    if (note.level === "topic") {
      currentModule = {
        id: `module-${note.id}`,
        title: note.text,
        description: `Part of ${column.title}.`,
        courseId,
        parentCourseTitle: column.title,
        practiceArea: column.title,
        level,
        tags: [],
        brightspaceCourseUrl: "/curriculum-map",
        availability: "planned",
        hueIndex,
        lessons: [],
        ...(note.tag === "tentative" ? { plannedTag: "tentative" as const } : {}),
      };
      plannedModules.push(currentModule);
      plannedModuleMeta[currentModule.id] = { minutes: 10, skillId };
    } else if (currentModule) {
      currentModule.lessons = [...(currentModule.lessons ?? []), note.text];
    }
  }
}

const legalSkills = curriculumMap.branches.find((branch) => branch.id === "legal-skills");
if (legalSkills && legalSkills.type === "columns") {
  legalSkills.columns.forEach((column, index) => generateColumn(column, index));
}

// Curated learning journeys across the skill-area courses. Drafted as starting
// points for the vision — edit freely as the real curriculum firms up.
export const plannedPaths: Path[] = [
  {
    id: "path-new-advocate-foundations",
    title: "Foundations for New Advocates",
    description:
      "Start here: the habits, ethics, intake basics, and writing skills every new legal aid advocate needs.",
    courseIds: [
      "course-foundations",
      "course-ethics",
      "course-pre-engagement",
      "course-legal-writing",
    ],
    totalDuration: "Self-paced",
    level: "Foundations",
    availability: "planned",
  },
  {
    id: "path-research-and-case-building",
    title: "Research & Case Building",
    description:
      "Investigate the facts, find the law, interview the client, and build the theory of a case.",
    courseIds: ["course-legal-research", "course-pre-trial"],
    totalDuration: "Self-paced",
    level: "Intermediate",
    availability: "planned",
  },
  {
    id: "path-trial-readiness",
    title: "Trial Readiness",
    description: "From pleadings through verdict and appeal — the litigation arc, end to end.",
    courseIds: ["course-trial-skills", "course-post-trial", "course-appellate"],
    totalDuration: "Self-paced",
    level: "Advanced",
    availability: "planned",
  },
  {
    id: "path-beyond-the-courtroom",
    title: "Beyond the Courtroom",
    description:
      "Resolve disputes and change systems: negotiation and ADR, legislative advocacy, and community lawyering.",
    courseIds: ["course-adr", "course-legislative", "course-community"],
    totalDuration: "Self-paced",
    level: "Advanced",
    availability: "planned",
  },
];
