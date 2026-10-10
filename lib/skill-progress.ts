"use client";

import { useCallback, useEffect, useState } from "react";

import type { StepKind } from "@/lib/skill-paths";

/* Where a learner is on each skill path: which level steps are done, and their
   best quick-drill score. Like notes (lib/notes.ts) it lives in localStorage,
   keyed by user id, so it stays on this device and a second person on a shared
   computer does not see the first person's progress. It is practice, not a
   training record: Brightspace stays the system of record. */

type PathProgress = { done: string[]; best: Record<string, number> };
type Store = Record<string, PathProgress>;

const KEY_PREFIX = "lace-skill-progress:";
const EVENT = "lace-skill-progress";

function stepKey(level: number, step: StepKind) {
  return `${level}-${step}`;
}

function read(userId: string): Store {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return typeof parsed === "object" && parsed !== null ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(userId: string, store: Store) {
  try {
    localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(store));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage unavailable: progress lasts for this visit only.
  }
}

function pathOf(store: Store, pathId: string): PathProgress {
  const entry = store[pathId];
  return {
    done: Array.isArray(entry?.done) ? entry.done.filter((d) => typeof d === "string") : [],
    best: entry?.best && typeof entry.best === "object" ? entry.best : {},
  };
}

/** Progress on one skill path, plus ways to record it. */
export function useSkillProgress(userId: string | undefined, pathId: string) {
  const [progress, setProgress] = useState<PathProgress>({ done: [], best: {} });

  useEffect(() => {
    if (!userId) return;
    const load = () => setProgress(pathOf(read(userId), pathId));
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [userId, pathId]);

  const markDone = useCallback(
    (level: number, step: StepKind) => {
      if (!userId) return;
      const store = read(userId);
      const current = pathOf(store, pathId);
      const key = stepKey(level, step);
      if (current.done.includes(key)) return;
      write(userId, { ...store, [pathId]: { ...current, done: [...current.done, key] } });
    },
    [userId, pathId],
  );

  const recordDrill = useCallback(
    (drillId: string, score: number) => {
      if (!userId) return;
      const store = read(userId);
      const current = pathOf(store, pathId);
      if ((current.best[drillId] ?? -1) >= score) return;
      write(userId, {
        ...store,
        [pathId]: { ...current, best: { ...current.best, [drillId]: score } },
      });
    },
    [userId, pathId],
  );

  return {
    isDone: (level: number, step: StepKind) => progress.done.includes(stepKey(level, step)),
    bestScore: (drillId: string): number | undefined => progress.best[drillId],
    markDone,
    recordDrill,
  };
}
