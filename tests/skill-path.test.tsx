// @vitest-environment jsdom
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { QuickDrillView } from "@/components/quick-drill-view";
import { SkillPathView } from "@/components/skill-path-view";
import { SkillStepView } from "@/components/skill-step-view";
import { demoUser } from "@/lib/auth-constants";
import { getDrill } from "@/lib/practice";
import {
  builtSteps,
  findSoloLevel,
  getSkillPath,
  getSkillPathsForTopic,
  skillHref,
  stepHref,
} from "@/lib/skill-paths";
import { useSkillProgress } from "@/lib/skill-progress";

const push = vi.fn();
vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: demoUser }) }));
vi.mock("@/components/studio-shell", () => ({
  StudioShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

beforeEach(() => {
  localStorage.clear();
  push.mockClear();
});

const hearsay = getSkillPath("hearsay")!;
const level1 = hearsay.levels[0];

test("the Hearsay path is filed under Objections and level 1 is fully built", () => {
  expect(getSkillPathsForTopic("trial-skills", "objections").map((p) => p.id)).toEqual(["hearsay"]);
  expect(skillHref(hearsay)).toBe("/binder/litigation/trial-skills/objections/hearsay");
  expect(builtSteps(level1)).toEqual(["watch", "help", "solo"]);
  expect(hearsay.levels.slice(1).every((level) => builtSteps(level).length === 0)).toBe(true);
});

test("Solo is the existing practice room, and finishing it belongs to level 1", () => {
  expect(getDrill(level1.soloDrillId!)).toBeDefined();
  expect(stepHref(hearsay, level1, "solo")).toBe(
    "/binder/litigation/trial-skills/practice/hearsay-objection-in-writing",
  );
  expect(stepHref(hearsay, level1, "watch")).toBe(
    "/binder/litigation/trial-skills/objections/hearsay/level-1/watch",
  );
  expect(findSoloLevel("hearsay-objection-in-writing")?.level.n).toBe(1);
});

test("progress is kept per user and survives a reload", () => {
  const first = renderHook(() => useSkillProgress("sarah", "hearsay"));
  act(() => first.result.current.markDone(1, "watch"));
  expect(first.result.current.isDone(1, "watch")).toBe(true);

  const reloaded = renderHook(() => useSkillProgress("sarah", "hearsay"));
  expect(reloaded.result.current.isDone(1, "watch")).toBe(true);
  const someoneElse = renderHook(() => useSkillProgress("kate", "hearsay"));
  expect(someoneElse.result.current.isDone(1, "watch")).toBe(false);
});

test("the best drill score only goes up", () => {
  const { result } = renderHook(() => useSkillProgress("sarah", "hearsay"));
  act(() => result.current.recordDrill("hearsay-or-not", 4));
  act(() => result.current.recordDrill("hearsay-or-not", 2));
  expect(result.current.bestScore("hearsay-or-not")).toBe(4);
});

test("the level map marks the next step and shows unbuilt levels as coming", () => {
  localStorage.setItem(
    `lace-skill-progress:${demoUser.id}`,
    JSON.stringify({ hearsay: { done: ["1-watch"], best: {} } }),
  );
  render(<SkillPathView pathId="hearsay" />);

  expect(screen.getByRole("heading", { level: 1, name: "Hearsay" })).toBeVisible();
  expect(screen.getByRole("link", { name: /^Watch, done:/ })).toBeVisible();
  expect(screen.getByRole("link", { name: /^Help, next:/ })).toHaveAttribute(
    "href",
    "/binder/litigation/trial-skills/objections/hearsay/level-1/help",
  );
  expect(screen.getAllByText(/· coming/)).toHaveLength(9);
  expect(screen.getByRole("link", { name: /Hearsay or not\?/ })).toHaveTextContent("Not tried");
});

test("Watch explains whichever sentence is chosen, then moves on to Help", async () => {
  const user = userEvent.setup();
  render(<SkillStepView pathId="hearsay" levelNumber={1} step="watch" />);

  expect(screen.getByText("SENTENCE 1 · STEP 1: NAME THE STATEMENT")).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: /offered to show that the client reported/ }),
  );
  expect(screen.getByText("SENTENCE 2 · STEP 2: STATE THE PURPOSE")).toBeVisible();

  await user.click(screen.getByRole("button", { name: "Next: finish one with help" }));
  expect(push).toHaveBeenCalledWith(
    "/binder/litigation/trial-skills/objections/hearsay/level-1/help",
  );
  const { result } = renderHook(() => useSkillProgress(demoUser.id, "hearsay"));
  expect(result.current.isDone(1, "watch")).toBe(true);
});

test("Help gives limited hints, then shows the expert's steps and a self-check", async () => {
  const user = userEvent.setup();
  render(<SkillStepView pathId="hearsay" levelNumber={1} step="help" />);

  const check = screen.getByRole("button", { name: "Check against the expert" });
  expect(check).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Show a hint · 2 left" }));
  await user.click(screen.getByRole("button", { name: "Show a hint · 1 left" }));
  expect(screen.getByRole("button", { name: "No hints left" })).toBeDisabled();

  await user.type(
    screen.getByRole("textbox", { name: /Step 4/ }),
    "Alternatively, it is a business record.",
  );
  await user.click(check);
  expect(screen.getAllByText("What the expert wrote")).toHaveLength(3);
  expect(screen.getByRole("checkbox", { name: /Did step 4 name an exception/ })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Check your own answer" })).toHaveFocus();
  expect(screen.getByRole("link", { name: "Next: do it solo" })).toHaveAttribute(
    "href",
    "/binder/litigation/trial-skills/practice/hearsay-objection-in-writing",
  );
});

test("the quick drill gives instant feedback and brings back the ones missed", async () => {
  const user = userEvent.setup();
  render(<QuickDrillView pathId="hearsay" drillId="hearsay-or-not" />);
  const items = hearsay.drills[0].items;

  for (let i = 0; i < items.length; i += 1) {
    // Get the first one wrong, the rest right.
    const correct = items[i].hearsay ? "Hearsay" : "Not hearsay";
    const wrong = items[i].hearsay ? "Not hearsay" : "Hearsay";
    await user.click(screen.getByRole("button", { name: i === 0 ? wrong : correct }));
    expect(screen.getByText(i === 0 ? /Not quite/ : "Right.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Next item|See how you did/ }));
  }

  expect(screen.getByRole("heading", { name: "1 to try again" })).toBeVisible();
  expect(screen.getByText(`First try: ${items.length - 1} of ${items.length}.`)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Try the ones you missed" }));
  expect(screen.getByRole("heading", { name: items[0].text })).toBeVisible();

  const { result } = renderHook(() => useSkillProgress(demoUser.id, "hearsay"));
  expect(result.current.bestScore("hearsay-or-not")).toBe(items.length - 1);
});
