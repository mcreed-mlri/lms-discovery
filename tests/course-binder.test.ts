import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { expect, test } from "vitest";

import { getBinder, getSectionTab, getTopic } from "@/lib/binder";
import { getSkillPath, skillHref, stepHref } from "@/lib/skill-paths";

/* The Hearsay course package shows the hub's binder (its divider tabs and
   breadcrumb), described in its own course-config.js because the package is
   plain HTML that cannot import the hub's code. This keeps the two in step:
   rename a tab or move the course in lib/binder.ts and this fails until the
   package is updated too. */

type CourseConfig = {
  homeLinkUrl: string;
  binder: {
    name: string;
    currentTab: string;
    tabs: { id: string; label: string; href: string }[];
    crumbs: { label: string; href: string }[];
  };
  modules: {
    topics: { slug: string; practice?: { status?: string; href: string; linkText: string } }[];
  }[];
};

function loadConfig(): CourseConfig {
  const window: { COURSE_CONFIG?: CourseConfig } = {};
  const source = readFileSync(
    join(__dirname, "..", "public/legal-skills-hearsay/course-config.js"),
    "utf8",
  );
  runInNewContext(source, { window });
  if (!window.COURSE_CONFIG) throw new Error("course-config.js did not set COURSE_CONFIG");
  return window.COURSE_CONFIG;
}

// The hub uses trailing slashes on page addresses.
const page = (href: string) => `${href}/`;

test("the course shows the same divider tabs as the hub's Litigation binder", () => {
  const config = loadConfig();
  const litigation = getBinder("litigation")!;
  expect(config.binder.name).toBe(litigation.name);
  expect(config.binder.tabs).toEqual(
    litigation.tabs.map((tab) => ({ id: tab.id, label: tab.label, href: page(tab.href) })),
  );
  expect(config.binder.tabs.map((tab) => tab.id)).toContain(config.binder.currentTab);
});

test("its breadcrumb and way back lead to where the course is filed", () => {
  const config = loadConfig();
  const litigation = getBinder("litigation")!;
  const trial = getSectionTab(litigation, "trial-skills")!;
  const objections = getTopic(litigation, "trial-skills", "objections")!;
  expect(config.binder.crumbs).toEqual([
    { label: litigation.name, href: page(litigation.href) },
    { label: trial.label, href: page(trial.href) },
    { label: objections.title, href: page(objections.href) },
  ]);
  expect(config.homeLinkUrl).toBe(page(objections.href));
});

test("the course takes the hub's look and never puts text on the binder colour", () => {
  const css = readFileSync(
    join(__dirname, "..", "public/legal-skills-hearsay/course-style.css"),
    "utf8",
  );
  // The hub's page, ink and type.
  expect(css).toMatch(/--bg: #ffffff;/);
  expect(css).toMatch(/--ink: #16161a;/);
  expect(css).toContain("family=Public+Sans");
  // The binder colour is for strokes; a rule that fills with it sets no text colour.
  const filled = [...css.matchAll(/\{([^{}]*)\}/g)]
    .map((m) => m[1])
    .filter((body) => /background: var\(--brand-fill\)/.test(body));
  expect(filled.length).toBeGreaterThan(0);
  for (const body of filled) expect(body).not.toMatch(/(^|[\s;])color:/);
});

test("each part's practice card leads to a real place in the hub's Hearsay levels", () => {
  const topics = loadConfig().modules.flatMap((mod) => mod.topics);
  const hearsay = getSkillPath("hearsay")!;
  const level1 = hearsay.levels[0];
  for (const topic of topics) {
    const practice = topic.practice;
    expect(practice, topic.slug).toBeDefined();
    if (practice?.status === "coming") {
      expect(practice.href).toBe(page(skillHref(hearsay)));
    } else {
      // A built level starts at its first step.
      expect(practice?.href).toBe(page(stepHref(hearsay, level1, "watch")));
    }
  }
  expect(topics.filter((topic) => topic.practice?.status !== "coming")).toHaveLength(1);
});
