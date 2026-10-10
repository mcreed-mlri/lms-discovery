// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";

import { BinderSectionView } from "@/components/binder-section-view";
import { BinderTopicView } from "@/components/binder-topic-view";
import { demoUser } from "@/lib/auth-constants";
import { findFiling, getBinder, getTopics, topicSlug } from "@/lib/binder";
import { getTabTopics } from "@/lib/binder-topics";
import { generateStaticParams } from "@/app/binder/[binder]/[tab]/[topic]/page";

vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: demoUser }) }));
vi.mock("@/components/studio-shell", () => ({
  StudioShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const litigation = getBinder("litigation")!;

test("topic slugs are URL-safe and never collide with the practice route", () => {
  expect(topicSlug("Oral Argument / Best Practice")).toBe("oral-argument-best-practice");
  expect(topicSlug("Witnesses & Experts")).toBe("witnesses-experts");
  const slugs = getTopics(litigation, "trial-skills").map((topic) => topic.id);
  expect(slugs).toContain("objections");
  expect(slugs).not.toContain("practice");
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("Hearsay sits under Objections, the one built topic in Trial", () => {
  const { built, planned } = getTabTopics(litigation, "trial-skills");
  expect(built.map((contents) => contents.topic.id)).toEqual(["objections"]);
  expect(built[0].topic.subTopics).toEqual(["Hearsay"]);
  expect(planned).toHaveLength(13);
  expect(findFiling("legal-skills-hearsay")?.topic.title).toBe("Objections");
});

test("only built topics get a page", () => {
  expect(generateStaticParams()).toEqual([
    { binder: "litigation", tab: "trial-skills", topic: "objections" },
  ]);
});

test("the Trial tab is an index: one open topic, the rest collapsed", () => {
  render(<BinderSectionView binderId="litigation" tabId="trial-skills" />);

  expect(screen.getByRole("heading", { level: 1, name: "Trial" })).toBeVisible();
  const objections = screen.getByRole("link", { name: /^Objections/ });
  expect(objections).toHaveAttribute("href", "/binder/litigation/trial-skills/objections");
  expect(objections).toHaveTextContent("Hearsay");
  expect(objections).toHaveTextContent("1 course · 1 drill · 2 references");
  expect(screen.getByText("13 more topics planned")).toBeVisible();
  // Planned topics are names, never links to empty pages.
  expect(screen.queryByRole("link", { name: "Discovery" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "‹ Case Prep" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Post-Trial ›" })).toBeVisible();
});

test("the Objections page puts quick reference before practice and the course", () => {
  render(<BinderTopicView binderId="litigation" tabId="trial-skills" topicId="objections" />);

  const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
  expect(headings.slice(0, 3)).toEqual(["Keep at hand", "Practice", "Courses"]);
  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
    "Litigation › Trial › Objections",
  );
  expect(screen.getByRole("textbox", { name: "Add a note to Objections" })).toBeVisible();
});
