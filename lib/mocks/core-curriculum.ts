import type { SkillGlyphKind } from "@/lib/data";
import { featuredLearningPath, featuredLearningPathUrl } from "@/lib/demo-discovery";

export type CoreSkillCard = {
  id: string;
  name: string;
  blurb: string;
  glyph: SkillGlyphKind;
  href: string;
};

export type PathStageStatus = "complete" | "current" | "upcoming" | "featured";

export type PathStage = {
  id: string;
  title: string;
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
    glyph: "court",
    href: "/learn/course-foundations",
  },
  {
    id: "ethics",
    name: "Ethics",
    blurb:
      "The MA Rules of Professional Conduct as they land in a legal aid practice, plus AI and LSC restrictions.",
    glyph: "ethics",
    href: "/learn/course-ethics",
  },
  {
    id: "legal-writing",
    name: "Legal Writing",
    blurb: "From plain-language basics to briefs, demand letters, and know-your-rights material.",
    glyph: "draft",
    href: "/learn/course-legal-writing",
  },
  {
    id: "legal-research",
    name: "Legal Research",
    blurb: "Planning research, working the databases, and mapping evidence to elements.",
    glyph: "research",
    href: "/learn/course-legal-research",
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
  phases: [
    {
      id: "new-attorney",
      label: "New Attorney",
      range: "Stages 1–3",
      stages: [
        { id: "case-lifecycle", title: "Case Lifecycle", status: "complete" },
        {
          id: "history-of-legal-aid",
          title: "History of Legal Aid",
          status: "complete",
        },
        {
          id: "prof-conduct",
          title: "MA Rules of Professional Conduct",
          status: "complete",
        },
      ],
    },
    {
      id: "access-to-counsel",
      label: "Access to Counsel",
      range: "Stages 4–5",
      stages: [
        { id: "referral-intake", title: "Referral & Intake", status: "complete" },
        { id: "conflict-checks", title: "Conflict Checks", status: "complete" },
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
          status: "complete",
        },
        {
          id: "legal-research-planning",
          title: "Legal Research Planning",
          status: "complete",
        },
        { id: "case-theory", title: "Case Theory", status: "complete" },
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
          status: "complete",
        },
        { id: "pleadings", title: "Pleadings", status: "complete" },
        { id: "discovery", title: "Discovery", status: "complete" },
        { id: "motions", title: "Motions", status: "current" },
        {
          id: "pre-trial-conference",
          title: "Pre-Trial Conference",
          status: "upcoming",
        },
        { id: "jury-selection", title: "Jury Selection", status: "upcoming" },
      ],
    },
    {
      id: "at-trial",
      label: "At Trial",
      range: "Stages 15–21",
      stages: [
        { id: "exhibits", title: "Exhibits", status: "upcoming" },
        { id: "opening", title: "Opening Statements", status: "upcoming" },
        { id: "direct", title: "Direct Exams", status: "upcoming" },
        { id: "cross", title: "Cross Exams", status: "upcoming" },
        { id: "objections", title: "Objections", status: "featured" },
        { id: "witnesses", title: "Witnesses & Experts", status: "upcoming" },
        { id: "closing", title: "Closing Statements", status: "upcoming" },
      ],
    },
    {
      id: "after-verdict",
      label: "After the Verdict",
      range: "Stages 22–25",
      stages: [
        { id: "verdicts", title: "Verdicts", status: "upcoming" },
        { id: "post-trial-motions", title: "Post-Trial Motions", status: "upcoming" },
        { id: "preserving", title: "Preserving Issues", status: "upcoming" },
        { id: "oral-argument", title: "Oral Argument", status: "upcoming" },
      ],
    },
  ],
  upNext: {
    kicker: "Up next",
    title: "Stage 12 · Motions",
    body: "Draft and argue the motions that shape a case before trial.",
    ctaLabel: "Open the Motions modules",
    ctaHref: "/browse?q=motions",
  },
};

export function getMockPath(slug: string): MockLearningPath | undefined {
  if (slug === intakeToVerdictPath.slug) return intakeToVerdictPath;
  return undefined;
}
