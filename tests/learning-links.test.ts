import assert from "node:assert/strict";
import { test } from "node:test";

import { courses, getLearningItemById, getLearningItemUrl } from "@/lib/data";

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
