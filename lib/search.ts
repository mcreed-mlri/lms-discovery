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

const phraseSynonyms: Record<string, string[]> = {
  "client intake": ["client interview", "intake", "fact gathering"],
  "client interview": ["client intake", "intake", "fact gathering"],
  "court appearance": ["hearing", "first appearance", "courtroom procedure"],
  "domestic violence": ["dv", "safety screening", "crisis recognition"],
  "legal services": ["legal aid", "public interest"],
};

const tokenSynonyms: Record<string, string[]> = {
  dv: ["domestic", "violence", "safety", "screening"],
  d2l: ["brightspace"],
  // A common misspelling, two letters off, so the one-typo rule misses it.
  heresay: ["hearsay"],
  hearing: ["court", "appearance", "courtroom"],
  intake: ["interview", "client", "screening"],
  lawyer: ["attorney"],
  lawyers: ["attorney", "attorneys"],
  motion: ["motions", "court", "procedure"],
  motions: ["motion", "court", "procedure"],
  privilege: ["confidentiality"],
  trauma: ["trauma-informed"],
};

/* Words that carry no topic on their own. A question like "how do I respond
   to a hearsay objection" is matched on "respond hearsay objection". If a
   query is nothing but these words, they are kept so it can still match. */
const STOP_WORDS = new Set(
  (
    "a about after an and any are as at be been before but by can could did do does doing " +
    "during for from get gets getting got had has have how i if in into is it its just me " +
    "my need needs of on or our should so than that the their them then there these they " +
    "this to too up us was we were what when where which while who why will with would " +
    "you your many much"
  ).split(" "),
);

/** Query words that carry meaning: filler words dropped, unless nothing is left. */
function meaningfulTokens(tokens: string[]) {
  const kept = tokens.filter((token) => !STOP_WORDS.has(token));
  return kept.length > 0 ? kept : tokens;
}

/**
 * How many query words a result must match. One or two words: all of them.
 * Longer queries, which are usually questions or situations: at least half,
 * and the score then scales with the share matched, so fuller matches lead.
 */
function enoughMatched(matched: number, total: number) {
  return total <= 2 ? matched === total : matched >= Math.ceil(total / 2);
}

function coverageFactor(matched: number, total: number) {
  return (matched / total) ** 2;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenVariants(token: string) {
  const normalizedToken = normalize(token);
  const variants = new Set([normalizedToken, ...(tokenSynonyms[normalizedToken] ?? [])]);

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

function tokenize(value: string) {
  return normalize(value).split(" ").filter(Boolean);
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
  const query = normalize(rawQuery);
  const tokens = meaningfulTokens(tokenize(rawQuery));
  const expandedTokens = new Set(tokens);
  const phraseBoosts = new Set<string>();

  for (const [phrase, synonyms] of Object.entries(phraseSynonyms)) {
    if (query.includes(phrase)) {
      phraseBoosts.add(phrase);
      synonyms.forEach((synonym) => {
        phraseBoosts.add(synonym);
        tokenize(synonym).forEach((token) => expandedTokens.add(token));
      });
    }
  }

  tokens.forEach((token) => tokenVariants(token).forEach((variant) => expandedTokens.add(variant)));

  return {
    query,
    tokens,
    expandedTokens: [...expandedTokens],
    phraseBoosts: [...phraseBoosts],
  };
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
  const { query, tokens, expandedTokens, phraseBoosts } = expandQuery(rawQuery);
  if (!query || tokens.length === 0)
    return { score: document.metadata.editorialBoost ?? 0, matchedFields: [] };

  const searchableFields = [
    document.titleText,
    document.tagsText,
    document.taxonomyText,
    document.relationshipText,
    document.summaryText,
    document.metadataText,
  ];
  const matchedTokens = tokens.filter((token) =>
    searchableFields.some((field) => fieldIncludesToken(field, token)),
  ).length;

  if (!enoughMatched(matchedTokens, tokens.length)) return { score: 0, matchedFields: [] };

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
    score: Math.round(score * coverageFactor(matchedTokens, tokens.length)),
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
  const { query, tokens, expandedTokens, phraseBoosts } = expandQuery(rawQuery);
  if (!query || tokens.length === 0 || fields.length === 0) return 0;
  const normalized = fields.map((field) => ({ ...field, text: normalize(field.text) }));
  const matched = tokens.filter((token) =>
    normalized.some((field) => fieldIncludesToken(field.text, token)),
  ).length;
  if (!enoughMatched(matched, tokens.length)) return 0;
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
  return Math.round(score * coverageFactor(matched, tokens.length));
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
      Object.entries(phraseSynonyms).forEach(([phrase, synonyms]) => {
        if (
          phrase.includes(variant) ||
          synonyms.some((synonym) => normalize(synonym).includes(variant))
        )
          related.add(phrase);
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
