// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { BinderTabs } from "@/components/binder-tabs";

let pathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  pathname = "/";
});

test("on a binder tab, that divider is open and nothing is marked left off", () => {
  pathname = "/binder/litigation/trial-skills";
  render(<BinderTabs />);

  expect(screen.getByRole("link", { name: "Trial" })).toHaveAttribute("aria-current", "page");
  expect(document.querySelector(".binder-tab-marker")).toBeNull();
  expect(localStorage.getItem("lace-open-tab")).toBe("trial-skills");
});

test("off the binder, the divider left off on is marked and none is open", async () => {
  localStorage.setItem("lace-open-binder", "litigation");
  localStorage.setItem("lace-open-tab", "trial-skills");
  render(<BinderTabs />);

  const trial = await screen.findByRole("link", { name: "Trial, where you left off" });
  expect(trial.querySelector(".binder-tab-marker")).not.toBeNull();
  expect(trial).not.toHaveAttribute("aria-current");
  expect(trial).toHaveClass("binder-tab-left-off");
  expect(screen.getAllByRole("link").filter((link) => link.hasAttribute("aria-current"))).toEqual(
    [],
  );
});

test("a remembered tab from another binder is ignored", async () => {
  localStorage.setItem("lace-open-binder", "practice-foundations");
  localStorage.setItem("lace-open-tab", "trial-skills");
  render(<BinderTabs />);

  expect(await screen.findByRole("link", { name: "Ethics" })).toBeVisible();
  expect(document.querySelector(".binder-tab-marker")).toBeNull();
});
