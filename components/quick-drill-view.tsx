"use client";

import Link from "next/link";
import { useState } from "react";

import { SkillPageHeader } from "@/components/skill-page-header";
import { StudioShell } from "@/components/studio-shell";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTab, getTopic } from "@/lib/binder";
import { useSkillProgress } from "@/lib/skill-progress";
import { getSkillPath, skillHref } from "@/lib/skill-paths";

const answerButton =
  "flex min-h-[52px] flex-1 basis-48 items-center justify-center rounded-[10px] border-[1.5px] border-[color:var(--ink)] bg-[color:var(--surface)] px-4 text-[17px] font-extrabold text-[color:var(--ink)] transition hover:bg-[color:var(--hover-tint)] disabled:cursor-not-allowed disabled:opacity-60 focus-ring";
const solidButton =
  "inline-flex min-h-11 items-center rounded-[8px] bg-[color:var(--solid-bg)] px-5 text-[15px] font-bold text-[color:var(--solid-ink)] transition hover:opacity-90 focus-ring";

/**
 * A quick drill: short items, an answer each, instant feedback with the reason.
 * Items missed in a round come back at the end, until all are right; the
 * first-try score is kept as the learner's best.
 */
export function QuickDrillView({ pathId, drillId }: { pathId: string; drillId: string }) {
  const { user } = useAuth();
  const path = getSkillPath(pathId);
  const drill = path?.drills.find((d) => d.id === drillId);
  const progress = useSkillProgress(user?.id, pathId);
  const allIndexes = drill?.items.map((_, i) => i) ?? [];
  const [queue, setQueue] = useState<number[]>(allIndexes);
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState<number | null>(null);
  const [round, setRound] = useState(1);

  if (!path || !drill) return null;
  const binder = getBinder(path.binderId);
  const tab = binder ? getSectionTab(binder, path.tabId) : undefined;
  const topic = binder && tab ? getTopic(binder, tab.id, path.topicId) : undefined;
  if (!binder || !tab || !topic) return null;

  const done = position >= queue.length;
  const item = done ? undefined : drill.items[queue[position]];
  const right = item !== undefined && answer !== null && answer === item.hearsay;

  function choose(value: boolean) {
    if (!item || answer !== null) return;
    setAnswer(value);
    if (value !== item.hearsay) setMissed((list) => [...list, queue[position]]);
  }

  function next() {
    setAnswer(null);
    const nextPosition = position + 1;
    setPosition(nextPosition);
    if (nextPosition >= queue.length && round === 1 && drill) {
      const score = drill.items.length - missed.length;
      setFirstTry(score);
      progress.recordDrill(drill.id, score);
    }
  }

  function retryMissed() {
    setQueue(missed);
    setMissed([]);
    setPosition(0);
    setRound((r) => r + 1);
  }

  function restart() {
    setQueue(allIndexes);
    setMissed([]);
    setPosition(0);
    setRound(1);
    setFirstTry(null);
  }

  return (
    <StudioShell>
      <div className="flex max-w-[48rem] flex-col gap-6">
        <SkillPageHeader
          crumbs={[
            { label: binder.name, href: binder.href },
            { label: tab.label, href: tab.href },
            { label: topic.title, href: topic.href },
            { label: path.title, href: skillHref(path) },
            { label: "Quick drill" },
          ]}
          title={drill.title}
          marker={
            done
              ? undefined
              : `${round > 1 ? "Missed ones · " : ""}Item ${position + 1} of ${queue.length}`
          }
        >
          {drill.summary}
        </SkillPageHeader>

        <div aria-hidden="true" className="flex gap-1">
          {queue.map((index, i) => (
            <span
              key={`${round}-${index}`}
              className={`h-1.5 flex-1 rounded-full ${
                i < position || (i === position && answer !== null)
                  ? "bg-[color:var(--ink)]"
                  : i === position
                    ? "bg-[color:var(--binder)]"
                    : "bg-[color:var(--line)]"
              }`}
            />
          ))}
        </div>

        {item ? (
          <section
            aria-labelledby="drill-item"
            className="rounded-[14px] border-[1.5px] border-[color:var(--ink)] px-6 py-5"
          >
            <p className="text-[12px] font-bold tracking-[0.04em] text-[color:var(--ink-muted)]">
              {item.setting.toUpperCase()}
            </p>
            <h2
              id="drill-item"
              className="mt-2 text-[21px] font-extrabold leading-snug text-[color:var(--ink)]"
            >
              {item.text}
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => choose(true)}
                disabled={answer !== null}
                className={answerButton}
              >
                Hearsay
              </button>
              <button
                type="button"
                onClick={() => choose(false)}
                disabled={answer !== null}
                className={answerButton}
              >
                Not hearsay
              </button>
            </div>
            <div aria-live="polite">
              {answer !== null ? (
                <div
                  className={`mt-4 rounded-[10px] px-4 py-3.5 ${
                    right ? "bg-[color:var(--hue-3-tint)]" : "bg-[color:var(--status-changed-soft)]"
                  }`}
                >
                  <p
                    className={`text-[16px] font-extrabold ${
                      right
                        ? "text-[color:var(--hue-3-ink)]"
                        : "text-[color:var(--status-changed-ink)]"
                    }`}
                  >
                    {right
                      ? "Right."
                      : item.hearsay
                        ? "Not quite: this is hearsay."
                        : "Not quite: this is not hearsay."}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[color:var(--ink)]">
                    {item.why}
                  </p>
                </div>
              ) : null}
            </div>
            {answer !== null ? (
              <button type="button" onClick={next} className={`${solidButton} mt-4`}>
                {position + 1 < queue.length ? "Next item" : "See how you did"}
              </button>
            ) : null}
          </section>
        ) : (
          <section
            aria-labelledby="drill-done"
            className="rounded-[14px] border-[1.5px] border-[color:var(--ink)] px-6 py-5"
          >
            <h2 id="drill-done" className="text-[21px] font-extrabold text-[color:var(--ink)]">
              {missed.length === 0 ? "All right." : `${missed.length} to try again`}
            </h2>
            {firstTry !== null ? (
              <p className="mt-1 text-[15px] text-[color:var(--ink-muted)]">
                First try: {firstTry} of {drill.items.length}.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              {missed.length > 0 ? (
                <button type="button" onClick={retryMissed} className={solidButton}>
                  Try the ones you missed
                </button>
              ) : (
                <button type="button" onClick={restart} className={solidButton}>
                  Start again
                </button>
              )}
              <Link
                href={skillHref(path)}
                className="inline-flex min-h-11 items-center px-3 text-[15px] font-bold text-[color:var(--ink)] underline-offset-[3px] hover:underline focus-ring"
              >
                Back to levels
              </Link>
            </div>
          </section>
        )}
        <p className="text-[13px] text-[color:var(--ink-soft)]">
          Prototype content, not yet reviewed by a subject-matter expert.
        </p>
      </div>
    </StudioShell>
  );
}
