"use client";

import Link from "next/link";

import { CheckIcon } from "@/components/icons";
import { SkillPageHeader } from "@/components/skill-page-header";
import { StudioShell } from "@/components/studio-shell";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTab, getTopic, referencePages } from "@/lib/binder";
import { useSkillProgress } from "@/lib/skill-progress";
import {
  builtSteps,
  getSkillPath,
  quickDrillHref,
  STEP_ORDER,
  stepHref,
  stepNames,
  type SkillLevel,
  type StepKind,
} from "@/lib/skill-paths";

type StopState = "done" | "next" | "open" | "coming";

/**
 * A skill's level map: its levels (simple to complex), each with Watch, Help
 * and Solo, plus quick drills and the cheat sheet. The recommended next step
 * is marked; nothing that is built is locked, so an experienced advocate can
 * jump straight to Solo.
 */
export function SkillPathView({ pathId }: { pathId: string }) {
  const { user } = useAuth();
  const path = getSkillPath(pathId);
  const progress = useSkillProgress(user?.id, pathId);
  if (!path) return null;
  const binder = getBinder(path.binderId);
  const tab = binder ? getSectionTab(binder, path.tabId) : undefined;
  const topic = binder && tab ? getTopic(binder, tab.id, path.topicId) : undefined;
  if (!binder || !tab || !topic) return null;

  // The first built step not yet done, across all levels, is "next".
  const next = path.levels
    .flatMap((level) => builtSteps(level).map((step) => ({ level, step })))
    .find(({ level, step }) => !progress.isDone(level.n, step));
  const references = referencePages[`${tab.id}/${topic.id}`] ?? [];

  function stateOf(level: SkillLevel, step: StepKind): StopState {
    if (!builtSteps(level).includes(step)) return "coming";
    if (progress.isDone(level.n, step)) return "done";
    if (next && next.level.n === level.n && next.step === step) return "next";
    return "open";
  }

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <SkillPageHeader
          crumbs={[
            { label: binder.name, href: binder.href },
            { label: tab.label, href: tab.href },
            { label: topic.title, href: topic.href },
          ]}
          title={path.title}
        >
          {path.summary}
        </SkillPageHeader>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
          <section aria-labelledby="levels" className="min-w-0">
            <h2
              id="levels"
              className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
            >
              Your levels
            </h2>
            <ol className="mt-3 flex flex-col gap-3">
              {path.levels.map((level) => {
                const built = builtSteps(level).length > 0;
                const finished =
                  built && builtSteps(level).every((s) => progress.isDone(level.n, s));
                return (
                  <li
                    key={level.n}
                    className={`rounded-[12px] px-5 py-4 ${
                      built
                        ? "border-[1.5px] border-[color:var(--ink)]"
                        : "border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div>
                        <p className="text-[12px] font-bold tracking-[0.04em] text-[color:var(--ink-muted)]">
                          LEVEL {level.n}
                        </p>
                        <h3 className="text-[18px] font-extrabold text-[color:var(--ink)]">
                          {level.title}
                        </h3>
                        <p className="text-[14px] text-[color:var(--ink-muted)]">{level.what}</p>
                      </div>
                      <p className="text-[13px] font-bold text-[color:var(--ink-muted)]">
                        {finished ? "Done" : built ? "Open" : "Coming"}
                      </p>
                    </div>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {STEP_ORDER.map((step) => (
                        <li key={step}>
                          <Stop
                            state={stateOf(level, step)}
                            name={stepNames[step]}
                            sub={stepSub(level, step)}
                            href={stepHref(path, level, step)}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-[13px] text-[color:var(--ink-soft)]">
              Prototype content, not yet reviewed by a subject-matter expert. Your progress stays in
              this browser on this device.
            </p>
          </section>

          <aside className="flex min-w-0 flex-col gap-6 lg:self-start">
            <section
              aria-labelledby="drills"
              className="rounded-[12px] border-[1.5px] border-[color:var(--ink)] px-5 py-4"
            >
              <h2 id="drills" className="text-[17px] font-extrabold text-[color:var(--ink)]">
                Quick drills
              </h2>
              <p className="mt-0.5 text-[13px] text-[color:var(--ink-muted)]">
                Two minutes. Make the basics automatic.
              </p>
              <ul className="mt-2 border-t border-[color:var(--line)]">
                {path.drills.map((drill) => {
                  const best = progress.bestScore(drill.id);
                  return (
                    <li key={drill.id} className="border-b border-[color:var(--line)]">
                      <Link
                        href={quickDrillHref(path, drill)}
                        className="flex min-h-11 items-center justify-between gap-3 py-2 text-[15px] font-bold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        {drill.title}
                        <span className="text-[12px] font-semibold text-[color:var(--ink-muted)]">
                          {best === undefined ? "Not tried" : `Best ${best}/${drill.items.length}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            {references.length > 0 ? (
              <section
                aria-labelledby="cheat-sheet"
                className="rounded-[12px] border border-[color:var(--notes-edge)] bg-[color:var(--notes-paper)] px-5 py-4"
              >
                <h2 id="cheat-sheet" className="text-[17px] font-extrabold text-[color:var(--ink)]">
                  Cheat sheet
                </h2>
                <p className="mt-0.5 text-[13px] text-[color:var(--ink-muted)]">
                  Open any time. It fades as the levels get harder.
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {references.map((page) => (
                    <li key={page.href}>
                      <a
                        href={page.href}
                        className="inline-flex min-h-11 items-center rounded-[4px] text-[15px] font-semibold text-[color:var(--brand-ink)] underline-offset-[3px] hover:underline focus-ring"
                      >
                        {page.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </StudioShell>
  );
}

function stepSub(level: SkillLevel, step: StepKind) {
  if (level.coming) return level.coming[step];
  if (step === "watch") return "An expert’s answer, annotated";
  if (step === "help") return "Finish what the expert started";
  return "Write it yourself";
}

const stopStyles: Record<StopState, { box: string; dot: string; label: string }> = {
  done: {
    box: "border border-[color:var(--line)] bg-[color:var(--surface)]",
    dot: "bg-[color:var(--ink)] text-[color:var(--surface)]",
    label: "done",
  },
  next: {
    box: "border-2 border-[color:var(--binder)] bg-[color:var(--hover-tint)]",
    dot: "border-2 border-[color:var(--binder)] bg-[color:var(--surface)]",
    label: "next",
  },
  open: {
    box: "border border-[color:var(--line)] bg-[color:var(--surface)]",
    dot: "border-2 border-[color:var(--ink-soft)] bg-[color:var(--surface)]",
    label: "",
  },
  coming: {
    box: "border border-dashed border-[color:var(--line-strong)]",
    dot: "border-2 border-dashed border-[color:var(--line-strong)]",
    label: "coming",
  },
};

function Stop({
  state,
  name,
  sub,
  href,
}: {
  state: StopState;
  name: string;
  sub: string;
  href: string;
}) {
  const style = stopStyles[state];
  const body = (
    <>
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${style.dot}`}
      >
        {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : null}
        {state === "next" ? (
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--binder)]" />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold">
          {name}
          {style.label ? (
            <span className="ml-1.5 text-[12px] font-semibold text-[color:var(--ink-muted)]">
              · {style.label}
            </span>
          ) : null}
        </span>
        <span className="block text-[13px] text-[color:var(--ink-muted)]">{sub}</span>
      </span>
    </>
  );
  const className = `flex min-h-14 items-center gap-3 rounded-[8px] px-3 py-2 text-[color:var(--ink)] ${style.box}`;
  if (state === "coming")
    return <div className={`${className} text-[color:var(--ink-muted)]`}>{body}</div>;
  return (
    <Link
      href={href}
      aria-label={`${name}${style.label ? `, ${style.label}` : ""}: ${sub}`}
      className={`${className} hover:bg-[color:var(--hover-tint)] focus-ring`}
    >
      {body}
    </Link>
  );
}
