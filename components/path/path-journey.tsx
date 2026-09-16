import Link from "next/link";
import type { CSSProperties } from "react";

import { EdgeScrollerList } from "@/components/edge-scroller";
import { CheckIcon, ChevronLeftIcon, PathIcon, PlayIcon, StarIcon } from "@/components/icons";
import { ProgressRing } from "@/components/progress-ring";
import { type MockLearningPath, type PathPhase, type PathStage } from "@/lib/mocks/core-curriculum";
import { getHue, type SkillHue } from "@/lib/skill-hue";

type PhaseStatus = "complete" | "current" | "upcoming";

function phaseStatus(phase: PathPhase): PhaseStatus {
  if (phase.stages.some((stage) => stage.status === "current")) return "current";
  if (phase.stages.every((stage) => stage.status === "complete")) return "complete";
  return "upcoming";
}

// The big node used inside the spotlighted (current) phase — a full status
// read at a glance: filled + checked (done), filled + playing (now), starred
// (featured), or an empty ring (not yet). Colour is the phase's own hue for
// anything already touched; untouched stages stay neutral on purpose, so
// colour reads as "engaged with" rather than decorating every stage alike.
function StageNode({ stage, hue }: { stage: PathStage; hue: SkillHue }) {
  const engaged = stage.status === "complete" || stage.status === "current";
  const style: CSSProperties =
    stage.status === "featured"
      ? {}
      : engaged
        ? ({
            background: hue.solid,
            color: "var(--brand-on)",
            // Read by the .stage-node-current keyframe below — a CSS animation
            // overrides an inline box-shadow for its duration, so the halo
            // colour has to travel in as a custom property, not a plain style.
            ...(stage.status === "current" ? { "--stage-halo": hue.tint } : null),
          } as CSSProperties)
        : {};

  return (
    <span
      className={`stage-node flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        stage.status === "featured"
          ? "bg-[color:var(--hue-4)] text-[color:var(--brand-on)]"
          : engaged
            ? ""
            : "border-[1.5px] border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--ink-soft)]"
      } ${stage.status === "current" ? "stage-node-current" : ""}`}
      style={style}
      aria-hidden="true"
    >
      {stage.status === "complete" ? <CheckIcon className="h-3.5 w-3.5" /> : null}
      {stage.status === "current" ? <PlayIcon className="h-3.5 w-3.5" /> : null}
      {stage.status === "featured" ? <StarIcon className="h-3.5 w-3.5" /> : null}
      {stage.status === "upcoming" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--ink-soft)]/40" />
      ) : null}
    </span>
  );
}

// The current phase's full timeline — nodes + connectors, the only place the
// page still spends this much room, because it's the one row someone actually
// needs to study before their next session.
function SpotlightTimeline({ stages, hue }: { stages: PathStage[]; hue: SkillHue }) {
  return (
    <EdgeScrollerList frameClassName="mt-5" className="-mx-1 flex items-start px-1 pb-1">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const priorDone = stages[index]?.status === "complete";
        return (
          <li key={stage.id} className="flex min-w-[6rem] flex-1 items-start">
            <div className="flex min-w-[6rem] flex-1 flex-col items-center">
              <StageNode stage={stage} hue={hue} />
              <p
                className={`mt-2.5 text-center text-[11.5px] leading-snug ${
                  stage.status === "featured"
                    ? "font-bold text-[color:var(--ink)]"
                    : "font-semibold text-[color:var(--ink)]"
                }`}
              >
                {stage.title}
              </p>
              {/* ink-muted, not ink-soft: this timeline only renders on the
                  spotlight card's tinted background (color-mix over
                  surface-raised), which ink-soft's contrast guarantee was
                  never measured against. */}
              <p className="mt-0.5 text-center text-[10.5px] text-[color:var(--ink-muted)]">
                {stage.detail}
              </p>
            </div>
            {isLast ? null : (
              <span
                aria-hidden="true"
                className="mt-[15px] h-[2px] min-w-3 flex-1"
                style={{ background: priorDone ? hue.solid : "var(--line)" }}
              />
            )}
          </li>
        );
      })}
    </EdgeScrollerList>
  );
}

// Every other phase collapses to one line: a hue swatch, the label, a status
// read, and a disclosure that unpacks to a wrapped strip of stage chips. This
// is what actually tightens the page — six identical full-height timelines
// used to run the length of the route whether or not there was anything to
// see yet; now only the phase in progress asks for that much space.
function PhaseSummaryRow({
  phase,
  hue,
  status,
}: {
  phase: PathPhase;
  hue: SkillHue;
  status: "complete" | "upcoming";
}) {
  const total = phase.stages.length;
  const statusText =
    status === "complete"
      ? `${total} of ${total} complete`
      : `Not started · ${total} stage${total === 1 ? "" : "s"}`;

  return (
    <details
      id={phase.id}
      className="group scroll-mt-24 border-b border-[color:var(--line)] py-1 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-[var(--radius-control)] px-2 py-3 marker:content-none focus-ring [&::-webkit-details-marker]:hidden">
        <span
          className="h-[9px] w-[9px] shrink-0 rounded-[3px]"
          style={{ background: hue.solid, opacity: status === "upcoming" ? 0.4 : 1 }}
          aria-hidden="true"
        />
        <span className="text-[14px] font-semibold text-[color:var(--ink)]">{phase.label}</span>
        <span className="metadata text-[color:var(--ink-soft)]">{phase.range}</span>
        <span className="ml-auto flex items-center gap-1.5 text-[12.5px] text-[color:var(--ink-soft)]">
          {status === "complete" ? (
            <CheckIcon className="h-3.5 w-3.5 text-[color:var(--status-done)]" />
          ) : null}
          {statusText}
        </span>
        <ChevronLeftIcon className="h-4 w-4 shrink-0 -rotate-90 text-[color:var(--ink-soft)] transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <ul className="flex flex-wrap gap-2 py-3 pl-5">
        {phase.stages.map((stage) => (
          <li
            key={stage.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-[12.5px] text-[color:var(--ink-muted)]"
          >
            {stage.status === "complete" ? (
              <CheckIcon className="h-3 w-3 text-[color:var(--status-done)]" />
            ) : null}
            {stage.status === "featured" ? (
              <StarIcon className="h-3 w-3 text-[color:var(--hue-4)]" />
            ) : null}
            <span className="font-medium text-[color:var(--ink)]">{stage.title}</span>
            <span className="text-[color:var(--ink-soft)]">{stage.detail}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

// The map: one segmented bar spanning all 25 stages, each phase a slice sized
// by its own stage count and filled by its own completion — the whole arc in
// one glance, and a jump link to any phase's row.
function JourneyMeter({
  phases,
  computed,
}: {
  phases: PathPhase[];
  computed: { status: PhaseStatus; hue: SkillHue }[];
}) {
  const totalStages = phases.reduce((sum, phase) => sum + phase.stages.length, 0);

  return (
    <div className="mt-6">
      <div className="flex gap-1" role="img" aria-label="Progress across all six phases">
        {phases.map((phase, index) => {
          const { hue } = computed[index];
          const completed = phase.stages.filter((s) => s.status === "complete").length;
          const pct = Math.round((completed / phase.stages.length) * 100);
          return (
            <div
              key={phase.id}
              className="h-2 overflow-hidden rounded-full"
              style={{
                width: `${(phase.stages.length / totalStages) * 100}%`,
                background: "var(--surface-sunken)",
              }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: hue.solid }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {phases.map((phase, index) => {
          const { status, hue } = computed[index];
          return (
            <a
              key={phase.id}
              href={`#${phase.id}`}
              className={`metadata rounded-sm transition focus-ring ${
                status === "current"
                  ? "font-bold"
                  : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
              }`}
              style={status === "current" ? { color: hue.ink } : undefined}
            >
              {phase.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function PathJourney({ path }: { path: MockLearningPath }) {
  const computed = path.phases.map((phase, index) => ({
    status: phaseStatus(phase),
    hue: getHue(index),
  }));
  const currentIndex = computed.findIndex((c) => c.status === "current");
  const overallPct = Math.round((path.stagesComplete / path.stageCount) * 100);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
      <Link
        href="/browse/paths"
        className="metadata inline-flex items-center gap-1.5 rounded-sm text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus-ring"
      >
        <span aria-hidden="true">←</span> Back to paths
      </Link>

      <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--brand)]">
        <PathIcon className="h-3.5 w-3.5" />
        {path.kicker}
      </p>
      <h1 className="hero-display mt-2 max-w-3xl text-[28px] text-[color:var(--ink)] sm:text-[38px]">
        {path.title}
      </h1>
      <p className="mt-3 max-w-xl text-[14.5px] leading-6 text-[color:var(--ink-muted)] sm:text-[15px]">
        {path.description}
      </p>

      <div className="mt-6 flex items-center gap-4">
        <ProgressRing
          value={overallPct}
          size={52}
          stroke={5}
          color="var(--brand-fill)"
          label={`${overallPct} percent of the journey complete`}
        >
          <span className="text-[12px] font-bold tabular-nums text-[color:var(--ink)]">
            {overallPct}%
          </span>
        </ProgressRing>
        <p className="text-[13px] leading-tight text-[color:var(--ink-soft)]">
          <span className="font-semibold text-[color:var(--ink)]">
            {path.stagesComplete} of {path.stageCount} stages
          </span>{" "}
          complete · {path.hoursLabel}
        </p>
      </div>

      <JourneyMeter phases={path.phases} computed={computed} />

      <div className="mt-9">
        {path.phases.map((phase, index) => {
          const { status, hue } = computed[index];

          if (status !== "current") {
            return <PhaseSummaryRow key={phase.id} phase={phase} hue={hue} status={status} />;
          }

          return (
            <section
              key={phase.id}
              id={phase.id}
              className="scroll-mt-24 rounded-[var(--radius-card)] border border-[color:var(--line-strong)] p-4 sm:p-6"
              style={{ background: `color-mix(in srgb, ${hue.solid} 6%, var(--surface-raised))` }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="section-title text-[17px] text-[color:var(--ink)] sm:text-[19px]">
                    {phase.label}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em]"
                    style={{ background: hue.tint, color: hue.ink }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: hue.solid }} />
                    In progress
                  </span>
                </div>
                <p className="text-[12px] font-medium text-[color:var(--ink-muted)]">
                  {phase.range}
                </p>
              </div>

              <SpotlightTimeline stages={phase.stages} hue={hue} />

              <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-label" style={{ color: hue.ink }}>
                    {path.upNext.kicker}
                  </p>
                  <h3 className="section-title mt-1 text-[15px] text-[color:var(--ink)] sm:text-[16px]">
                    {path.upNext.title}
                  </h3>
                  <p className="mt-1 max-w-lg text-[13px] leading-5 text-[color:var(--ink-muted)]">
                    {path.upNext.body}
                  </p>
                </div>
                <Link
                  href={path.upNext.ctaHref}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--solid-bg)] px-5 text-sm font-bold text-[color:var(--solid-ink)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
                >
                  {path.upNext.ctaLabel}
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      {currentIndex === -1 ? (
        <aside className="mt-9 rounded-[14px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 py-5 shadow-[var(--shadow-xs)] sm:px-6 sm:py-6">
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
      ) : null}
    </div>
  );
}
