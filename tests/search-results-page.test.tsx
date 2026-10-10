// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { SearchBox } from "@/components/search-box";
import { SearchResultsView } from "@/components/search-results-view";
import { demoUser } from "@/lib/auth-constants";
import { searchBinders } from "@/lib/binder-search";
import { searchHref } from "@/lib/search-results";

vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: demoUser }) }));
vi.mock("@/components/studio-shell", () => ({
  StudioShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

test("the results address carries the query and, from a binder, its scope", () => {
  expect(searchHref("hearsay objection")).toBe("/search?q=hearsay+objection");
  expect(searchHref(" c. 239 ", "litigation")).toBe("/search?q=c.+239&in=litigation");
});

test("results come in binder and library sections, quickest answer first", () => {
  render(<SearchResultsView initialQuery="hearsay objection" />);

  const binders = screen.getByRole("region", { name: "In your binders" });
  const links = binders.querySelectorAll("a");
  expect(links[0]).toHaveTextContent("Procedure: answering a hearsay objection in writing");
  expect(links[0]).toHaveTextContent("Litigation › Trial › Objections");
  expect(screen.getByRole("region", { name: "Library" })).toHaveTextContent(
    "Legal Skills: Hearsay",
  );
  expect(screen.getByText(/results$/)).toBeVisible();
});

test("a recognised citation is named, so the results make sense", () => {
  render(<SearchResultsView initialQuery="G.L. c. 239" />);
  expect(screen.getByText(/Recognised/)).toHaveTextContent(
    "Recognised G.L. c. 239: Summary process (eviction)",
  );
  expect(screen.getByRole("region", { name: "Library" })).toHaveTextContent(
    "Eviction Defense: The First 48 Hours",
  );
});

test("opened from a binder, that binder leads and everything is one click away", () => {
  render(<SearchResultsView initialQuery="hearsay" scopeBinderId="litigation" />);
  expect(screen.getByRole("region", { name: "In Litigation" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Search all binders equally" })).toHaveAttribute(
    "href",
    "/search?q=hearsay",
  );
});

test("nothing found says so and offers somewhere to go", () => {
  render(<SearchResultsView initialQuery="landlord changed the locks" />);
  expect(screen.getByRole("heading", { name: /Nothing found/ })).toBeVisible();
  expect(screen.getByRole("link", { name: "library" })).toHaveAttribute("href", "/browse");
});

test("a binder that is preferred but has no hits changes nothing", () => {
  const ids = new Set(["legal-skills-hearsay"]);
  expect(
    searchBinders("hearsay objection", ids, { preferBinderId: "practice-foundations" }),
  ).toEqual(searchBinders("hearsay objection", ids));
});

test("See all results is the last row, reachable by keyboard", async () => {
  const onSeeAll = vi.fn();
  function Harness() {
    const [value, setValue] = useState("");
    return <SearchBox value={value} onChange={setValue} onSeeAll={onSeeAll} />;
  }
  const user = userEvent.setup();
  render(<Harness />);
  await user.type(screen.getByRole("combobox"), "zzz");
  expect(screen.getByRole("option", { name: "See all results for “zzz”" })).toBeVisible();
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onSeeAll).toHaveBeenCalledOnce();
});
