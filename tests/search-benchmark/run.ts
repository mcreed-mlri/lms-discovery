/* Runs the benchmark through the same function the search boxes use, for the
   attorney persona, and reports where the first right answer landed. */

import { getEligibleLearningItems } from "@/lib/access";
import { demoUser } from "@/lib/auth-constants";
import { getLearningItems } from "@/lib/data";
import { dropdownLabels, searchEverything } from "@/lib/search-results";

import { benchmarkQueries, type BenchmarkQuery } from "./queries";

export type BenchmarkRow = BenchmarkQuery & {
  /** 1-based position of the first right answer, or null when none is shown. */
  rank: number | null;
  shown: string[];
};

export const PASS_RANK = 3;

export function runBenchmark(): BenchmarkRow[] {
  const items = getEligibleLearningItems(getLearningItems(), demoUser);
  return benchmarkQueries.map((entry) => {
    const shown = dropdownLabels(searchEverything(items, entry.query));
    const index = shown.findIndex((label) => entry.answers.includes(label));
    return { ...entry, rank: index === -1 ? null : index + 1, shown };
  });
}

export function passes(row: BenchmarkRow) {
  return row.rank !== null && row.rank <= PASS_RANK;
}

export function summarize(rows: BenchmarkRow[]) {
  const top1 = rows.filter((row) => row.rank === 1).length;
  const top3 = rows.filter(passes).length;
  const missing = rows.filter((row) => row.rank === null).length;
  return { total: rows.length, top1, top3, missing };
}
