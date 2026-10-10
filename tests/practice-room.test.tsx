// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { PracticeRoom } from "@/components/practice-room";
import { getDrill, getDrillsForTab, drillHref } from "@/lib/practice";

vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: { id: "sarah" } }) }));

const drill = getDrill("hearsay-objection-in-writing");

test("the drill is filed under the Trial tab of Litigation", () => {
  expect(drill).toBeDefined();
  expect(getDrillsForTab("trial-skills").map((d) => d.id)).toEqual([
    "hearsay-objection-in-writing",
  ]);
  if (drill) {
    expect(drillHref(drill)).toBe(
      "/binder/litigation/trial-skills/practice/hearsay-objection-in-writing",
    );
  }
});

test("unchecked points get the course's coaching; checked ones say done", () => {
  if (!drill) throw new Error("drill missing");
  render(<PracticeRoom drill={drill} />);

  expect(screen.getByRole("button", { name: "Submit response" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: "Your response" }), {
    target: { value: "Offered to show notice." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit response" }));

  fireEvent.click(screen.getByRole("checkbox", { name: /identify the challenged statement/ }));
  fireEvent.click(screen.getByRole("button", { name: "See coaching" }));

  // Focus moves to a heading the learner can see, not a hidden one.
  expect(screen.getByRole("heading", { name: "Coaching" })).toHaveFocus();
  expect(screen.getByText("Named the challenged statement")).toBeVisible();
  expect(screen.getAllByText("Done")).toHaveLength(1);
  expect(screen.getAllByText("To work on")).toHaveLength(4);
  expect(screen.getByText(/End with the request\./)).toBeVisible();
  expect(screen.getByText("Offered to show notice.")).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Answer the pushback" }));
  expect(screen.getByText(/prototype prompt, not yet reviewed/)).toBeVisible();
  expect(screen.getByRole("textbox", { name: "Your response" })).toHaveValue("");
});

test("finishing shows the sample analysis and starting over clears everything", () => {
  if (!drill) throw new Error("drill missing");
  render(<PracticeRoom drill={drill} />);
  for (const text of ["First answer.", "Second answer."]) {
    fireEvent.change(screen.getByRole("textbox", { name: "Your response" }), {
      target: { value: text },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit response" }));
    fireEvent.click(screen.getByRole("button", { name: "See coaching" }));
    fireEvent.click(screen.getByRole("button", { name: /Answer the pushback|Finish/ }));
  }
  expect(screen.getByRole("heading", { name: "Compare with the sample analysis" })).toHaveFocus();
  expect(screen.getByText("All rounds done")).toBeVisible();

  fireEvent.click(screen.getByRole("button", { name: "Practice again" }));
  expect(screen.queryByText("First answer.")).not.toBeInTheDocument();
  expect(screen.getByText("Round 1 of 2")).toBeVisible();
});
