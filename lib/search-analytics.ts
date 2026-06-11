type SearchAnalyticsEvent =
  | {
      type: "search_performed";
      query: string;
      resultCount: number;
      filters: Record<string, string>;
    }
  | {
      type: "search_result_selected";
      query: string;
      resultId: string;
      resultType: string;
      resultTitle: string;
    }
  | {
      type: "brightspace_launched";
      resultId: string;
      resultType: string;
      resultTitle: string;
    };

type SearchAnalyticsStore = {
  searches: Record<string, { count: number; lastResultCount: number; lastSearchedAt: string }>;
  zeroResultQueries: Record<string, { count: number; lastSearchedAt: string }>;
  selections: Record<
    string,
    { count: number; title: string; type: string; lastSelectedAt: string }
  >;
  launches: Record<string, { count: number; title: string; type: string; lastLaunchedAt: string }>;
};

const storageKey = "lace-search-analytics-v1";

function emptyStore(): SearchAnalyticsStore {
  return {
    searches: {},
    zeroResultQueries: {},
    selections: {},
    launches: {},
  };
}

function readStore(): SearchAnalyticsStore {
  if (typeof window === "undefined") return emptyStore();

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    return rawValue ? { ...emptyStore(), ...JSON.parse(rawValue) } : emptyStore();
  } catch {
    return emptyStore();
  }
}

function writeStore(store: SearchAnalyticsStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(store));
}

function normalizeQuery(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function compactFilters(filters: Record<string, string>) {
  return Object.entries(filters)
    .filter(([, value]) => value && value !== "All")
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

export function recordSearchAnalytics(event: SearchAnalyticsEvent) {
  if (typeof window === "undefined") return;

  const store = readStore();
  const now = new Date().toISOString();

  if (event.type === "search_performed") {
    const query = normalizeQuery(event.query);
    if (!query) return;
    const key = compactFilters(event.filters) ? `${query}|${compactFilters(event.filters)}` : query;
    const current = store.searches[key] ?? { count: 0, lastResultCount: 0, lastSearchedAt: now };
    store.searches[key] = {
      count: current.count + 1,
      lastResultCount: event.resultCount,
      lastSearchedAt: now,
    };

    if (event.resultCount === 0) {
      const zeroResult = store.zeroResultQueries[query] ?? { count: 0, lastSearchedAt: now };
      store.zeroResultQueries[query] = { count: zeroResult.count + 1, lastSearchedAt: now };
    }
  }

  if (event.type === "search_result_selected") {
    const current = store.selections[event.resultId] ?? {
      count: 0,
      title: event.resultTitle,
      type: event.resultType,
      lastSelectedAt: now,
    };
    store.selections[event.resultId] = {
      ...current,
      count: current.count + 1,
      lastSelectedAt: now,
    };
  }

  if (event.type === "brightspace_launched") {
    const current = store.launches[event.resultId] ?? {
      count: 0,
      title: event.resultTitle,
      type: event.resultType,
      lastLaunchedAt: now,
    };
    store.launches[event.resultId] = { ...current, count: current.count + 1, lastLaunchedAt: now };
  }

  writeStore(store);
  window.dispatchEvent(new CustomEvent("lace-search-analytics", { detail: event }));
}

export function readSearchAnalytics() {
  return readStore();
}
