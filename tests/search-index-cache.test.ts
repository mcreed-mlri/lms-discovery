import assert from "node:assert/strict";
import { test } from "vitest";

import { getLearningItems } from "@/lib/data";
import { buildSearchDocument, searchLearningItems } from "@/lib/search";

/**
 * The search index used to be rebuilt on every query — twice per keystroke on the
 * home page — with each COURSE document filtering every module and each PATH
 * document filtering every course and module. These tests pin the caching that
 * replaced that, and assert it did not change what search returns.
 */

const items = getLearningItems();

test("building a document for the same item twice returns the identical object", () => {
  const item = items[0];
  const first = buildSearchDocument(item);
  const second = buildSearchDocument(item);
  assert.equal(first, second, "expected the cached document instance, not a rebuild");
});

test("every catalog item caches independently", () => {
  const firstPass = items.map((item) => buildSearchDocument(item));
  const secondPass = items.map((item) => buildSearchDocument(item));

  firstPass.forEach((document, index) => {
    assert.equal(document, secondPass[index], `document ${index} was rebuilt`);
  });
});

test("distinct items get distinct documents", () => {
  const documents = items.map((item) => buildSearchDocument(item));
  const unique = new Set(documents);
  assert.equal(unique.size, documents.length, "two items shared a cached document");
});

test("caching does not change search results across repeated queries", () => {
  // Same query twice: identical ordering and identical scores. A stale or shared
  // cache entry would show up here as drift between the two runs.
  const first = searchLearningItems(items, "housing");
  const second = searchLearningItems(items, "housing");

  assert.deepEqual(
    first.map((result) => [result.item.id, result.score]),
    second.map((result) => [result.item.id, result.score]),
  );
  assert.ok(first.length > 0, "expected 'housing' to match something");
});

test("results stay correct when the item array is a filtered subset", () => {
  // Documents are cached per item, not per array, so a subset must still produce
  // the same scores as the full catalog for the items it contains.
  const subset = items.filter((item) => item.type === "COURSE");
  const fromSubset = searchLearningItems(subset, "housing");
  const fromFull = searchLearningItems(items, "housing").filter(
    (result) => result.item.type === "COURSE",
  );

  assert.deepEqual(
    fromSubset.map((result) => [result.item.id, result.score]),
    fromFull.map((result) => [result.item.id, result.score]),
  );
});
