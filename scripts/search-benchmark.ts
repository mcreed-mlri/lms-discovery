/* Prints the search benchmark report: where the first right answer landed for
   every question, what was shown instead, and the totals.
   Run with `npm run search:benchmark`. */

import { PASS_RANK, passes, runBenchmark, summarize } from "../tests/search-benchmark/run";

const rows = runBenchmark();

for (const row of rows) {
  const status = passes(row) ? "pass" : row.knownGap ? "gap " : "FAIL";
  const rank = row.rank === null ? "  -" : `#${row.rank}`.padStart(3);
  console.log(`${status} ${rank}  ${row.query}`);
  if (!passes(row)) {
    console.log(`           wanted: ${row.answers.join(" / ")}`);
    console.log(`           shown:  ${row.shown.slice(0, PASS_RANK).join(" | ") || "(nothing)"}`);
    if (row.knownGap) console.log(`           why:    ${row.knownGap}`);
  }
}

const { total, top1, top3, missing } = summarize(rows);
console.log(
  `\n${top3}/${total} with a right answer in the top ${PASS_RANK} · ${top1} first · ${missing} with no right answer shown`,
);
