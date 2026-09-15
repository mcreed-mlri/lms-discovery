import Link from "next/link";

import { CheckIcon, StarIcon } from "@/components/icons";
import {
  type MockLearningPath,
  type PathStage,
  type PathStageStatus,
} from "@/lib/mocks/core-curriculum";

function nodeClass(status: PathStageStatus) {
  if (status === "complete" || status === "current") {
    return "bg-[color:var(--brand-fill)] text-[color:var(--brand-on)]";
  }
  if (status === "featured") {
    return "bg-[color:var(--hue-4)] text-[color:var(--brand-on)]";
  }
  return "border-[1.5px] border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--ink-soft)]";
}

function connectorClass(status: PathStageStatus) {
  if (status === "complete") {
    return "bg-[color:var(--brand-fill)]";
  }
  return "bg-[color:var(--line)]";
}

function StageNode({ stage }: { stage: PathStage }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full ${nodeClass(stage.status)}`}
      aria-hidden="true"
    >
      {stage.status === "complete" ? <CheckIcon className="h-3.5 w-3.5" /> : null}
      {stage.status === "current" ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="m9 7 9 5-9 5z" />
        </svg>
      ) : null}
      {stage.status === "featured" ? <StarIcon className="h-3.5 w-3.5" /> : null}
      {stage.status === "upcoming" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ink-soft)]/40" />
      ) : null}
    </span>
  );
}

function PhaseRow({ label, range, stages }: { label: string; range: string; stages: PathStage[] }) {
  return (
    <section className="mt-8 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="section-label text-[color:var(--ink-soft)]">{label}</h2>
        <p className="text-[12px] font-medium text-[color:var(--ink-soft)]">{range}</p>
      </div>
      <ol className="-mx-4 mt-5 flex items-start overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          return (
            <li key={stage.id} className="flex min-w-[6.5rem] flex-1 items-start">
              <div className="flex min-w-[6.5rem] flex-1 flex-col items-center">
                <StageNode stage={stage} />
                <p
                  className={`mt-3 text-center text-[12px] leading-snug ${
                    stage.status === "featured"
                      ? "font-bold text-[color:var(--ink)]"
                      : "font-semibold text-[color:var(--ink)]"
                  }`}
                >
                  {stage.title}
                </p>
                <p className="mt-0.5 text-center text-[11px] text-[color:var(--ink-soft)]">
                  {stage.detail}
                </p>
              </div>
              {isLast ? null : (
                <span
                  aria-hidden="true"
                  className={`mt-[15px] h-[2px] min-w-3 flex-1 ${connectorClass(stage.status)}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function PathJourney({ path }: { path: MockLearningPath }) {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
      <Link
        href="/browse"
        className="metadata inline-flex items-center gap-1.5 text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus-ring"
      >
        <span aria-hidden="true">←</span> Back to browse
      </Link>

      <p className="mt-6 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-fill)]"
          aria-hidden="true"
        />
        Path
      </p>
      <h1 className="hero-display mt-2 max-w-4xl text-[28px] text-[color:var(--ink)] sm:text-[40px]">
        {path.title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--ink-muted)] sm:text-[16px]">
        {path.description}
      </p>
      <p className="mt-3 text-[13px] text-[color:var(--ink-soft)]">
        {path.stagesComplete} of {path.stageCount} stages complete · {path.hoursLabel} ·{" "}
        {path.cleLabel}
      </p>

      <div className="mt-10">
        {path.phases.map((phase) => (
          <PhaseRow key={phase.id} label={phase.label} range={phase.range} stages={phase.stages} />
        ))}
      </div>

      <aside className="mt-10 rounded-[14px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 py-5 shadow-[var(--shadow-xs)] sm:px-6 sm:py-6">
        <p className="section-label text-[color:var(--ink-soft)]">{path.upNext.kicker}</p>
        <h2 className="section-title mt-2 text-[18px] text-[color:var(--ink)] sm:text-[20px]">
          {path.upNext.title}
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[color:var(--ink-muted)]">
          {path.upNext.body}
        </p>
        <Link
          href={path.upNext.ctaHref}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--solid-bg)] px-5 text-sm font-bold text-[color:var(--solid-ink)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
        >
          {path.upNext.ctaLabel}
        </Link>
      </aside>
    </div>
  );
}
