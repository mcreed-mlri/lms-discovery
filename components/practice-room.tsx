"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from "react";

import { CheckIcon } from "@/components/icons";
import { NotesPanel } from "@/components/notes-panel";
import { getBinder, getSectionTab } from "@/lib/binder";
import type { PracticeDrill, PracticeRound } from "@/lib/practice";

type Phase = "write" | "review" | "coached";

function formatDuration(ms: number) {
  const seconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes} min ${rest} s` : `${rest} s`;
}

function SpeakerTurn({ round }: { round: PracticeRound }) {
  const initials = round.speaker === "The judge" ? "J" : "OC";
  return (
    <div className="flex items-start gap-3.5">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-[14px] font-extrabold text-[color:var(--paper)]"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1 rounded-[4px_14px_14px_14px] bg-[color:var(--surface-sunken)] px-4 py-3.5">
        <p className="text-[13px] text-[color:var(--ink-muted)]">
          <strong className="text-[color:var(--ink)]">{round.speaker}</strong>
          {round.reviewed ? null : " · prototype prompt, not yet reviewed"}
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-[color:var(--ink)]">
          {round.prompt}
        </p>
      </div>
    </div>
  );
}

function ResponseTurn({ text, took }: { text: string; took: string }) {
  return (
    <div className="flex flex-row-reverse items-start gap-3.5">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-[13px] font-bold text-[color:var(--brand-on)]"
      >
        You
      </span>
      <div className="min-w-0 flex-1 rounded-[14px_4px_14px_14px] border-[1.5px] border-[color:var(--brand-fill)] px-4 py-3.5">
        <p className="text-[13px] text-[color:var(--ink-muted)]">
          <strong className="text-[color:var(--ink)]">Your response</strong> · {took}
        </p>
        <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-[color:var(--ink)]">
          {text}
        </p>
      </div>
    </div>
  );
}

function Coaching({
  round,
  checked,
  headingRef,
}: {
  round: PracticeRound;
  checked: boolean[];
  /** Set on the round being coached now, so focus lands on a visible heading. */
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[color:var(--line-strong)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[color:var(--line)] bg-[color:var(--hover-tint)] px-5 py-3">
        <h3
          ref={headingRef}
          tabIndex={headingRef ? -1 : undefined}
          className="text-[17px] font-extrabold text-[color:var(--ink)] focus:outline-none focus-visible:underline"
        >
          Coaching
        </h3>
        <p className="text-[13px] text-[color:var(--ink-muted)]">
          Written by the course authors · not a grade
        </p>
      </div>
      <ol className="px-5 py-1.5">
        {round.checklist.map((point, index) => {
          const done = checked[index];
          return (
            <li
              key={point.question}
              className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3.5 border-b border-[color:var(--line-soft)] py-3 text-[15px] leading-relaxed last:border-b-0"
            >
              <span
                className={`inline-flex items-center gap-1.5 self-start text-[13px] font-bold ${
                  done ? "text-[color:var(--status-progress-ink)]" : "text-[color:var(--ink-muted)]"
                }`}
              >
                {done ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 rounded-full border-2 border-current"
                  />
                )}
                {done ? "Done" : "To work on"}
              </span>
              <span className="text-[color:var(--ink)]">
                <strong>{point.label}</strong>
                {done ? null : (
                  <span className="mt-0.5 block text-[color:var(--ink-muted)]">
                    {point.coaching}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * The scripted practice room. One round at a time: the other side speaks, the
 * learner writes, checks their own response against the course's checklist,
 * and gets the course's coaching for anything they left unchecked. Everything
 * typed lives in this component's state only, so it is gone on leaving.
 */
export function PracticeRoom({ drill }: { drill: PracticeDrill }) {
  const binder = getBinder(drill.binderId);
  const tab = binder ? getSectionTab(binder, drill.tabId) : undefined;

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("write");
  const [finished, setFinished] = useState(false);
  const [draft, setDraft] = useState("");
  const [responses, setResponses] = useState<{ text: string; took: string }[]>([]);
  const [checks, setChecks] = useState<boolean[][]>([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  // Move focus to whatever the learner should act on next, so a keyboard or
  // screen reader user follows the exchange. Skipped on first render.
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeading.current?.focus();
  }, [round, phase, finished]);

  const fieldId = useId();
  const current = drill.rounds[round];
  const isLastRound = round === drill.rounds.length - 1;

  function submitResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setResponses((list) => [
      ...list,
      { text: draft.trim(), took: formatDuration(Date.now() - startedAt) },
    ]);
    setChecks((list) => [...list, current.checklist.map(() => false)]);
    setDraft("");
    setPhase("review");
  }

  function toggleCheck(index: number) {
    setChecks((list) =>
      list.map((roundChecks, r) =>
        r === round ? roundChecks.map((value, i) => (i === index ? !value : value)) : roundChecks,
      ),
    );
  }

  function nextRound() {
    if (isLastRound) {
      setFinished(true);
      return;
    }
    setRound((value) => value + 1);
    setPhase("write");
    setStartedAt(Date.now());
  }

  function startOver() {
    setRound(0);
    setPhase("write");
    setFinished(false);
    setDraft("");
    setResponses([]);
    setChecks([]);
    setStartedAt(Date.now());
  }

  const headingClass =
    "text-[17px] font-extrabold text-[color:var(--ink)] focus:outline-none focus-visible:underline";

  return (
    <div className="flex flex-col gap-6">
      {binder && tab ? (
        <nav aria-label="Breadcrumb" className="text-sm text-[color:var(--ink-muted)]">
          <Link href={binder.href} className="underline-offset-[3px] hover:underline focus-ring">
            {binder.name}
          </Link>
          {" › "}
          <Link href={tab.href} className="underline-offset-[3px] hover:underline focus-ring">
            {tab.title}
          </Link>
          {" › "}
          <span aria-current="page" className="font-semibold text-[color:var(--ink)]">
            Practice
          </span>
        </nav>
      ) : null}

      <div className="border-b-4 border-[color:var(--binder)] pb-5">
        <h1 className="text-[clamp(1.9rem,3.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[color:var(--ink)]">
          Practice: {drill.title.charAt(0).toLowerCase() + drill.title.slice(1)}
        </h1>
        <p className="mt-2 max-w-[70ch] text-[17px] text-[color:var(--ink-muted)]">
          A safe place to rehearse before court. Nothing here is graded, and nothing goes on your
          training record.
        </p>
      </div>

      <ul
        aria-label="Before you start"
        className="flex flex-wrap gap-x-7 gap-y-2 rounded-[12px] bg-[color:var(--surface-sunken)] px-5 py-3.5 text-[14px] text-[color:var(--ink)]"
      >
        <li>
          <strong>Practice feedback, not legal advice.</strong>
        </li>
        <li>
          Use only the fictional facts below. <strong>Never type real client details.</strong>
        </li>
        <li>What you write is gone when you leave this page.</li>
        <li className="text-[color:var(--ink-muted)]">
          Prototype content, not yet reviewed by a subject-matter expert.
        </li>
      </ul>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-11">
        <div className="flex min-w-0 flex-col gap-5">
          <section
            aria-labelledby="case-file"
            className="rounded-[14px] border border-[color:var(--line-strong)] px-5 py-5"
          >
            <h2 id="case-file" className="text-[18px] font-extrabold text-[color:var(--ink)]">
              The case file{" "}
              <span className="text-[14px] font-medium text-[color:var(--ink-soft)]">
                · fictional
              </span>
            </h2>
            <dl className="mt-3 grid gap-x-4 gap-y-2.5 text-[15px] leading-relaxed sm:grid-cols-[9.5rem_minmax(0,1fr)]">
              <dt className="font-bold text-[color:var(--ink)]">Facts</dt>
              <dd className="text-[color:var(--ink-muted)]">{drill.facts}</dd>
              <dt className="font-bold text-[color:var(--ink)]">Challenged excerpt</dt>
              <dd>
                <mark className="rounded-[4px] bg-[color:var(--brand-tint)] px-1 text-[color:var(--ink)]">
                  {drill.excerpt}
                </mark>
              </dd>
            </dl>
          </section>

          {drill.rounds.slice(0, round + 1).map((roundData, r) => {
            const isCurrent = r === round && !finished;
            const response = responses[r];
            return (
              <section
                key={roundData.prompt}
                aria-label={`Round ${r + 1} of ${drill.rounds.length}`}
                className="flex flex-col gap-4"
              >
                <p className="mt-2 text-[13px] font-bold text-[color:var(--ink-muted)]">
                  Round {r + 1}
                </p>
                <SpeakerTurn round={roundData} />

                {isCurrent && phase === "write" ? (
                  <form
                    onSubmit={submitResponse}
                    className="rounded-[14px] border-2 border-[color:var(--ink)] px-5 py-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 ref={stepHeading} tabIndex={-1} className={headingClass}>
                        <label htmlFor={fieldId}>Your response</label>
                      </h2>
                      <span className="text-[13px] text-[color:var(--ink-muted)]">
                        Suggested time: {drill.suggestedMinutes} minutes
                      </span>
                    </div>
                    <textarea
                      id={fieldId}
                      rows={6}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={roundData.placeholder}
                      className="mt-2.5 w-full resize-y rounded-[10px] border-[1.5px] border-[color:var(--line-control)] bg-[color:var(--surface)] px-3.5 py-3 text-[16px] leading-relaxed text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)] focus-ring"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className="mt-3 inline-flex h-11 items-center rounded-[10px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
                    >
                      Submit response
                    </button>
                  </form>
                ) : null}

                {response ? <ResponseTurn text={response.text} took={response.took} /> : null}

                {isCurrent && phase === "review" ? (
                  <fieldset className="rounded-[14px] border-2 border-[color:var(--ink)] px-5 py-4">
                    <legend className="sr-only">Check your response</legend>
                    <h2 ref={stepHeading} tabIndex={-1} className={headingClass}>
                      Check your response against the course’s checklist
                    </h2>
                    <p className="mt-0.5 text-[14px] text-[color:var(--ink-muted)]">
                      Tick what your response did. Be honest with yourself; nobody else sees this.
                    </p>
                    <ul className="mt-3 flex flex-col gap-1">
                      {roundData.checklist.map((point, index) => {
                        const id = `${fieldId}-check-${r}-${index}`;
                        return (
                          <li key={point.question}>
                            <label
                              htmlFor={id}
                              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] px-2 text-[15px] text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)]"
                            >
                              <input
                                id={id}
                                type="checkbox"
                                checked={checks[r]?.[index] ?? false}
                                onChange={() => toggleCheck(index)}
                                className="h-5 w-5 shrink-0 accent-[color:var(--brand-fill)]"
                              />
                              {point.question}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setPhase("coached")}
                      className="mt-3 inline-flex h-11 items-center rounded-[10px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 focus-ring"
                    >
                      See coaching
                    </button>
                  </fieldset>
                ) : null}

                {response && (!isCurrent || phase === "coached") ? (
                  <>
                    <Coaching
                      round={roundData}
                      checked={checks[r] ?? []}
                      headingRef={isCurrent ? stepHeading : undefined}
                    />
                    {isCurrent ? (
                      <div>
                        <button
                          type="button"
                          onClick={nextRound}
                          className="inline-flex h-11 items-center rounded-[10px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 focus-ring"
                        >
                          {isLastRound ? "Finish" : "Answer the pushback"}
                        </button>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </section>
            );
          })}

          {finished ? (
            <section aria-labelledby="wrap-up" className="flex flex-col gap-5 pt-2">
              <h2
                id="wrap-up"
                ref={stepHeading}
                tabIndex={-1}
                className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)] focus:outline-none focus-visible:underline"
              >
                Compare with the sample analysis
              </h2>
              <p className="rounded-[12px] border border-[color:var(--line-strong)] px-5 py-4 text-[15px] leading-relaxed text-[color:var(--ink)]">
                {drill.sampleAnalysis}
                <span className="mt-2 block text-[13px] text-[color:var(--ink-soft)]">
                  From {drill.courseTitle}. Content to be reviewed by a legal subject-matter expert.
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startOver}
                  className="inline-flex h-11 items-center rounded-[10px] border-[1.5px] border-[color:var(--line-strong)] px-4 text-[15px] font-semibold text-[color:var(--ink)] hover:border-[color:var(--line-control)] focus-ring"
                >
                  Practice again
                </button>
                <a
                  href={drill.courseHref}
                  className="inline-flex h-11 items-center rounded-[10px] border-[1.5px] border-[color:var(--line-strong)] px-4 text-[15px] font-semibold text-[color:var(--ink)] hover:border-[color:var(--line-control)] focus-ring"
                >
                  Back to the lesson
                </a>
              </div>
              {tab ? <NotesPanel tabId={tab.id} tabTitle={tab.title} /> : null}
            </section>
          ) : null}
        </div>

        <aside className="flex min-w-0 flex-col gap-5 lg:self-start">
          <section
            aria-labelledby="progress-heading"
            className="rounded-[14px] border border-[color:var(--line)] px-5 py-4"
          >
            <h2 id="progress-heading" className="text-[16px] font-bold text-[color:var(--ink)]">
              {finished ? "All rounds done" : `Round ${round + 1} of ${drill.rounds.length}`}
            </h2>
            <ol className="mt-3 flex items-center gap-2" aria-hidden="true">
              {drill.rounds.map((roundData, r) => (
                <li key={roundData.prompt} className="flex flex-1 items-center gap-2">
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full ${
                      finished || r < round
                        ? "bg-[color:var(--ink)]"
                        : r === round
                          ? "bg-[color:var(--paper)] shadow-[0_0_0_4px_var(--binder)]"
                          : "border-2 border-[color:var(--line-control)]"
                    }`}
                  />
                  {r < drill.rounds.length - 1 ? (
                    <span className="h-0.5 flex-1 bg-[color:var(--line-strong)]" />
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="procedure-heading"
            className="rounded-[14px] border border-[color:var(--line)] px-5 py-4"
          >
            <h2 id="procedure-heading" className="text-[16px] font-bold text-[color:var(--ink)]">
              Procedure reference
            </h2>
            <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">From the course.</p>
            <ol className="mt-2.5 list-decimal pl-5 text-[14px] leading-relaxed text-[color:var(--ink)]">
              {drill.procedure.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 rounded-[8px] bg-[color:var(--brand-tint)] px-3.5 py-3 text-[14px] leading-relaxed text-[color:var(--brand-ink)]">
              {drill.draftingFrame}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
