import {
  courses,
  getLearningItemUrl,
  modules,
  type Course,
  type LearningItem,
  type Level,
  type Module,
} from "@/lib/data";
import {
  getSearchMetadata,
  type ContentLifecycleStatus,
  type SearchAudience,
  type SearchMetadata,
} from "@/lib/search-metadata";
import { normalize, STOP_WORDS, tokenize } from "@/lib/search-text";
import { analyzeQuery, synonymGroups } from "@/lib/search-vocabulary";

export type DurationFacet = "Short" | "Medium" | "Long";

export type SearchFacetFilters = {
  types?: LearningItem["type"][];
  practiceAreas?: string[];
  levels?: Level[];
  audiences?: SearchAudience[];
  statuses?: ContentLifecycleStatus[];
  durations?: DurationFacet[];
};

export type SearchDocument = {
  id: string;
  item: LearningItem;
  title: string;
  titleText: string;
  tagsText: string;
  taxonomyText: string;
  relationshipText: string;
  summaryText: string;
  metadataText: string;
  context: string;
  href: string;
  facets: {
    type: LearningItem["type"];
    practiceArea: string;
    level: Level;
    audience: SearchAudience[];
    status: ContentLifecycleStatus;
    duration: DurationFacet;
  };
  metadata: SearchMetadata;
};

export type SearchResult = {
  item: LearningItem;
  document: SearchDocument;
  score: number;
  context: string;
  href: string;
  matchedFields: string[];
};

export type SearchFacetOptions = {
  types: LearningItem["type"][];
  practiceAreas: string[];
  levels: Level[];
  audiences: SearchAudience[];
  statuses: ContentLifecycleStatus[];
  durations: DurationFacet[];
};

/**
 * How many query concepts a result must match (a concept is a word, a synonym
 * group or a citation; see lib/search-vocabulary.ts). One or two: all of them.
 * Longer queries, which are usually questions or situations: at least half,
 * and the score then scales with the share matched, so fuller matches lead.
 */
function enoughMatched(matched: number, total: number) {
  return total <= 2 ? matched === total : matched >= Math.ceil(total / 2);
}

function coverageFactor(matched: number, total: number) {
  return (matched / total) ** 2;
}

function tokenVariants(token: string) {
  const normalizedToken = normalize(token);
  const variants = new Set([normalizedToken]);

  if (normalizedToken.endsWith("ies") && normalizedToken.length > 4)
    variants.add(`${normalizedToken.slice(0, -3)}y`);
  if (normalizedToken.endsWith("es") && normalizedToken.length > 3)
    variants.add(normalizedToken.slice(0, -2));
  // Light stemming for verbs: "served" also tries "serve" and "serv" (which
  // matches "service"); "answering" tries "answer".
  if (normalizedToken.endsWith("ed") && normalizedToken.length > 4) {
    variants.add(normalizedToken.slice(0, -1));
    variants.add(normalizedToken.slice(0, -2));
  }
  if (normalizedToken.endsWith("ing") && normalizedToken.length > 5) {
    variants.add(normalizedToken.slice(0, -3));
    variants.add(`${normalizedToken.slice(0, -3)}e`);
  }
  if (normalizedToken.endsWith("s") && normalizedToken.length > 3)
    variants.add(normalizedToken.slice(0, -1));

  return [...variants].filter(Boolean);
}

function editDistanceWithinOne(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || Math.min(a.length, b.length) < 5) return false;

  let edits = 0;
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (a.length > b.length) i += 1;
      else if (b.length > a.length) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
  }

  return edits + (a.length - i) + (b.length - j) <= 1;
}

function fieldIncludesToken(field: string, token: string) {
  const fieldTokens = tokenize(field);
  return tokenVariants(token).some((variant) => {
    if (variant.length <= 2) return fieldTokens.includes(variant);
    if (field.includes(variant)) return true;
    return fieldTokens.some((fieldToken) => editDistanceWithinOne(fieldToken, variant));
  });
}

function fieldIncludesPhrase(field: string, phrase: string) {
  const normalizedPhrase = normalize(phrase);
  return normalizedPhrase.length > 0 && field.includes(normalizedPhrase);
}

function scoreField(
  fieldName: string,
  field: string,
  query: string,
  tokens: string[],
  weight: number,
) {
  let score = 0;
  const matchedFields = new Set<string>();

  if (fieldIncludesPhrase(field, query)) {
    score += weight * 3;
    matchedFields.add(fieldName);
  }

  for (const token of tokens) {
    if (fieldIncludesToken(field, token)) {
      score += weight;
      matchedFields.add(fieldName);
    }
  }

  return { score, matchedFields: [...matchedFields] };
}

function getItemContext(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses - ${item.totalDuration}`;
  if (item.type === "MODULE") return `Inside: ${item.parentCourseTitle}`;
  return `${item.practiceArea} - ${item.duration}`;
}

function getItemPracticeArea(item: LearningItem) {
  if (item.type === "PATH") {
    const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));
    const nonUniversalArea = relatedCourses.find(
      (course) => course.practiceArea !== "All Practice Areas",
    )?.practiceArea;
    return nonUniversalArea ?? "All Practice Areas";
  }

  return item.practiceArea;
}

function parseDurationMinutes(value: string) {
  const normalizedValue = value.toLowerCase();
  const hourMatch = normalizedValue.match(/(\d+(?:\.\d+)?)\s*hr/);
  const minuteMatch = normalizedValue.match(/(\d+)\s*min/);
  const hours = hourMatch ? Number(hourMatch[1]) * 60 : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  return hours + minutes;
}

function getDurationFacet(item: LearningItem): DurationFacet {
  if (item.type === "MODULE") return "Short";

  const minutes =
    item.type === "PATH"
      ? parseDurationMinutes(item.totalDuration)
      : parseDurationMinutes(item.duration);
  if (minutes <= 45) return "Short";
  if (minutes <= 150) return "Medium";
  return "Long";
}

function expandQuery(rawQuery: string) {
  const { query, concepts, phrases } = analyzeQuery(rawQuery);
  const expandedTokens = new Set<string>();
  for (const alternatives of concepts) {
    for (const alternative of alternatives) {
      for (const token of tokenize(alternative)) {
        if (STOP_WORDS.has(token)) continue;
        tokenVariants(token).forEach((variant) => expandedTokens.add(variant));
      }
    }
  }
  return { query, concepts, expandedTokens: [...expandedTokens], phraseBoosts: phrases };
}

/** A concept matches a field when any alternative's words all appear in it. */
function conceptMatches(field: string, alternatives: string[]) {
  return alternatives.some((alternative) => {
    const words = tokenize(alternative).filter((word) => !STOP_WORDS.has(word));
    return words.length > 0 && words.every((word) => fieldIncludesToken(field, word));
  });
}

/**
 * Per-item document cache.
 *
 * `createSearchDocument` is not cheap: for a COURSE it filters every module, and
 * for a PATH it filters every course *and* every module. `buildSearchIndex` maps
 * it over the whole catalog, and `searchLearningItems` called `buildSearchIndex`
 * fresh on every query — so a single keystroke rebuilt the entire index, and the
 * home page did it twice (once for the catalog grid, once for the global search
 * box). That is O(items x modules) of string work per character typed.
 *
 * A WeakMap keyed on the item is safe because catalog items are module-level
 * constants in lib/data.ts: stable identity, never mutated. A different item
 * object gets its own entry, and entries disappear with the items if the catalog
 * ever becomes dynamic.
 */
const documentCache = new WeakMap<LearningItem, SearchDocument>();

export function buildSearchDocument(item: LearningItem): SearchDocument {
  const cached = documentCache.get(item);
  if (cached) return cached;

  const document = createSearchDocument(item);
  documentCache.set(item, document);
  return document;
}

function createSearchDocument(item: LearningItem): SearchDocument {
  const metadata = getSearchMetadata(item);
  const relatedCourses =
    item.type === "PATH"
      ? courses.filter((course: Course) => item.courseIds.includes(course.id))
      : [];
  const relatedModules =
    item.type === "PATH"
      ? modules.filter((module: Module) => item.courseIds.includes(module.courseId))
      : [];
  const practiceArea = getItemPracticeArea(item);

  const relationshipParts =
    item.type === "MODULE"
      ? [item.parentCourseTitle, item.practiceArea]
      : item.type === "PATH"
        ? [
            relatedCourses.map((course) => `${course.title} ${course.practiceArea}`).join(" "),
            relatedModules.map((module) => `${module.title} ${module.tags.join(" ")}`).join(" "),
          ]
        : [
            modules
              .filter((module) => module.courseId === item.id)
              .map((module) => `${module.title} ${module.tags.join(" ")}`)
              .join(" "),
          ];

  const tags = item.type === "MODULE" ? item.tags : [];

  return {
    id: `${item.type}-${item.id}`,
    item,
    title: item.title,
    titleText: normalize(item.title),
    tagsText: normalize([...tags, ...(metadata.synonyms ?? [])].join(" ")),
    taxonomyText: normalize([item.type, item.level, practiceArea].join(" ")),
    relationshipText: normalize(relationshipParts.join(" ")),
    summaryText: normalize(item.description),
    metadataText: normalize(
      [metadata.audience.join(" "), metadata.status, metadata.reviewedAt].join(" "),
    ),
    context: getItemContext(item),
    href: getLearningItemUrl(item),
    facets: {
      type: item.type,
      practiceArea,
      level: item.level,
      audience: metadata.audience,
      status: metadata.status,
      duration: getDurationFacet(item),
    },
    metadata,
  };
}

function matchesFacets(document: SearchDocument, filters?: SearchFacetFilters) {
  if (!filters) return true;
  if (filters.types?.length && !filters.types.includes(document.facets.type)) return false;
  if (
    filters.practiceAreas?.length &&
    !filters.practiceAreas.includes(document.facets.practiceArea)
  )
    return false;
  if (filters.levels?.length && !filters.levels.includes(document.facets.level)) return false;
  if (filters.statuses?.length && !filters.statuses.includes(document.facets.status)) return false;
  if (filters.durations?.length && !filters.durations.includes(document.facets.duration))
    return false;
  if (
    filters.audiences?.length &&
    !document.facets.audience.some((audience) => filters.audiences?.includes(audience))
  )
    return false;
  return true;
}

function scoreDocument(document: SearchDocument, rawQuery: string) {
  const { query, concepts, expandedTokens, phraseBoosts } = expandQuery(rawQuery);
  if (!query || concepts.length === 0)
    return { score: document.metadata.editorialBoost ?? 0, matchedFields: [] };

  const searchableFields = [
    document.titleText,
    document.tagsText,
    document.taxonomyText,
    document.relationshipText,
    document.summaryText,
    document.metadataText,
  ];
  const matchedConcepts = concepts.filter((alternatives) =>
    searchableFields.some((field) => conceptMatches(field, alternatives)),
  ).length;

  if (!enoughMatched(matchedConcepts, concepts.length)) return { score: 0, matchedFields: [] };

  let score = document.metadata.editorialBoost ?? 0;
  const matchedFields = new Set<string>();

  if (document.titleText === query) score += 1400;
  if (document.titleText.startsWith(query)) score += 900;

  for (const phrase of phraseBoosts) {
    if (
      [document.titleText, document.tagsText, document.relationshipText, document.summaryText].some(
        (field) => fieldIncludesPhrase(field, phrase),
      )
    ) {
      score += 180;
      matchedFields.add("synonyms");
    }
  }

  [
    scoreField("title", document.titleText, query, expandedTokens, 120),
    scoreField("tags", document.tagsText, query, expandedTokens, 80),
    scoreField("taxonomy", document.taxonomyText, query, expandedTokens, 56),
    scoreField("relationships", document.relationshipText, query, expandedTokens, 48),
    scoreField("summary", document.summaryText, query, expandedTokens, 22),
    scoreField("metadata", document.metadataText, query, expandedTokens, 12),
  ].forEach((fieldScore) => {
    score += fieldScore.score;
    fieldScore.matchedFields.forEach((field) => matchedFields.add(field));
  });

  if (document.item.type === "MODULE") score += 12;
  if (document.item.type === "COURSE") score += 8;
  if (document.item.type === "PATH") score += 4;

  return {
    score: Math.round(score * coverageFactor(matchedConcepts, concepts.length)),
    matchedFields: [...matchedFields],
  };
}

/**
 * Scores free-standing text against a query with the same rules as catalog
 * items: synonyms, plurals, one-letter typos, filler words ignored, and enough
 * of the query's words matching somewhere (see enoughMatched). The first field is the title (exact and prefix matches count
 * extra). 0 means no match. Used for things that are not catalog items, such
 * as binder topics, drills and reference pages.
 */
export function scoreText(fields: { text: string; weight: number }[], rawQuery: string) {
  const { query, concepts, expandedTokens, phraseBoosts } = expandQuery(rawQuery);
  if (!query || concepts.length === 0 || fields.length === 0) return 0;
  const normalized = fields.map((field) => ({ ...field, text: normalize(field.text) }));
  const matched = concepts.filter((alternatives) =>
    normalized.some((field) => conceptMatches(field.text, alternatives)),
  ).length;
  if (!enoughMatched(matched, concepts.length)) return 0;
  const title = normalized[0].text;
  let score = 0;
  if (title === query) score += 1400;
  if (title.startsWith(query)) score += 900;
  for (const phrase of phraseBoosts) {
    if (normalized.some((field) => fieldIncludesPhrase(field.text, phrase))) score += 180;
  }
  for (const field of normalized) {
    score += scoreField("field", field.text, query, expandedTokens, field.weight).score;
  }
  return Math.round(score * coverageFactor(matched, concepts.length));
}

export function buildSearchIndex(items: LearningItem[]) {
  return items.map(buildSearchDocument);
}

export function getSearchFacetOptions(items: LearningItem[]): SearchFacetOptions {
  const documents = buildSearchIndex(items);

  return {
    types: ["PATH", "COURSE", "MODULE"],
    practiceAreas: [...new Set(documents.map((document) => document.facets.practiceArea))].sort(),
    levels: [...new Set(documents.map((document) => document.facets.level))].sort(),
    audiences: [...new Set(documents.flatMap((document) => document.facets.audience))].sort(),
    statuses: ["Recommended", "New", "Updated", "Core"],
    durations: ["Short", "Medium", "Long"],
  };
}

export function getNoResultSuggestions(query: string) {
  const fallbackTopics = [
    "client intake",
    "ethics",
    "domestic violence",
    "court appearance",
    "Brightspace wrappers",
  ];
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return fallbackTopics;

  const related = new Set<string>();
  queryTokens.forEach((token) => {
    tokenVariants(token).forEach((variant) => {
      synonymGroups.forEach((group) => {
        // Suggest a group by its first, fullest term.
        if (group.some((term) => term.length > 2 && term.includes(variant))) related.add(group[0]);
      });
    });
  });

  return [...related, ...fallbackTopics].slice(0, 5);
}

export function searchLearningItems(
  items: LearningItem[],
  query: string,
  filters?: SearchFacetFilters,
): SearchResult[] {
  const normalizedQuery = normalize(query);
  const documents = buildSearchIndex(items).filter((document) => matchesFacets(document, filters));

  if (!normalizedQuery) {
    return documents.map((document) => ({
      item: document.item,
      document,
      score: document.metadata.editorialBoost ?? 0,
      context: document.context,
      href: document.href,
      matchedFields: [],
    }));
  }

  return documents
    .map((document) => {
      const { score, matchedFields } = scoreDocument(document, query);
      return {
        item: document.item,
        document,
        score,
        context: document.context,
        href: document.href,
        matchedFields,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
}
