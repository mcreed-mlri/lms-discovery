// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { getResumeCard, HeroSection, timeLeft } from "@/components/home/hero-section";
import { binderReadyLabel, binderUpdates, HomeOverview } from "@/components/home/home-overview";
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

test("the pilot's resume card names the open part and draws unbuilt parts as coming", () => {
  const card = getResumeCard(allItems);
  expect(card.title).toBe("Defending against a hearsay objection in writing");
  expect(card.subline).toBe("Legal Skills: Hearsay, part 2 of 5");
  expect(card.stops).toEqual(["coming", "here", "coming", "coming", "coming"]);
  expect(card.meta).toBe("The only part open so far · about 12 min");
  expect(card.action).toBe("Resume part 2");
  // Straight into the part, not the course home.
  expect(card.href).toBe("/legal-skills-hearsay/defending-hearsay-objection-writing.html");
  expect(card.filing).toEqual({
    binderId: "litigation",
    binderName: "Litigation",
    tabLabel: "Trial",
    topicTitle: "Objections",
  });
});

test("the resume card shows where the course is filed and links to the part", () => {
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

  expect(screen.getByText("Litigation › Trial › Objections")).toBeVisible();
  expect(screen.getByRole("link", { name: "Resume part 2" })).toHaveAttribute(
    "href",
    "/legal-skills-hearsay/defending-hearsay-objection-writing.html",
  );
});

test("binder rows say what is ready, or Coming when nothing is", () => {
  const ids = new Set(allItems.map((item) => item.id));
  expect(binderReadyLabel("litigation", ids)).toBe("1 course ready · 1 drill");
  expect(binderReadyLabel("practice-foundations", ids)).toBeNull();

  render(<HomeOverview allItems={allItems} />);
  expect(
    screen.getByRole("link", { name: /^Litigation.*1 course ready · 1 drill$/ }),
  ).toBeVisible();
  expect(screen.getByRole("link", { name: /^Practice Foundations.*Coming$/ })).toBeVisible();
});

test("Home offers the practice drill and only updates about filed courses", () => {
  render(<HomeOverview allItems={allItems} />);
  expect(
    screen.getByRole("link", { name: /Answer a hearsay objection in writing/ }),
  ).toHaveAttribute(
    "href",
    "/binder/litigation/trial-skills/practice/hearsay-objection-in-writing",
  );
  // Every sample update is about Eviction Defense, which no binder holds yet.
  expect(binderUpdates()).toEqual([]);
  expect(screen.getByText("Nothing new in your binders yet.")).toBeVisible();
  expect(screen.queryByText(/eviction records can be sealed/)).not.toBeInTheDocument();
});
