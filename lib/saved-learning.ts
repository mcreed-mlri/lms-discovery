"use client";

import { useEffect, useMemo, useState } from "react";
import type { LearningItem } from "@/lib/data";

const STORAGE_KEY = "lace-saved-learning";

export function getSavedItemKey(item: LearningItem) {
  return `${item.type}:${item.id}`;
}

export function useSavedLearning() {
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedKeys(JSON.parse(stored));
    } catch {
      // keep the demo resilient if storage is unavailable or malformed
    }
  }, []);

  function persist(nextKeys: string[]) {
    setSavedKeys(nextKeys);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextKeys));
    } catch {
      // ignore storage write failures in the demo shell
    }
  }

  function toggleSaved(item: LearningItem) {
    const key = getSavedItemKey(item);
    persist(savedKeys.includes(key) ? savedKeys.filter((entry) => entry !== key) : [...savedKeys, key]);
  }

  function isSaved(item: LearningItem) {
    return savedKeys.includes(getSavedItemKey(item));
  }

  const savedKeySet = useMemo(() => new Set(savedKeys), [savedKeys]);

  return { savedKeys, savedKeySet, isSaved, toggleSaved };
}
