import type { LearningItem, Path } from "@/lib/data";

// A presentation choice, not an access-control rule. Keep other paths available
// to direct links while demonstrating one consistent journey in discovery.
export const featuredLearningPath = {
  id: "intake-to-verdict",
  title: "Legal Skills for New Attorneys",
  description:
    "A suggested sequence for building practical skills, from foundations through trial.",
  courseIds: [
    "course-foundations",
    "course-ethics",
    "course-pre-engagement",
    "course-legal-writing",
    "course-legal-research",
    "course-pre-trial",
    "course-trial-skills",
    "course-post-trial",
    "course-appellate",
  ],
  totalDuration: "Self-paced",
  level: "Foundations",
} satisfies Path;

export const featuredLearningPathUrl = "/browse/paths/intake-to-verdict";
export const learningPathExplanation =
  "Follow a suggested sequence, or go directly to the skill you need.";

export function isDemoDiscoverable(item: LearningItem): boolean {
  return item.type !== "PATH" || item.id === featuredLearningPath.id;
}
