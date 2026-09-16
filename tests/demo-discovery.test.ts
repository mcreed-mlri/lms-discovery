import { expect, test } from "vitest";
import {
  courses,
  modules,
  paths,
  getLearningItems,
  getLearningItemById,
  getLearningItemUrl,
} from "@/lib/data";
import { featuredLearningPath, featuredLearningPathUrl } from "@/lib/demo-discovery";
import { intakeToVerdictPath } from "@/lib/mocks/core-curriculum";
import { searchLearningItems } from "@/lib/search";

test("discovery exposes one example path and retains every course and module", () => {
  const items = getLearningItems();
  expect(items.filter((item) => item.type === "PATH").map((item) => item.id)).toEqual([
    featuredLearningPath.id,
  ]);
  expect(items.filter((item) => item.type !== "PATH")).toHaveLength(
    courses.length + modules.length,
  );
});

test("hidden paths remain resolvable at their existing direct destinations", () => {
  for (const path of paths.filter((item) => item.id !== featuredLearningPath.id)) {
    const item = getLearningItemById(path.id);
    expect(item).toBeDefined();
    expect(getLearningItemUrl(item!)).toBe(`/learn/${path.id}`);
    expect(getLearningItems().some((entry) => entry.id === path.id)).toBe(false);
  }
});

test("catalog and search agree with the featured journey title and destination", () => {
  const results = searchLearningItems(getLearningItems(), "", { types: ["PATH"] });
  expect(results).toHaveLength(1);
  expect(results[0].item.title).toBe(intakeToVerdictPath.title);
  expect(results[0].href).toBe(featuredLearningPathUrl);
  expect(intakeToVerdictPath.href).toBe(featuredLearningPathUrl);
  expect(searchLearningItems(getLearningItems(), featuredLearningPath.title)[0].item.id).toBe(
    featuredLearningPath.id,
  );
});

test("search cannot rediscover hidden path offerings", () => {
  for (const query of [
    "advocate paralegal",
    "experienced attorney",
    "faculty starter",
    "before trial",
  ]) {
    const results = searchLearningItems(getLearningItems(), query, { types: ["PATH"] });
    expect(results.every((result) => result.item.id === featuredLearningPath.id)).toBe(true);
  }
});
