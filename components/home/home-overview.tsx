import Link from "next/link";
import type { CSSProperties } from "react";

import { ArrowIcon } from "@/components/icons";
import { SkillGlyph } from "@/components/skill-glyph";
import {
  coreSkillCards,
  intakeToVerdictPath,
  type CoreSkillCard,
  type CoreSkillProgress,
} from "@/lib/mocks/core-curriculum";

const topicVars: Record<CoreSkillCard["topic"], { solid: string; tint: string; ink: string }> = {
  foundations: {
    solid: "var(--topic-foundations)",
    tint: "var(--topic-foundations-soft)",
    ink: "var(--topic-foundations-ink)",
  },
  ethics: {
    solid: "var(--topic-ethics)",
    tint: "var(--topic-ethics-soft)",
    ink: "var(--topic-ethics-ink)",
  },
  drafting: {
    solid: "var(--topic-drafting)",
    tint: "var(--topic-drafting-soft)",
    ink: "var(--topic-drafting-ink)",
  },
  research: {
    solid: "var(--topic-research)",
    tint: "var(--topic-research-soft)",
    ink: "var(--topic-research-ink)",
  },
};

const progressCopy: Record<CoreSkillProgress, { label: string; dot: string }> = {
  complete: { label: "Complete", dot: "bg-[color:var(--status-done)]" },
  "in-progress": { label: "In progress", dot: "bg-[color:var(--brand-fill)]" },
  "not-started": { label: "Not started", dot: "bg-[color:var(--ink-soft)]/35" },
};

function CoreSkillTile({ skill }: { skill: CoreSkillCard }) {
  const hue = topicVars[skill.topic];
  const progress = progressCopy[skill.progress];

  return (
    <Link
      href={skill.href}
      style={
        {
          "--accent": hue.solid,
          "--accent-tint": hue.tint,
          "--accent-ink": hue.ink,
        } as CSSProperties
      }
      className="interactive-tile group relative flex min-h-0 flex-col p-4 text-left focus-ring sm:min-h-[13.5rem] sm:p-5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[color:var(--accent-tint)] text-[color:var(--accent-ink)] sm:h-11 sm:w-11">
        <SkillGlyph kind={skill.glyph} className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <h3 className="section-title mt-3 text-[16px] leading-snug text-[color:var(--ink)] sm:text-[17px]">
        {skill.name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--ink-muted)] sm:text-[14px]">
        {skill.blurb}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--ink-soft)]">
          <span className={`h-1.5 w-1.5 rounded-full ${progress.dot}`} aria-hidden="true" />
          {skill.topicCount} topics · {progress.label}
        </span>
        <ArrowIcon className="h-4 w-4 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function PathPreviewCard() {
  const path = intakeToVerdictPath;
  const dots = Array.from({ length: path.stageCount }, (_, index) => index < path.stagesComplete);

  return (
    <Link
      href={path.href}
      className="interactive-tile group flex flex-col gap-4 p-4 focus-ring sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5 sm:py-4"
    >
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-fill)]"
            aria-hidden="true"
          />
          {path.kicker}
        </p>
        <h3 className="section-title mt-1.5 text-[16px] text-[color:var(--ink)] sm:text-[18px]">
          {path.shortTitle}
        </h3>
        <p className="mt-1 text-[13px] text-[color:var(--ink-muted)]">{path.summary}</p>
      </div>
      <div
        className="flex shrink-0 gap-1"
        role="img"
        aria-label={`${path.stagesComplete} of ${path.stageCount} stages complete`}
      >
        {dots.map((done, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${done ? "bg-[color:var(--brand-fill)]" : "bg-[color:var(--surface-sunken)]"}`}
          />
        ))}
      </div>
    </Link>
  );
}

export function HomeOverview({ catalogTotal }: { catalogTotal: number }) {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[1120px] scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9"
    >
      <p className="section-label text-[color:var(--ink-soft)]">Core skills</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {coreSkillCards.map((skill) => (
          <CoreSkillTile key={skill.id} skill={skill} />
        ))}
      </div>
      <p className="mt-4">
        <Link
          href="/browse"
          className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[color:var(--brand)] transition hover:text-[color:var(--brand-ink)] focus-ring"
        >
          Browse all {catalogTotal} items in the catalog
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </p>

      <p className="section-label mt-10 text-[color:var(--ink-soft)] sm:mt-12">Paths</p>
      <div className="mt-3">
        <PathPreviewCard />
      </div>
    </section>
  );
}
