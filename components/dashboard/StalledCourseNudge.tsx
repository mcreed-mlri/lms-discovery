"use client";

import { useState } from "react";
import { getLearningUrlForDashboardCourse } from "@/lib/data";
import { submitFeedback, type FeedbackFlag, type PromptResolution } from "@/lib/feedback-prompts";
import type { LearnerCourse } from "@/types/dashboard";

/* Stalled-course nudge: a course is in progress but untouched for 14+ days.
   One quiet inline card — resume, say what's in the way, or dismiss forever.
   The reasons are the abandonment metric completion rates can't give us
   (metrics framework, Perception layer); "need help" is a support request
   that surfaces in the Brightspace Manager needs-attention view. */

const REASONS: { flag: FeedbackFlag; label: string }[] = [
  { flag: "too_busy", label: "Too busy right now" },
  { flag: "too_long", label: "It's longer than I expected" },
  { flag: "not_relevant", label: "Not relevant to my work anymore" },
  { flag: "need_help", label: "I'm stuck and could use help" },
];

export function StalledCourseNudge({
  course,
  onResolved,
}: {
  course: LearnerCourse;
  onResolved: (action: PromptResolution) => void;
}) {
  const [showReasons, setShowReasons] = useState(false);
  const [sentFlag, setSentFlag] = useState<FeedbackFlag | null>(null);

  async function handleReason(flag: FeedbackFlag) {
    if (sentFlag) return;
    setSentFlag(flag);
    await submitFeedback({ courseOfferingId: course.offeringId, flag });
    setTimeout(() => onResolved("submitted"), 2200);
  }

  if (sentFlag) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-4" role="status">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {sentFlag === "need_help"
            ? "Got it — someone from the program team will check in."
            : "Thanks — that helps us make trainings fit real caseloads."}
        </p>
      </div>
    );
  }

  return (
    <div className="editorial-panel rounded-[var(--radius-card)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="stat-label text-[color:var(--ink-soft)]">Checking in</p>
          <h3 className="section-title mt-1 text-[17px] text-[color:var(--ink)]">
            Still working on “{course.title}”?
          </h3>
          <p className="mt-1 text-[13px] font-medium text-[color:var(--ink-muted)]">
            No pressure — pick up where you left off, or tell us what&rsquo;s in the way.
          </p>
        </div>
        <button
          type="button"
          className="metadata shrink-0 text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)]"
          onClick={() => onResolved("dismissed")}
          aria-label="Dismiss — don't ask about this course again"
        >
          Dismiss
        </button>
      </div>
      {showReasons ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {REASONS.map((reason) => (
            <button
              key={reason.flag}
              type="button"
              className="inline-flex h-8 items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--line-strong)] focus-ring"
              onClick={() => handleReason(reason.flag)}
            >
              {reason.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={getLearningUrlForDashboardCourse(course)}
            className="inline-flex h-9 items-center rounded-[10px] bg-[color:var(--ink)] px-4 text-xs font-bold text-[color:var(--surface)] transition hover:opacity-90 focus-ring"
            onClick={() => onResolved("resumed")}
          >
            Resume course
          </a>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--line-strong)] focus-ring"
            onClick={() => setShowReasons(true)}
          >
            Something&rsquo;s in the way
          </button>
        </div>
      )}
    </div>
  );
}
