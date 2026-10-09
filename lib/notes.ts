"use client";

import { useEffect, useState } from "react";

/* Private notes an advocate keeps in a binder tab: "My notes". They live in
   localStorage, so they stay on this device and in this browser, and they are
   keyed by user id so a second person signing in on a shared office computer
   does not see the first person's notes. When notes need to follow someone
   across devices they move to the server (PRODUCT.md, "Not built yet"). */

export type Note = {
  id: string;
  /** The binder tab this note is filed under, e.g. "trial-skills". */
  tabId: string;
  text: string;
  /** ISO timestamp. */
  createdAt: string;
};

const KEY_PREFIX = "lace-notes:";

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  const note = value as Record<string, unknown>;
  return (
    typeof note.id === "string" &&
    typeof note.tabId === "string" &&
    typeof note.text === "string" &&
    typeof note.createdAt === "string"
  );
}

function readNotes(userId: string): Note[] {
  try {
    const stored = localStorage.getItem(KEY_PREFIX + userId);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isNote) : [];
  } catch {
    // Unavailable or malformed storage: start empty rather than break the page.
    return [];
  }
}

function writeNotes(userId: string, notes: Note[]) {
  try {
    localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(notes));
  } catch {
    // A failed write leaves the notes in memory for this visit only.
  }
}

/** Notes for one tab, newest first, plus add and delete. */
export function useTabNotes(userId: string | undefined, tabId: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!userId) return;
    setNotes(readNotes(userId));
  }, [userId]);

  function addNote(text: string) {
    const trimmed = text.trim();
    if (!userId || !trimmed) return;
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tabId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    // Re-read first, so a note saved in another tab of the browser survives.
    const next = [note, ...readNotes(userId)];
    writeNotes(userId, next);
    setNotes(next);
  }

  function deleteNote(id: string) {
    if (!userId) return;
    const next = readNotes(userId).filter((note) => note.id !== id);
    writeNotes(userId, next);
    setNotes(next);
  }

  return {
    notes: notes.filter((note) => note.tabId === tabId),
    addNote,
    deleteNote,
  };
}
