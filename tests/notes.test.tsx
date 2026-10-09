// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";

import { useTabNotes } from "@/lib/notes";

beforeEach(() => {
  localStorage.clear();
});

test("a saved note shows on its own tab and nowhere else", () => {
  const trial = renderHook(() => useTabNotes("sarah", "trial-skills"));
  act(() => trial.result.current.addNote("  Ask about remote testimony  "));
  expect(trial.result.current.notes.map((n) => n.text)).toEqual(["Ask about remote testimony"]);

  const ethics = renderHook(() => useTabNotes("sarah", "ethics"));
  expect(ethics.result.current.notes).toEqual([]);
});

test("notes are private to the person who wrote them", () => {
  const sarah = renderHook(() => useTabNotes("sarah", "trial-skills"));
  act(() => sarah.result.current.addNote("Sarah's note"));

  const kate = renderHook(() => useTabNotes("kate", "trial-skills"));
  expect(kate.result.current.notes).toEqual([]);
});

test("notes survive a reload, newest first, and delete removes one", () => {
  const first = renderHook(() => useTabNotes("sarah", "trial-skills"));
  act(() => first.result.current.addNote("older"));
  act(() => first.result.current.addNote("newer"));

  const reloaded = renderHook(() => useTabNotes("sarah", "trial-skills"));
  expect(reloaded.result.current.notes.map((n) => n.text)).toEqual(["newer", "older"]);

  const older = reloaded.result.current.notes[1];
  act(() => reloaded.result.current.deleteNote(older.id));
  expect(reloaded.result.current.notes.map((n) => n.text)).toEqual(["newer"]);
});

test("blank notes are not saved, and malformed storage starts empty", () => {
  localStorage.setItem("lace-notes:sarah", "{not json");
  const { result } = renderHook(() => useTabNotes("sarah", "trial-skills"));
  expect(result.current.notes).toEqual([]);

  act(() => result.current.addNote("   "));
  expect(result.current.notes).toEqual([]);
});

test("nothing is saved before the user is known", () => {
  const { result } = renderHook(() => useTabNotes(undefined, "trial-skills"));
  act(() => result.current.addNote("too early"));
  expect(result.current.notes).toEqual([]);
  expect(localStorage.length).toBe(0);
});
