/* What a search box shows for a query: binder hits first ("In your binders"),
   then library results, trimmed so the list stays short. Home, the Ctrl K
   dialog and the search benchmark all call this, so the benchmark measures
   exactly what people see. */

import { searchBinders, type BinderHit } from "@/lib/binder-search";
import type { LearningItem } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";

export type SearchDropdown = { binderHits: BinderHit[]; library: SearchResult[] };

const LIBRARY_ALONE = 6;
const LIBRARY_WITH_BINDER_HITS = 4;

// Binder hits always sit above the library, so a weak one (say, matching half
// the words) must not bury an exact library match. Hits scoring under this
// share of the best library result are dropped.
const BINDER_CUTOFF = 0.25;

/** `items` is the catalog the user may open (already eligibility-filtered). */
export function searchEverything(items: LearningItem[], query: string): SearchDropdown {
  if (!query.trim()) return { binderHits: [], library: [] };
  const library = searchLearningItems(items, query);
  const floor = (library[0]?.score ?? 0) * BINDER_CUTOFF;
  const binderHits = searchBinders(query, new Set(items.map((item) => item.id))).filter(
    (hit) => (hit.score ?? 0) >= floor,
  );
  const limit = binderHits.length > 0 ? LIBRARY_WITH_BINDER_HITS : LIBRARY_ALONE;
  return { binderHits, library: library.slice(0, limit) };
}

/** One flat list in on-screen order, labelled "Kind: Title" (e.g. "Module: Discovery"). */
export function dropdownLabels({ binderHits, library }: SearchDropdown): string[] {
  const kind = { COURSE: "Course", MODULE: "Module", PATH: "Path" } as const;
  return [
    ...binderHits.map((hit) => `${hit.kind}: ${hit.title}`),
    ...library.map((result) => `${kind[result.item.type]}: ${result.item.title}`),
  ];
}
