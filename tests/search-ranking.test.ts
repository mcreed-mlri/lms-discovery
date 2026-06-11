import assert from "node:assert/strict";
import { test } from "node:test";

import { getLearningItems } from "@/lib/data";
import { searchLearningItems } from "@/lib/search";

test("exact title matches rank above tag-only matches", () => {
  const results = searchLearningItems(getLearningItems(), "Client-Centered Communication");
  assert.equal(results[0].item.title, "Client-Centered Communication");
  assert.ok(results[0].score > results[1].score);
});

test("module can match through its parent course relationship", () => {
  const results = searchLearningItems(getLearningItems(), "Professional Foundations");
  const titles = results.map((result) => result.item.title);
  assert.ok(titles.includes("Ethics and Confidentiality in Legal Aid"));
});

test("legal aid synonyms return expected learning content", () => {
  const results = searchLearningItems(getLearningItems(), "DV");
  assert.equal(results[0].item.title, "Safety Screening and Crisis Recognition");
});

test("plural and singular query variants match", () => {
  const results = searchLearningItems(getLearningItems(), "motions");
  assert.ok(results.some((result) => result.item.title === "Your First Steps in Court"));
});

test("irrelevant multi-token queries do not overmatch", () => {
  const results = searchLearningItems(getLearningItems(), "banana patent submarine");
  assert.equal(results.length, 0);
});

test("facet filters constrain otherwise valid matches", () => {
  const results = searchLearningItems(getLearningItems(), "client", {
    audiences: ["Program staff"],
  });
  assert.equal(results.length, 0);
});
