"use client";

import { useEffect, useState } from "react";

/* In-hub micro-survey plumbing: which feedback prompts (post-completion rating
   card, stalled-course nudge) a learner has already answered or dismissed.

   Anti-annoyance rules live here and in LearnerDashboardView:
   - at most ONE prompt is visible per session (the view renders one card);
   - resolving a prompt (submit, dismiss, or resume) is PERMANENT for that
     course — stored under `lace-feedback-prompts`, same localStorage pattern
     as lib/saved-learning.ts. Moves to a `feedback_prompts` server table when
     real identity lands. */

const STORAGE_KEY = "lace-feedback-prompts";

/* A course counts as stalled when in progress but untouched this long. Mirrors
   the "resume rate after idle" window in the metrics framework. */
export const STALLED_AFTER_DAYS = 14;

export type FeedbackPromptKind = "rating" | "stalled";
export type PromptResolution = "submitted" | "dismissed" | "resumed";

type ResolvedMap = Record<string, { action: PromptResolution; at: string }>;

function promptKey(kind: FeedbackPromptKind, offeringId: string) {
  return `${kind}:${offeringId}`;
}

export function useFeedbackPrompts() {
  const [resolved, setResolved] = useState<ResolvedMap>({});
  /* Prompts render only after hydration so a card never flashes in and
     disappears when storage says it was already dismissed. */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setResolved(JSON.parse(stored));
    } catch {
      // keep the demo resilient if storage is unavailable or malformed
    }
    setHydrated(true);
  }, []);

  function resolvePrompt(
    kind: FeedbackPromptKind,
    offeringId: string,
    action: PromptResolution,
  ) {
    const next: ResolvedMap = {
      ...resolved,
      [promptKey(kind, offeringId)]: { action, at: new Date().toISOString() },
    };
    setResolved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage write failures in the demo shell
    }
  }

  function isResolved(kind: FeedbackPromptKind, offeringId: string) {
    return promptKey(kind, offeringId) in resolved;
  }

  return { hydrated, isResolved, resolvePrompt };
}

export type FeedbackFlag =
  | "outdated"
  | "unclear"
  | "not_relevant"
  | "too_busy"
  | "too_long"
  | "need_help";

/* Fire-and-forget: feedback must never block or break the dashboard. The
   route degrades to 202 (accepted, not stored) until the Supabase feedback
   table is live, so callers treat any response as success. */
export async function submitFeedback(payload: {
  courseOfferingId: string;
  rating?: number;
  flag?: FeedbackFlag;
  notes?: string;
}): Promise<void> {
  try {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // swallow — the learner already gave the signal; losing one row in demo
    // mode beats surfacing an error over a courtesy prompt
  }
}
