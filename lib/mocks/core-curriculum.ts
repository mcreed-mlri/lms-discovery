import type { SkillGlyphKind } from "@/lib/data";
import { featuredLearningPath, featuredLearningPathUrl } from "@/lib/demo-discovery";

export type CoreSkillProgress = "complete" | "in-progress" | "not-started";

export type CoreSkillCard = {
  id: string;
  name: string;
  blurb: string;
  topicCount: number;
  progress: CoreSkillProgress;
  glyph: SkillGlyphKind;
  href: string;
  /** Topic-family token names: `--topic-*`, `--topic-*-soft`, `--topic-*-ink`. */
  topic: "foundations" | "ethics" | "drafting" | "research";
};

export type PathStageStatus = "complete" | "current" | "upcoming" | "featured";

export type PathStage = {
  id: string;
  title: string;
  detail: string;
  status: PathStageStatus;
};

export type PathPhase = {
  id: string;
  label: string;
  range: string;
  stages: PathStage[];
};

export type MockLearningPath = {
  slug: string;
  href: string;
  kicker: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  stagesComplete: number;
  stageCount: number;
  hoursLabel: string;
  phases: PathPhase[];
  upNext: {
    kicker: string;
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export const coreSkillCards: CoreSkillCard[] = [
  {
    id: "foundations",
    name: "Foundations",
    blurb:
      "Case lifecycle, the history of legal aid, trauma-informed and structurally competent practice.",
    topicCount: 8,
    progress: "complete",
    glyph: "court",
    href: "/learn/course-foundations",
    topic: "foundations",
  },
  {
    id: "ethics",
    name: "Ethics",
    blurb:
      "The MA Rules of Professional Conduct as they land in a legal aid practice, plus AI and LSC restrictions.",
    topicCount: 11,
    progress: "in-progress",
    glyph: "ethics",
    href: "/learn/course-ethics",
    topic: "ethics",
  },
  {
    id: "legal-writing",
    name: "Legal Writing",
    blurb: "From plain-language basics to briefs, demand letters, and know-your-rights material.",
    topicCount: 22,
    progress: "in-progress",
    glyph: "draft",
    href: "/learn/course-legal-writing",
    topic: "drafting",
  },
  {
    id: "legal-research",
    name: "Legal Research",
    blurb: "Planning research, working the databases, and mapping evidence to elements.",
    topicCount: 10,
    progress: "not-started",
    glyph: "research",
    href: "/learn/course-legal-research",
    topic: "research",
  },
];

export const intakeToVerdictPath: MockLearningPath = {
  slug: "intake-to-verdict",
  href: featuredLearningPathUrl,
  kicker: "Example learning path",
  title: featuredLearningPath.title,
  shortTitle: featuredLearningPath.title,
  description: featuredLearningPath.description,
  summary: "25 stages across 6 phases · 11 complete",
  stagesComplete: 11,
  stageCount: 25,
  hoursLabel: "about 52 hours",
  phases: [
    {
      id: "new-attorney",
      label: "New Attorney",
      range: "Stages 1–3",
      stages: [
        { id: "case-lifecycle", title: "Case Lifecycle", detail: "1h", status: "complete" },
        {
          id: "history-of-legal-aid",
          title: "History of Legal Aid",
          detail: "1h",
          status: "complete",
        },
        {
          id: "prof-conduct",
          title: "MA Rules of Professional Conduct",
          detail: "2h",
          status: "complete",
        },
      ],
    },
    {
      id: "access-to-counsel",
      label: "Access to Counsel",
      range: "Stages 4–5",
      stages: [
        { id: "referral-intake", title: "Referral & Intake", detail: "1h", status: "complete" },
        { id: "conflict-checks", title: "Conflict Checks", detail: "1h", status: "complete" },
      ],
    },
    {
      id: "bridge-to-practice",
      label: "Bridge to Practice",
      range: "Stages 6–8",
      stages: [
        {
          id: "legal-writing-basics",
          title: "Legal Writing Basics",
          detail: "2h",
          status: "complete",
        },
        {
          id: "legal-research-planning",
          title: "Legal Research Planning",
          detail: "2h",
          status: "complete",
        },
        { id: "case-theory", title: "Case Theory", detail: "1h", status: "complete" },
      ],
    },
    {
      id: "before-trial",
      label: "Before Trial",
      range: "Stages 9–14",
      stages: [
        {
          id: "litigation-planning",
          title: "Litigation Planning",
          detail: "3h",
          status: "complete",
        },
        { id: "pleadings", title: "Pleadings", detail: "4h", status: "complete" },
        { id: "discovery", title: "Discovery", detail: "5h", status: "complete" },
        { id: "motions", title: "Motions", detail: "4h", status: "current" },
        {
          id: "pre-trial-conference",
          title: "Pre-Trial Conference",
          detail: "2h",
          status: "upcoming",
        },
        { id: "jury-selection", title: "Jury Selection", detail: "3h", status: "upcoming" },
      ],
    },
    {
      id: "at-trial",
      label: "At Trial",
      range: "Stages 15–21",
      stages: [
        { id: "exhibits", title: "Exhibits", detail: "2h", status: "upcoming" },
        { id: "opening", title: "Opening Statements", detail: "2h", status: "upcoming" },
        { id: "direct", title: "Direct Exams", detail: "3h", status: "upcoming" },
        { id: "cross", title: "Cross Exams", detail: "3h", status: "upcoming" },
        { id: "objections", title: "Objections", detail: "4 modules", status: "featured" },
        { id: "witnesses", title: "Witnesses & Experts", detail: "2h", status: "upcoming" },
        { id: "closing", title: "Closing Statements", detail: "2h", status: "upcoming" },
      ],
    },
    {
      id: "after-verdict",
      label: "After the Verdict",
      range: "Stages 22–25",
      stages: [
        { id: "verdicts", title: "Verdicts", detail: "1h", status: "upcoming" },
        { id: "post-trial-motions", title: "Post-Trial Motions", detail: "2h", status: "upcoming" },
        { id: "preserving", title: "Preserving Issues", detail: "1h", status: "upcoming" },
        { id: "oral-argument", title: "Oral Argument", detail: "2h", status: "upcoming" },
      ],
    },
  ],
  upNext: {
    kicker: "Up next",
    title: "Stage 12 · Motions",
    body: "Draft and argue the motions that shape a case before trial — for the record and for the judge.",
    ctaLabel: "Open the Motions modules",
    ctaHref: "/browse?q=motions",
  },
};

export function getMockPath(slug: string): MockLearningPath | undefined {
  if (slug === intakeToVerdictPath.slug) return intakeToVerdictPath;
  return undefined;
}
