/* The content team's search vocabulary (content/search/*.json) and the query
   analysis built on it. A query becomes a list of concepts; a result matches a
   concept when it contains any of the concept's alternatives:

   - a synonym group found in the query ("NTQ" → notice to quit, NTQ),
   - a citation found in the query ("c. 239" → summary process, eviction…),
   - each remaining meaningful word on its own.

   Pure data and functions, no "use client". */

import citationFile from "@/content/search/citations.json";
import vocabularyFile from "@/content/search/vocabulary.json";
import {
  containsPhrase,
  meaningfulTokens,
  normalize,
  STOP_WORDS,
  tokenize,
} from "@/lib/search-text";

type VocabularyFile = { groups: { terms: string[]; note?: string }[] };
type CitationFile = { citations: { cite: string; about: string; means: string[] }[] };

const vocabulary: VocabularyFile = vocabularyFile;
const citationData: CitationFile = citationFile;

/** Synonym groups, normalised. */
export const synonymGroups: string[][] = vocabulary.groups.map((group) =>
  group.terms.map(normalize).filter(Boolean),
);

type CitationMatch = { key: string; span: string };

/* Statutes by chapter: "g l c 239", "m g l c 239 8a", "mgl 239", "ch 239",
   "chapter 239". Evidence by section: "mass g evid 801", "evid 801",
   "guide to evidence 801", "fre 801", "fed r evid 801", "rule 801". Patterns
   run on normalised text, where punctuation and "§" are already spaces. */
const citationPatterns: { kind: string; pattern: RegExp }[] = [
  {
    kind: "chapter",
    pattern:
      /\b(?:(?:m\s?)?g\s?l\s|mgl\s|gen(?:eral)?\s(?:laws\s)?)?(?:c|ch|chap|chapter)\s(\d{1,3}[a-z]?)\b/g,
  },
  { kind: "chapter", pattern: /\b(?:m\s?g\s?l|mgl|g\s?l)\s(\d{1,3}[a-z]?)\b/g },
  {
    kind: "evidence",
    pattern:
      /\b(?:(?:mass\s)?(?:g\s)?evid(?:ence)?|guide\sto\sevidence|fre|fed\sr\sevid|federal\srules?\sof\sevidence|rule)\s(\d{3})\b/g,
  },
];

/** Citations in normalised text, as keys like "chapter:239" or "evidence:801". */
export function findCitations(text: string): CitationMatch[] {
  const found: CitationMatch[] = [];
  for (const { kind, pattern } of citationPatterns) {
    for (const match of text.matchAll(pattern)) {
      if (!found.some((f) => f.span.includes(match[0]) || match[0].includes(f.span))) {
        found.push({ key: `${kind}:${match[1]}`, span: match[0] });
      }
    }
  }
  return found;
}

export type CitationEntry = { cite: string; about: string; means: string[]; key: string | null };

export const citations: CitationEntry[] = citationData.citations.map((entry) => ({
  ...entry,
  means: entry.means.map(normalize),
  key: findCitations(normalize(entry.cite))[0]?.key ?? null,
}));

export type QueryAnalysis = {
  /** The whole query, normalised. */
  query: string;
  /** Each concept is matched when a field contains any one alternative. */
  concepts: string[][];
  /** Phrases worth a bonus when a field contains them verbatim. */
  phrases: string[];
  /** Citations recognised in the query, for display. */
  citations: CitationEntry[];
};

export function analyzeQuery(rawQuery: string): QueryAnalysis {
  const query = normalize(rawQuery);
  let rest = query;
  const concepts: string[][] = [];
  const phrases: string[] = [];
  const recognised: CitationEntry[] = [];

  for (const { key, span } of findCitations(query)) {
    const entry = citations.find((c) => c.key === key);
    if (!entry) continue;
    recognised.push(entry);
    concepts.push(entry.means);
    phrases.push(...entry.means);
    rest = ` ${rest} `.replace(` ${span} `, " ").trim();
  }

  for (const group of synonymGroups) {
    const term = [...group]
      .sort((a, b) => b.length - a.length)
      .find((t) => containsPhrase(rest, t));
    if (!term) continue;
    concepts.push(group);
    phrases.push(...group);
    rest = ` ${rest} `.replace(` ${term} `, " ").trim();
  }

  // Filler words only count when the query has nothing else to go on.
  const words = tokenize(rest);
  const kept =
    concepts.length > 0 ? words.filter((word) => !STOP_WORDS.has(word)) : meaningfulTokens(words);
  kept.forEach((word) => concepts.push([word]));

  return { query, concepts, phrases: [...new Set(phrases)], citations: recognised };
}
