# Search

Search is the hub's front door for the moment the whole product is built around: an advocate with a hearing, intake or filing coming up types what is in front of them and should reach the first useful thing within 15 seconds or two clicks (PRODUCT.md). This document covers how search works today, how to improve it without writing code, and what we need next.

**Where it stands (October 2026):** 30 of 31 benchmark questions put a right answer in the top 3, 25 of them first. The one miss is an access decision, not a search problem (see [Open decisions](#open-decisions)).

## What "effective" means

Effective search is measured, not judged by feel:

- **The benchmark** (`tests/search-benchmark/`): questions written the way advocates type them, each with the answers that count as right. `npm test` fails if a question loses its top-3 answer. `npm run search:benchmark` prints the report.
- **In real use**, once search analytics reach a server (see [Engineering roadmap](#engineering-roadmap)), we track four numbers: the position of the result people click, searches with no results, searches with results but no click, and searches repeated straight away.

| Date   | Benchmark | What changed                                                       |
| ------ | --------- | ------------------------------------------------------------------ |
| 10 Oct | 12 / 28   | Baseline. Any question phrased as a sentence found nothing.        |
| 10 Oct | 23 / 29   | Filler words ignored, light stemming, partial matches.             |
| 10 Oct | 30 / 31   | Synonyms and citations from content files; reference text indexed. |

## Where people search

- **Home's search box** and the **Ctrl K dialog** (also the Search button in the header and the phone tab bar) show a short dropdown: "In your binders" first, then "Library", then **See all results**.
- **The results page**, `/search?q=…`, shows everything, grouped the same way. It is shareable, and the address updates as you type.
- **From a binder page**, Ctrl K and See all results put that binder's results first (`/search?q=…&in=litigation`), with a link to search all binders equally.
- **Browse** (`/browse`) keeps its own library search with filters.

## How it works

```
query
  └─ lib/search-vocabulary.ts   recognise citations and synonym groups; drop filler words
       └─ concepts: [summary process | eviction | notice to quit], [answer]
            ├─ lib/search.ts          library: courses, modules, paths (incl. planned)
            └─ lib/binder-search.ts   binders: references, drills, open lessons, topic pages
                 └─ lib/search-results.ts   merge, order, trim → dropdown and /search page
```

**What is searchable**

| Kind                 | Source                                             | Searched by                                            |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Reference            | `referencePages` in `lib/binder.ts`                | title, its own words (`searchText`), where it is filed |
| Practice             | `lib/practice.ts`                                  | title, summary, where it is filed                      |
| Lesson               | The Hearsay course's open parts (`hearsaySkills`)  | title, course, where it is filed                       |
| Topic                | Built topic pages (`lib/binder-topics.ts`)         | title, sub-topics, binder and tab                      |
| Course, Module, Path | `lib/data.ts` and the generated curriculum catalog | title, tags, description, related titles               |

**Ranking rules**

- A query becomes **concepts**: each recognised citation, each synonym group found in it, and each remaining meaningful word. Filler words (how, do, my, the…) are ignored unless the query is nothing else.
- A result matches a concept when it contains any of the concept's alternatives. Words match with plurals, light stemming ("served" finds "service") and one-letter typos.
- One or two concepts must all match. Longer queries need at least half, and the score scales with the share matched, so fuller matches lead.
- Title matches count most; an exact or leading title match counts most of all.
- Binder results are ordered quickest answer first: reference, then practice, then lesson, then topic, unless a later kind is a much better match.
- Binder results always sit above the library, so a binder result scoring under a quarter of the best library result is dropped. This keeps an exact library title from being buried.
- Access rules apply everywhere: nothing from a course the person cannot open is shown, including its references, drills and lessons.

## Improving search without code

Two files in `content/search/` belong to the content team. `npm test` checks both are well formed.

- **`vocabulary.json`**: groups of terms that mean the same thing, such as `"notice to quit", "ntq"` or `"summary process", "eviction"`. Add a group for every abbreviation, nickname and common misspelling advocates use. A term can be in only one group.
- **`citations.json`**: citations mapped to the topics they concern. Statutes are matched by chapter (`G.L. c. 239`, `ch. 239`, `chapter 239`, `MGL 239`), evidence by section (`Mass. G. Evid. § 801`, `Guide to Evidence 801`, `FRE 801`). Each entry says what it is `about` and the topic words it `means`.

**The weekly loop** (also in `docs/planning/search-governance-checklist.md`):

1. Review searches that found nothing, and searches with results but no click.
2. If the content exists, add a synonym or citation, or improve its title or description.
3. If it does not exist, send it to the curriculum team as a gap.
4. Add a benchmark question for each fix, so it stays fixed. Raise `TOP3_FLOOR` in `tests/search-benchmark.test.ts` when the pass count rises; never lower it.

## Known limits

- **Search analytics stay in each person's browser.** Nobody can run the weekly loop yet.
- **The benchmark questions are ours, not advocates'.** They were written from the content we have.
- **Citations and synonyms are a starter list** with no subject-matter review.
- **Reference text is copied by hand** from the Hearsay panels. Edits to the course do not reach search.
- **Only the Hearsay course is indexed below the course line**, and the lesson index is specific to it (`hearsaySkills`).
- **Planned topics are not in binder search.** Their planned modules show in the library instead, so "objections" lists both the topic page and a planned "Objections" module.
- **No understanding of situations beyond keywords.** "Landlord changed the locks" finds nothing, correctly today because no lockout content exists, but a semantic match would help once it does.

## What we need going forward

### Open decisions

| Decision                                                                                                                                                                               | Why it matters                                                                                           | Who                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| Should learners' search find the Curriculum Map? It is filed as Faculty Support, which attorneys' search hides, though Home links every learner to it. This is the one benchmark miss. | Orientation questions ("where does my training fit") find nothing.                                       | Product             |
| Can search terms be stored on a server, and how? Advocates will type client facts. Options: counts only, redacted text, or hashed text.                                                | Without it, the weekly review cannot happen. See `docs/planning/outsourced-it-integration-questions.md`. | IT, legal           |
| Who owns `vocabulary.json` and `citations.json`, and how often are they reviewed?                                                                                                      | Search quality now depends on them.                                                                      | Training leadership |

### From people, not code

- **20 or more real questions** from new attorneys and supervisors, in their own words, with a subject-matter expert naming the right answer for each. These replace the starter benchmark.
- **Subject-matter review of `citations.json`**, then more entries: the statutes, rules and standing orders advocates cite most.
- **Abbreviations and nicknames from practice**: listserv and task-force language is a good source.
- **Reference pages written for the hub**, so quick answers exist beyond Hearsay.

### Engineering roadmap

**Next, no backend needed**

- Filters on the results page by binder and by kind.
- Index each course's named sections automatically from the course package instead of copying text by hand.
- Generalise lessons beyond Hearsay, so every course's open parts are searchable.
- Show the answer in the result for strong reference matches (for example the five procedure steps), so a click is sometimes unnecessary.

**With Supabase `learning_items`**

- Move the index into Postgres: full-text search with weighted fields, plus `pg_trgm` for typo tolerance, with access enforced by row-level security.
- A nightly Brightspace sync of each course's modules and topics, so search reaches below the course line for every course. Open questions for D2L are in `docs/planning/questions-for-d2l.md`.
- MassLegalServices resource records (PRODUCT.md, "MassLegalServices").
- Search analytics on the server, within whatever the logging decision allows.

**Later**

- Semantic matching (`pgvector`) for situations described in plain language.
- "Ask about this": an answer written only from hub content, citing the exact panels it drew on. It carries the same conditions as the AI practice drill in PRODUCT.md: expert-reviewed sources, a confidentiality warning, a "not legal advice" label, usage limits and an off switch. Start with Hearsay.

## Files

| File                                                        | Purpose                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| `lib/search.ts`                                             | Library scoring and the shared matching rules              |
| `lib/search-text.ts`                                        | Normalising, tokenising, filler words                      |
| `lib/search-vocabulary.ts`                                  | Reads `content/search/*.json`; turns a query into concepts |
| `lib/binder-search.ts`                                      | The binder index                                           |
| `lib/search-results.ts`                                     | Merges both for the dropdown and the results page          |
| `components/search-box.tsx`                                 | The dropdown search box                                    |
| `components/search-results-view.tsx`, `app/search/page.tsx` | The results page                                           |
| `content/search/vocabulary.json`, `citations.json`          | Synonyms and citations, owned by content                   |
| `tests/search-benchmark/`                                   | The benchmark questions and runner                         |
| `docs/planning/search-governance-checklist.md`              | Metadata rules and the weekly review                       |
