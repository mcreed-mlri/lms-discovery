import { describe, expect, test } from "vitest";

import { listBinderEntries } from "@/lib/binder-search";
import { getLearningItems } from "@/lib/data";

import { benchmarkQueries } from "./search-benchmark/queries";
import { PASS_RANK, passes, runBenchmark, summarize } from "./search-benchmark/run";

/* The search benchmark (tests/search-benchmark/queries.ts). Every question
   without a known gap must put a right answer in the top 3. A known gap that
   starts passing fails too, so its gap note gets removed and the win is kept.
   `npm run search:benchmark` prints the full report. */

const rows = runBenchmark();

// Raise this when the benchmark improves; never lower it (like the coverage ratchet).
const TOP3_FLOOR = 12;

describe("search benchmark", () => {
  test("every expected answer names something that exists", () => {
    const kind = { COURSE: "Course", MODULE: "Module", PATH: "Path" } as const;
    const labels = new Set([
      ...getLearningItems().map((item) => `${kind[item.type]}: ${item.title}`),
      ...listBinderEntries().map((hit) => `${hit.kind}: ${hit.title}`),
    ]);
    const unknown = benchmarkQueries.flatMap((entry) =>
      entry.answers.filter((answer) => !labels.has(answer)).map((a) => `${entry.query} → ${a}`),
    );
    expect(unknown).toEqual([]);
  });

  test.each(rows.filter((row) => !row.knownGap))(
    `"$query" puts a right answer in the top ${PASS_RANK}`,
    (row) => {
      expect(row.rank, `shown: ${row.shown.join(" | ") || "(nothing)"}`).not.toBeNull();
      expect(row.rank).toBeLessThanOrEqual(PASS_RANK);
    },
  );

  test("known gaps are still gaps (remove the note when one is fixed)", () => {
    const fixed = rows.filter((row) => row.knownGap && passes(row)).map((row) => row.query);
    expect(fixed).toEqual([]);
  });

  test(`at least ${TOP3_FLOOR} questions pass`, () => {
    expect(summarize(rows).top3).toBeGreaterThanOrEqual(TOP3_FLOOR);
  });
});
