// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { SearchBox } from "@/components/search-box";
import { searchBinders, type BinderHit } from "@/lib/binder-search";
import { getLearningItems } from "@/lib/data";
import { searchLearningItems } from "@/lib/search";

const eligible = new Set(["legal-skills-hearsay"]);
const titles = (query: string, ids = eligible) =>
  searchBinders(query, ids).map((hit) => `${hit.kind}: ${hit.title}`);

test("a hearsay objection search leads with the quick answer, then practice, then the lesson", () => {
  expect(titles("hearsay objection").slice(0, 3)).toEqual([
    "Reference: Procedure: answering a hearsay objection in writing",
    "Practice: Answer a hearsay objection in writing",
    "Lesson: Defending against a hearsay objection in writing",
  ]);
});

test("hits say where they are filed and go straight there", () => {
  const [procedure] = searchBinders("hearsay objection", eligible);
  expect(procedure.context).toBe("Litigation › Trial › Objections");
  expect(procedure.href).toMatch(/defending-hearsay-objection-writing\.html#procedure$/);

  const topic = searchBinders("objections", eligible).find((hit) => hit.kind === "Topic");
  expect(topic?.href).toBe("/binder/litigation/trial-skills/objections");
});

test("the common misspelling still finds hearsay", () => {
  expect(titles("heresay").length).toBeGreaterThan(0);
});

test("nothing from a course the user cannot open, only the topic page", () => {
  expect(titles("hearsay", new Set())).toEqual(["Topic: Objections"]);
});

test("unrelated searches return no binder hits", () => {
  expect(titles("notice to quit")).toEqual([]);
});

function Harness({ onBinder }: { onBinder: (hit: BinderHit) => void }) {
  const [value, setValue] = useState("");
  return (
    <SearchBox
      value={value}
      onChange={setValue}
      suggestions={value ? searchLearningItems(getLearningItems(), value).slice(0, 2) : []}
      binderHits={value ? searchBinders(value, eligible) : []}
      onSelectBinderHit={onBinder}
    />
  );
}

test("binder hits come first in one keyboard list, grouped apart from the library", async () => {
  const onBinder = vi.fn();
  const user = userEvent.setup();
  render(<Harness onBinder={onBinder} />);

  await user.type(screen.getByRole("combobox"), "hearsay objection");
  expect(screen.getByRole("group", { name: "In your binders" })).toBeVisible();
  expect(screen.getByRole("group", { name: "Library" })).toBeVisible();

  await user.keyboard("{ArrowDown}{Enter}");
  expect(onBinder).toHaveBeenCalledWith(
    expect.objectContaining({ kind: "Practice", title: "Answer a hearsay objection in writing" }),
  );
});
