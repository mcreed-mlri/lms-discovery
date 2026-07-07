import type { Course, Module, SkillId } from "@/lib/data";

/* ============================================================================
   Topic + status colour system
   ----------------------------------------------------------------------------
   Two independent colour languages, both backed by CSS variables defined in
   app/globals.css:

     · Topic colours  — orientation. Which course family is this? Used on small
                        accents only: card rails, eyebrows, pills, icons, dots.
     · Status colours — lifecycle / progress. New, Updated, In progress, etc.
                        Always paired with a text label so meaning never rests
                        on colour alone.

   Class strings are written out in full (no interpolation) so Tailwind's
   content scanner keeps them.
   ========================================================================= */

// ── Topic families ─────────────────────────────────────────────────────────
export type TopicFamily =
  | "court"
  | "client"
  | "ethics"
  | "research"
  | "drafting"
  | "trauma"
  | "foundations"
  | "neutral";

export type TopicTheme = {
  family: TopicFamily;
  label: string;
  /** Thin top/side accent bar via a `before:` pseudo-element. */
  rail: string;
  /** Neutral card border — cards stay calm; topic shows through accents. */
  border: string;
  /** Hover border picks up the topic colour as an orientation cue. */
  hoverBorder: string;
  /** Small saturated dot / square. */
  dot: string;
  /** Category pill: neutral edge, soft topic fill, topic-ink text. */
  chip: string;
  /** Eyebrow / small-label text colour. */
  eyebrow: string;
  /** Icon container: soft topic fill + topic-ink glyph. */
  iconWrap: string;
  /** Progress bar fill when the progress belongs to this topic. */
  progress: string;
  /** Raw CSS value for SVG strokes (ProgressRing). */
  ring: string;
};

const topicThemes: Record<TopicFamily, TopicTheme> = {
  court: {
    family: "court",
    label: "Court Skills",
    rail: "before:bg-[color:var(--topic-court)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-court)]",
    dot: "bg-[color:var(--topic-court)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-court-soft)] text-[color:var(--topic-court-ink)]",
    eyebrow: "text-[color:var(--topic-court-ink)]",
    iconWrap: "bg-[color:var(--topic-court-soft)] text-[color:var(--topic-court-ink)]",
    progress: "bg-[color:var(--topic-court)]",
    ring: "var(--topic-court)",
  },
  client: {
    family: "client",
    label: "Client Communication",
    rail: "before:bg-[color:var(--topic-client)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-client)]",
    dot: "bg-[color:var(--topic-client)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-client-soft)] text-[color:var(--topic-client-ink)]",
    eyebrow: "text-[color:var(--topic-client-ink)]",
    iconWrap: "bg-[color:var(--topic-client-soft)] text-[color:var(--topic-client-ink)]",
    progress: "bg-[color:var(--topic-client)]",
    ring: "var(--topic-client)",
  },
  ethics: {
    family: "ethics",
    label: "Ethics & Confidentiality",
    rail: "before:bg-[color:var(--topic-ethics)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-ethics)]",
    dot: "bg-[color:var(--topic-ethics)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-ethics-soft)] text-[color:var(--topic-ethics-ink)]",
    eyebrow: "text-[color:var(--topic-ethics-ink)]",
    iconWrap: "bg-[color:var(--topic-ethics-soft)] text-[color:var(--topic-ethics-ink)]",
    progress: "bg-[color:var(--topic-ethics)]",
    ring: "var(--topic-ethics)",
  },
  research: {
    family: "research",
    label: "Legal Research",
    rail: "before:bg-[color:var(--topic-research)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-research)]",
    dot: "bg-[color:var(--topic-research)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-research-soft)] text-[color:var(--topic-research-ink)]",
    eyebrow: "text-[color:var(--topic-research-ink)]",
    iconWrap: "bg-[color:var(--topic-research-soft)] text-[color:var(--topic-research-ink)]",
    progress: "bg-[color:var(--topic-research)]",
    ring: "var(--topic-research)",
  },
  drafting: {
    family: "drafting",
    label: "Drafting & Writing",
    rail: "before:bg-[color:var(--topic-drafting)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-drafting)]",
    dot: "bg-[color:var(--topic-drafting)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-drafting-soft)] text-[color:var(--topic-drafting-ink)]",
    eyebrow: "text-[color:var(--topic-drafting-ink)]",
    iconWrap: "bg-[color:var(--topic-drafting-soft)] text-[color:var(--topic-drafting-ink)]",
    progress: "bg-[color:var(--topic-drafting)]",
    ring: "var(--topic-drafting)",
  },
  trauma: {
    family: "trauma",
    label: "Trauma-Informed Practice",
    rail: "before:bg-[color:var(--topic-trauma)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-trauma)]",
    dot: "bg-[color:var(--topic-trauma)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-trauma-soft)] text-[color:var(--topic-trauma-ink)]",
    eyebrow: "text-[color:var(--topic-trauma-ink)]",
    iconWrap: "bg-[color:var(--topic-trauma-soft)] text-[color:var(--topic-trauma-ink)]",
    progress: "bg-[color:var(--topic-trauma)]",
    ring: "var(--topic-trauma)",
  },
  foundations: {
    family: "foundations",
    label: "Foundations",
    rail: "before:bg-[color:var(--topic-foundations)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-foundations)]",
    dot: "bg-[color:var(--topic-foundations)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-foundations-soft)] text-[color:var(--topic-foundations-ink)]",
    eyebrow: "text-[color:var(--topic-foundations-ink)]",
    iconWrap: "bg-[color:var(--topic-foundations-soft)] text-[color:var(--topic-foundations-ink)]",
    progress: "bg-[color:var(--topic-foundations)]",
    ring: "var(--topic-foundations)",
  },
  neutral: {
    family: "neutral",
    label: "Learning",
    rail: "before:bg-[color:var(--topic-neutral)]",
    border: "border-[color:var(--line)]",
    hoverBorder: "hover:border-[color:var(--topic-neutral)]",
    dot: "bg-[color:var(--topic-neutral)]",
    chip: "border-[color:var(--line)] bg-[color:var(--topic-neutral-soft)] text-[color:var(--topic-neutral-ink)]",
    eyebrow: "text-[color:var(--topic-neutral-ink)]",
    iconWrap: "bg-[color:var(--topic-neutral-soft)] text-[color:var(--topic-neutral-ink)]",
    progress: "bg-[color:var(--topic-neutral)]",
    ring: "var(--topic-neutral)",
  },
};

// Which topic family each course belongs to. New courses map here once.
const courseTopic: Record<string, TopicFamily> = {
  "brightspace-wrapper-demo": "foundations",
  "faculty-handbook": "foundations",
  "professional-foundations": "foundations",
  "client-centered-practice": "client",
  "first-steps-in-court": "court",
  "eviction-defense-48h": "court",
};

// Which topic family colours each skill's icon in "What do you need to do?".
const skillTopic: Record<SkillId, TopicFamily> = {
  interviewing: "client",
  drafting: "drafting",
  counseling: "trauma",
  triage: "research",
  negotiation: "court",
  courtroom: "court",
  ethics: "ethics",
  research: "research",
};

export function getTopicTheme(family: TopicFamily): TopicTheme {
  return topicThemes[family];
}

export function getTopicForCourse(courseId: string): TopicFamily {
  return courseTopic[courseId] ?? "neutral";
}

export function getTopicForSkill(skillId: SkillId): TopicFamily {
  return skillTopic[skillId] ?? "neutral";
}

/** Topic theme for a course id (or any item resolved to a course id). */
export function getCourseTheme(courseId: string): TopicTheme {
  return topicThemes[getTopicForCourse(courseId)];
}

/** Topic theme for one of the homepage skill lenses. */
export function getSkillTheme(skillId: SkillId): TopicTheme {
  return topicThemes[getTopicForSkill(skillId)];
}

export function getCourseId(item: Course | Module) {
  return "courseId" in item ? item.courseId : item.id;
}

export function getCourseLabel(course: Course) {
  const labels: Record<string, string> = {
    "brightspace-wrapper-demo": "Wrapper Demo",
    "faculty-handbook": "Faculty Handbook",
    "professional-foundations": "Foundations",
    "client-centered-practice": "Client Communication",
    "first-steps-in-court": "Court Skills",
    "eviction-defense-48h": "Housing Court",
  };

  return labels[course.id] ?? course.title;
}

// ── Status colours ─────────────────────────────────────────────────────────
export type StatusKey = "progress" | "next" | "done" | "new" | "updated" | "changed" | "later";

export type StatusTheme = {
  key: StatusKey;
  label: string;
  /** Pill: soft fill, status-ink text, neutral edge. */
  pill: string;
  /** Saturated dot. */
  dot: string;
  /** Progress / accent bar fill. */
  bar: string;
  /** Left accent bar via a `before:` pseudo-element. */
  rail: string;
};

const statusThemes: Record<StatusKey, StatusTheme> = {
  progress: {
    key: "progress",
    label: "In progress",
    pill: "border-[color:var(--line)] bg-[color:var(--status-progress-soft)] text-[color:var(--status-progress-ink)]",
    dot: "bg-[color:var(--status-progress)]",
    bar: "bg-[color:var(--status-progress)]",
    rail: "before:bg-[color:var(--status-progress)]",
  },
  next: {
    key: "next",
    label: "Next up",
    pill: "border-[color:var(--line)] bg-[color:var(--status-next-soft)] text-[color:var(--status-next-ink)]",
    dot: "bg-[color:var(--status-next)]",
    bar: "bg-[color:var(--status-next)]",
    rail: "before:bg-[color:var(--status-next)]",
  },
  done: {
    key: "done",
    label: "Completed",
    pill: "border-[color:var(--line)] bg-[color:var(--status-done-soft)] text-[color:var(--status-done-ink)]",
    dot: "bg-[color:var(--status-done)]",
    bar: "bg-[color:var(--status-done)]",
    rail: "before:bg-[color:var(--status-done)]",
  },
  new: {
    key: "new",
    label: "New",
    pill: "border-[color:var(--line)] bg-[color:var(--status-new-soft)] text-[color:var(--status-new-ink)]",
    dot: "bg-[color:var(--status-new)]",
    bar: "bg-[color:var(--status-new)]",
    rail: "before:bg-[color:var(--status-new)]",
  },
  updated: {
    key: "updated",
    label: "Updated",
    pill: "border-[color:var(--line)] bg-[color:var(--status-updated-soft)] text-[color:var(--status-updated-ink)]",
    dot: "bg-[color:var(--status-updated)]",
    bar: "bg-[color:var(--status-updated)]",
    rail: "before:bg-[color:var(--status-updated)]",
  },
  changed: {
    key: "changed",
    label: "Law changed",
    pill: "border-[color:var(--line)] bg-[color:var(--status-changed-soft)] text-[color:var(--status-changed-ink)]",
    dot: "bg-[color:var(--status-changed)]",
    bar: "bg-[color:var(--status-changed)]",
    rail: "before:bg-[color:var(--status-changed)]",
  },
  later: {
    key: "later",
    label: "Later",
    pill: "border-[color:var(--line)] bg-[color:var(--status-later-soft)] text-[color:var(--status-later-ink)]",
    dot: "bg-[color:var(--status-later)]",
    bar: "bg-[color:var(--status-later)]",
    rail: "before:bg-[color:var(--status-later)]",
  },
};

export function getStatusTheme(key: StatusKey): StatusTheme {
  return statusThemes[key];
}

/**
 * Map a free-text status / tag string from the content data onto a status key.
 * Covers content lifecycle ("New", "Updated"), change notices ("Law changed",
 * "Process changed"), and progress states ("In progress", "Completed").
 */
export function resolveStatusKey(value: string): StatusKey {
  const v = value.trim().toLowerCase();
  if (v === "new") return "new";
  if (v === "updated") return "updated";
  if (v.includes("law") || v.includes("process changed") || v.includes("changed")) return "changed";
  if (v === "in progress" || v === "in-progress") return "progress";
  if (v === "next up" || v === "next-up" || v === "next") return "next";
  if (v === "completed" || v === "done" || v === "complete") return "done";
  if (v === "not started" || v === "later" || v === "inactive") return "later";
  return "later";
}
