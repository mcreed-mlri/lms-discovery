# Search Governance Checklist

LACE search is an LMS discovery feature first. Brightspace remains the system of record for delivery, enrollment, progress, and completion; LACE owns discovery metadata, ranking cues, pathways, and search analytics.

## Required Metadata

Every searchable course, module, and learning path needs:

- Stable ID
- Title
- Description
- Type: course, module, or path
- Practice area
- Level
- Audience
- Duration or duration bucket
- Lifecycle status: Recommended, New, Updated, or Core
- Brightspace launch URL or safe fallback URL
- Synonyms when users may search with alternate legal aid language
- Review date

## Editorial Rules

- Use editorial boosts only for genuinely recommended, onboarding-critical, or newly updated items.
- Prefer synonyms over keyword-stuffed titles.
- Keep official LMS/training content separate from future community or field-report content.
- Do not allow user-submitted or legal-adjacent observations into search until moderation, privacy, verification, and source labels exist.
- Review zero-result searches weekly during pilots and add synonyms or missing metadata when the content already exists.

## Privacy And Risk Rules

- Store search analytics as aggregate product signals, not legal advice signals.
- Do not collect client names, case numbers, addresses, dates of birth, or other client-identifying facts in search metadata.
- Any future AI answer feature must cite sources and distinguish official guidance from discovered or community content.
- Legal/content leadership should review labels, disclaimers, and search result source language before legal-resource or community search launches.

## Weekly Pilot Review

- Top searches
- Zero-result searches
- Searches with results but no clicks
- Most-launched Brightspace items
- Metadata gaps or stale review dates
- Confusing synonyms or misleading result ordering

## Benchmark

`tests/search-benchmark/queries.ts` holds questions as advocates type them, each with the answers that count as right. `npm test` fails if a question without a known gap loses its top-3 answer, or if a known gap starts passing (remove its note to keep the win). `npm run search:benchmark` prints the report.

- Replace the starter questions with real ones from attorneys and supervisors; a subject-matter expert picks the right answers.
- Add each zero-result search worth answering from the weekly review.
- Raise `TOP3_FLOOR` in `tests/search-benchmark.test.ts` as results improve; never lower it.
