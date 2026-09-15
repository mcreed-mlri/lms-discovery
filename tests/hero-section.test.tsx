// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { HeroSection } from "@/components/home/hero-section";
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
      onSearchLibrary={() => undefined}
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
      onSearchLibrary={() => undefined}
      allItems={allItems}
    />,
  );

  expect(screen.getByRole("heading", { name: /Welcome back, Kate/i })).toBeVisible();
  expect(screen.getByText("MLRI Staff Attorney")).toBeVisible();
  expect(screen.queryByText("Housing Unit")).not.toBeInTheDocument();
});
