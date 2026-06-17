import assert from "node:assert/strict";
import { test } from "node:test";

import {
  continueLearning,
  courses,
  getContinueLearningUrl,
  getLearningItemById,
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
