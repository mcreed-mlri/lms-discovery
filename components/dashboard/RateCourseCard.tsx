"use client";

import { useState } from "react";
import { submitFeedback, type PromptResolution } from "@/lib/feedback-prompts";
import type { LearnerCourse } from "@/types/dashboard";

/* Post-completion micro-survey: one question, one optional comment. Renders as
   a quiet inline card on the dashboard when a course flips to completed —
   never a modal, never blocks anything, and once answered or dismissed it is
   gone for good (see lib/feedback-prompts.ts). Feeds the usefulness metric in
   the LACE metrics framework via POST /api/feedback. */

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "var(--brand-fill)" : "none"}
      stroke={filled ? "var(--brand-fill)" : "var(--ink-soft)"}
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2.5 2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5-4.7-4.6 6.6-1z" />
    </svg>
  );
}

export function RateCourseCard({
  course,
  onResolved,
}: {
  course: LearnerCourse;
  onResolved: (action: PromptResolution) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!rating || sent) return;
    setSent(true);
    await submitFeedback({
      courseOfferingId: course.offeringId,
      rating,
      notes: notes.trim() || undefined,
    });
    setTimeout(() => onResolved("submitted"), 1600);
  }

  if (sent) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-4" role="status">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          Thanks — this helps us keep courses worth your time.
        </p>
      </div>
    );
  }

  return (
    <div className="editorial-panel rounded-[var(--radius-card)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="stat-label text-[color:var(--ink-soft)]">You finished a course</p>
          <h3 className="section-title mt-1 text-[1.05rem] text-[color:var(--ink)]">
            How useful was “{course.title}”?
          </h3>
        </div>
        <button
          type="button"
          className="metadata shrink-0 text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)]"
          onClick={() => onResolved("dismissed")}
          aria-label="Dismiss — don't ask about this course again"
        >
          No thanks
        </button>
      </div>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rate 1 to 5">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} of 5`}
            className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-[#2a5bff]/30"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
          >
            <Star filled={value <= (hovered || rating)} />
          </button>
        ))}
      </div>
      {rating > 0 ? (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <textarea
            className="min-h-[2.5rem] flex-1 resize-y rounded-[10px] border border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] px-3 py-2 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[#2a5bff]/20"
            rows={1}
            maxLength={600}
            placeholder="Anything we should change? (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-[10px] bg-[color:var(--ink)] px-4 text-xs font-bold text-[color:var(--surface)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      ) : null}
    </div>
  );
}
