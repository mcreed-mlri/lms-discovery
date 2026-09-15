import type { SkillGlyphKind } from "@/lib/data";

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
  href: "/browse/paths/intake-to-verdict",
  kicker: "Trial skills",
  title: "Trial Skills: intake to verdict",
  shortTitle: "Intake to verdict",
  description:
    "Fourteen stages in the order a case moves. Take them in sequence, or drop into any stage you need before a hearing.",
  summary: "14 stages in the order a case moves · 4 complete",
  stagesComplete: 4,
  stageCount: 14,
  hoursLabel: "about 38 hours",
  phases: [
    {
      id: "before-trial",
      label: "Before trial",
      range: "Stages 1–6",
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
      label: "At trial",
      range: "Stages 7–13",
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
      label: "After the verdict",
      range: "Stage 14",
      stages: [
        { id: "oral-argument", title: "Oral Argument", detail: "2h", status: "upcoming" },
        { id: "verdicts", title: "Verdicts", detail: "1h", status: "upcoming" },
        { id: "post-trial-motions", title: "Post-Trial Motions", detail: "2h", status: "upcoming" },
        { id: "preserving", title: "Preserving Issues", detail: "1h", status: "upcoming" },
      ],
    },
  ],
  upNext: {
    kicker: "Up next",
    title: "Stage 10 · Objections",
    body: "Four modules: foundation and form objections, hearsay, privilege, and preserving the record. Hearsay is the one built out so far.",
    ctaLabel: "Open the Hearsay module",
    ctaHref: "/browse?q=hearsay",
  },
};

export function getMockPath(slug: string): MockLearningPath | undefined {
  if (slug === intakeToVerdictPath.slug) return intakeToVerdictPath;
  return undefined;
}
