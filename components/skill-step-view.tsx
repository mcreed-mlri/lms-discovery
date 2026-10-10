"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { SkillPageHeader } from "@/components/skill-page-header";
import { StudioShell } from "@/components/studio-shell";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTab, getTopic } from "@/lib/binder";
import { useSkillProgress } from "@/lib/skill-progress";
import {
  getSkillPath,
  skillHref,
  stepHref,
  type HelpStep,
  type SkillLevel,
  type SkillPath,
  type WatchStep,
} from "@/lib/skill-paths";

const primaryButton =
  "inline-flex min-h-11 items-center rounded-[8px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const secondaryButton =
  "inline-flex min-h-11 items-center rounded-[8px] border-[1.5px] border-[color:var(--ink)] bg-[color:var(--surface)] px-4 text-[15px] font-bold text-[color:var(--ink)] transition hover:bg-[color:var(--hover-tint)] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";

/** One Watch or Help step of a skill-path level. */
export function SkillStepView({
  pathId,
  levelNumber,
  step,
}: {
  pathId: string;
  levelNumber: number;
  step: "watch" | "help";
}) {
  const path = getSkillPath(pathId);
  const level = path?.levels.find((l) => l.n === levelNumber);
  const binder = path ? getBinder(path.binderId) : undefined;
  const tab = binder && path ? getSectionTab(binder, path.tabId) : undefined;
  const topic = binder && tab && path ? getTopic(binder, tab.id, path.topicId) : undefined;
  if (!path || !level || !binder || !tab || !topic) return null;
  const content = step === "watch" ? level.watch : level.help;
  if (!content) return null;

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <SkillPageHeader
          crumbs={[
            { label: binder.name, href: binder.href },
            { label: tab.label, href: tab.href },
            { label: topic.title, href: topic.href },
            { label: path.title, href: skillHref(path) },
            { label: `Level ${level.n}, ${step === "watch" ? "Watch" : "Help"}` },
          ]}
          title={step === "watch" ? "How an expert answers it" : "Finish what the expert started"}
          marker={`Step ${step === "watch" ? 1 : 2} of 3 · Watch, Help, Solo`}
        >
          {content.intro}
        </SkillPageHeader>
        {step === "watch" && level.watch ? (
          <Watch path={path} level={level} watch={level.watch} />
        ) : null}
        {step === "help" && level.help ? (
          <Help path={path} level={level} help={level.help} />
        ) : null}
      </div>
    </StudioShell>
  );
}

function CaseFile({ text }: { text: string }) {
  return (
    <div className="rounded-[10px] bg-[color:var(--surface-sunken)] px-4 py-3.5">
      <h2 className="text-[14px] font-extrabold text-[color:var(--ink)]">
        The case file{" "}
        <span className="font-semibold text-[color:var(--ink-muted)]">· fictional</span>
      </h2>
      <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]">{text}</p>
    </div>
  );
}

function Watch({ path, level, watch }: { path: SkillPath; level: SkillLevel; watch: WatchStep }) {
  const { user } = useAuth();
  const router = useRouter();
  const progress = useSkillProgress(user?.id, path.id);
  const [picked, setPicked] = useState(0);
  const sentence = watch.sentences[picked];

  function next() {
    progress.markDone(level.n, "watch");
    router.push(stepHref(path, level, "help"));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
      <div className="flex min-w-0 flex-col gap-5">
        <CaseFile text={watch.caseFile} />
        <section aria-labelledby="expert-answer">
          <h2
            id="expert-answer"
            className="text-[15px] font-extrabold text-[color:var(--ink-muted)]"
          >
            The expert’s response
          </h2>
          <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
            Choose a sentence to see why it is there.
          </p>
          <ol className="mt-3 flex flex-col gap-2">
            {watch.sentences.map((s, index) => (
              <li key={s.text}>
                <button
                  type="button"
                  aria-pressed={picked === index}
                  onClick={() => setPicked(index)}
                  className={`flex w-full items-start gap-3 rounded-[10px] border px-4 py-3 text-left text-[16px] leading-relaxed text-[color:var(--ink)] transition focus-ring ${
                    picked === index
                      ? "border-2 border-[color:var(--binder)] bg-[color:var(--hover-tint)]"
                      : "border-[color:var(--line)] hover:bg-[color:var(--hover-tint)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-[12px] font-extrabold text-[color:var(--surface)]"
                  >
                    {index + 1}
                  </span>
                  <span>{s.text}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[13px] text-[color:var(--ink-soft)]">
            Prototype content, not yet reviewed by a subject-matter expert.
          </p>
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:self-start">
        <section
          aria-labelledby="why"
          aria-live="polite"
          className="rounded-[12px] bg-[color:var(--feature-surface)] px-5 py-5 text-[color:var(--feature-ink)]"
        >
          <p className="text-[12px] font-bold tracking-[0.04em] text-[color:var(--feature-muted)]">
            SENTENCE {picked + 1} · {sentence.step.toUpperCase()}
          </p>
          <h2 id="why" className="mt-1 text-[19px] font-extrabold">
            Why the expert wrote this
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed">{sentence.why}</p>
          <p className="mt-3 text-[14px] text-[color:var(--feature-muted)]">
            Common mistake: {sentence.mistake}
          </p>
        </section>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={next} className={primaryButton}>
            Next: finish one with help
          </button>
          <Link href={skillHref(path)} className={`${secondaryButton} border-transparent`}>
            Back to levels
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Help({ path, level, help }: { path: SkillPath; level: SkillLevel; help: HelpStep }) {
  const { user } = useAuth();
  const progress = useSkillProgress(user?.id, path.id);
  const idPrefix = useId();
  const [answers, setAnswers] = useState(help.tasks.map(() => ""));
  const [hintsShown, setHintsShown] = useState(0);
  const [checked, setChecked] = useState(false);
  const [ticks, setTicks] = useState(help.checklist.map(() => false));
  // Checking disables the button that had focus; carry focus to what appeared.
  const selfCheckRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (checked) selfCheckRef.current?.focus();
  }, [checked]);
  const first = help.given.length + 1;
  const hintsLeft = help.hints.length - hintsShown;

  function check() {
    setChecked(true);
    progress.markDone(level.n, "help");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
      <div className="flex min-w-0 flex-col gap-5">
        <CaseFile text={help.caseFile} />

        <section aria-labelledby="expert-steps">
          <h2
            id="expert-steps"
            className="text-[15px] font-extrabold text-[color:var(--ink-muted)]"
          >
            What the expert wrote
          </h2>
          <ol className="mt-2 rounded-[12px] border border-[color:var(--line)] px-4">
            {help.given.map((text, index) => (
              <li
                key={text}
                className="flex gap-3 border-b border-[color:var(--line)] py-3 text-[15px] text-[color:var(--ink-muted)] last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-[12px] font-extrabold text-[color:var(--surface)]"
                >
                  {index + 1}
                </span>
                <span>
                  <span className="sr-only">Step {index + 1}: </span>
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="your-steps" className="flex flex-col gap-4">
          <h2 id="your-steps" className="text-[15px] font-extrabold text-[color:var(--ink-muted)]">
            Your turn
          </h2>
          {help.tasks.map((task, index) => {
            const fieldId = `${idPrefix}-step-${index}`;
            return (
              <div key={task.label}>
                <label
                  htmlFor={fieldId}
                  className="flex items-center gap-3 text-[15px] font-extrabold text-[color:var(--ink)]"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--binder)] text-[12px] font-extrabold"
                  >
                    {first + index}
                  </span>
                  Step {first + index}: {task.label}
                </label>
                <textarea
                  id={fieldId}
                  rows={3}
                  value={answers[index]}
                  onChange={(event) =>
                    setAnswers((list) => list.map((a, i) => (i === index ? event.target.value : a)))
                  }
                  placeholder={task.placeholder}
                  className="mt-2 w-full resize-y rounded-[10px] border-[1.5px] border-[color:var(--line-control)] bg-[color:var(--surface)] px-3.5 py-3 text-[16px] leading-relaxed text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)] focus-ring"
                />
                {checked ? (
                  <div className="mt-2 rounded-[10px] bg-[color:var(--surface-sunken)] px-4 py-3">
                    <p className="text-[13px] font-bold text-[color:var(--ink-muted)]">
                      What the expert wrote
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]">
                      {task.expert}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}

          <div aria-live="polite" className="flex flex-col gap-2">
            {help.hints.slice(0, hintsShown).map((hint, index) => (
              <p
                key={hint}
                className="rounded-[10px] border border-[color:var(--notes-edge)] bg-[color:var(--notes-paper)] px-4 py-3 text-[15px] text-[color:var(--ink)]"
              >
                <span className="font-bold">Hint {index + 1}: </span>
                {hint}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={check}
              disabled={checked || answers.every((a) => !a.trim())}
              className={primaryButton}
            >
              Check against the expert
            </button>
            <button
              type="button"
              onClick={() => setHintsShown((n) => n + 1)}
              disabled={checked || hintsLeft === 0}
              className={secondaryButton}
            >
              {hintsLeft > 0 ? `Show a hint · ${hintsLeft} left` : "No hints left"}
            </button>
          </div>

          {checked ? (
            <section
              aria-labelledby="self-check"
              className="rounded-[12px] border-[1.5px] border-[color:var(--ink)] px-5 py-4"
            >
              <h3
                id="self-check"
                ref={selfCheckRef}
                tabIndex={-1}
                className="text-[17px] font-extrabold text-[color:var(--ink)] focus:outline-none focus-visible:underline"
              >
                Check your own answer
              </h3>
              <ul className="mt-2 flex flex-col gap-1">
                {help.checklist.map((point, index) => (
                  <li key={point}>
                    <label className="flex min-h-11 items-start gap-3 py-1.5 text-[15px] text-[color:var(--ink)]">
                      <input
                        type="checkbox"
                        checked={ticks[index]}
                        onChange={() =>
                          setTicks((list) => list.map((t, i) => (i === index ? !t : t)))
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--ink)]"
                      />
                      {point}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link href={stepHref(path, level, "solo")} className={primaryButton}>
                  Next: do it solo
                </Link>
                <Link href={skillHref(path)} className={`${secondaryButton} border-transparent`}>
                  Back to levels
                </Link>
              </div>
            </section>
          ) : null}
        </section>
      </div>

      <aside
        aria-labelledby="cheat-sheet"
        className="min-w-0 rounded-[12px] border border-[color:var(--notes-edge)] bg-[color:var(--notes-paper)] px-5 py-4 lg:self-start"
      >
        <p className="text-[12px] font-bold tracking-[0.04em] text-[color:var(--ink-muted)]">
          CHEAT SHEET · OPEN AT THIS LEVEL
        </p>
        <h2 id="cheat-sheet" className="mt-1 text-[18px] font-extrabold text-[color:var(--ink)]">
          Five-step response
        </h2>
        <ol className="mt-2 list-decimal pl-5 text-[15px] leading-relaxed">
          {[
            "Name the statement",
            "State the purpose",
            "Say whether it is hearsay",
            "Give an exception, tied to the facts",
            "Ask clearly",
          ].map((text, index) => (
            <li
              key={text}
              className={
                index >= help.given.length
                  ? "font-bold text-[color:var(--ink)]"
                  : "text-[color:var(--ink-muted)]"
              }
            >
              {text}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] text-[color:var(--ink-muted)]">
          At harder levels this becomes hints only, then disappears.
        </p>
      </aside>
    </div>
  );
}
