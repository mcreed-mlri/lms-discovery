// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { HeroSection, timeLeft } from "@/components/home/hero-section";
import { HomeOverview } from "@/components/home/home-overview";
import { demoUser } from "@/lib/auth-constants";
import { getLearningItems } from "@/lib/data";

const allItems = getLearningItems();

test("the greeting subtitle is the job title, not the organization", () => {
  render(
    <HeroSection
      user={demoUser}
      isAdmin={false}
      query=""
      onQueryChange={() => undefined}
      suggestions={[]}
      onSelectResult={() => undefined}
      allItems={allItems}
    />,
  );

  expect(screen.getByRole("heading", { name: /Welcome back, Sarah/i })).toBeVisible();
  expect(screen.getByText("MLRI Staff Attorney")).toBeVisible();
  expect(screen.queryByText("Housing Unit")).not.toBeInTheDocument();
});

test("a production mock user shows MLRI Staff Attorney under the name", () => {
  render(
    <HeroSection
      user={{
        ...demoUser,
        name: "Kate O'Brien",
        firstName: "Kate",
        initials: "KO",
        title: "MLRI Staff Attorney",
        unit: "",
      }}
      isAdmin={false}
      query=""
      onQueryChange={() => undefined}
      suggestions={[]}
      onSelectResult={() => undefined}
      allItems={allItems}
    />,
  );

  expect(screen.getByRole("heading", { name: /Welcome back, Kate/i })).toBeVisible();
  expect(screen.getByText("MLRI Staff Attorney")).toBeVisible();
  expect(screen.queryByText("Housing Unit")).not.toBeInTheDocument();
});

test("time left counts only the parts still ahead, rounded to 5 minutes", () => {
  // Part 2 of 5 on a 20 minute course leaves parts 2–5: 16, said as about 15.
  expect(timeLeft("~20 min", 2, 5)).toBe("about 15 min left");
  expect(timeLeft("22 min", 1, 5)).toBe("about 20 min left");
  // The last part never rounds down to nothing.
  expect(timeLeft("10 min", 5, 5)).toBe("about 5 min left");
  // Without parts, the course length is not presented as time left.
  expect(timeLeft("~20 min", 0, 0)).toBe("about 20 min");
  expect(timeLeft("2 hours", 2, 5)).toBeNull();
  expect(timeLeft(undefined, 2, 5)).toBeNull();
});

test("Home's browse link counts everything the user can open, with a singular form", () => {
  const { rerender } = render(<HomeOverview allItems={allItems} />);
  expect(screen.getByRole("link", { name: `Browse all ${allItems.length} items` })).toBeVisible();

  rerender(<HomeOverview allItems={allItems.slice(0, 1)} />);
  expect(screen.getByRole("link", { name: "Browse all 1 item" })).toBeVisible();
});
