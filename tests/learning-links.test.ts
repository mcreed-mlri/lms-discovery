import assert from "node:assert/strict";
import { test } from "vitest";

import {
  continueLearning,
  courses,
  getContinueLearningUrl,
  getLearningItemById,
  getLearningItems,
  getLearningItemUrl,
} from "@/lib/data";

test("eviction course opens in the Learning Hub before Brightspace", () => {
  const item = getLearningItemById("eviction-defense-48h");

  assert.ok(item);
  assert.equal(getLearningItemUrl(item), "/learn/eviction-defense-48h");
});

test("eviction source link targets the Brightspace course home", () => {
  const course = courses.find((entry) => entry.id === "eviction-defense-48h");

  assert.ok(course);
  assert.equal(course.brightspaceUrl, "https://mlri.brightspace.com/d2l/home/6703");
});

test("resume prefers the saved Brightspace location over the hub overview", () => {
  const resumeItem = continueLearning.find((entry) => entry.id === "eviction-defense-48h");

  assert.ok(resumeItem);
  assert.equal(
    getContinueLearningUrl(resumeItem),
    "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3",
  );
});

test("faculty handbook opens the published handbook page", () => {
  const item = getLearningItemById("faculty-handbook");

  assert.ok(item);
  assert.equal(getLearningItemUrl(item), "/tools-handbook/faculty-showcase.dc.html");
});

test("curriculum map opens the native discovery view", () => {
  const item = getLearningItemById("curriculum-map");

  assert.ok(item);
  assert.equal(getLearningItemUrl(item), "/curriculum-map");
});

test("curriculum-generated offerings open their Learning Hub page", () => {
  const generated = getLearningItems().find((item) => item.availability === "planned");

  assert.ok(generated, "expected the catalog to include curriculum-generated offerings");
  assert.equal(getLearningItemUrl(generated), `/learn/${generated.id}`);
});

test("retired mock courses are no longer in the catalog", () => {
  for (const id of [
    "professional-foundations",
    "client-centered-practice",
    "first-steps-in-court",
    "upl-boundaries-advocates",
  ]) {
    assert.equal(getLearningItemById(id), undefined, `${id} should be removed`);
  }
});
