"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { getEligibleLearningItems, type AccessProfile } from "@/lib/access";
import {
  getLearningItems,
  getModuleSkillId,
  skills,
  type LearningItem,
  type Level,
  type SkillId,
} from "@/lib/data";
import { scrollToBrowse } from "@/lib/home-helpers";
import {
  getSearchFacetOptions,
  getNoResultSuggestions,
  searchLearningItems,
  type DurationFacet,
  type SearchFacetFilters,
} from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { ContentLifecycleStatus, SearchAudience } from "@/lib/search-metadata";

export type Filter = "All" | "Paths" | "Courses" | "Modules";
export type ViewMode = "grid" | "list";
export type SelectValue<T extends string> = "All" | T;

export const filters: Filter[] = ["All", "Paths", "Courses", "Modules"];

function filterToSearchTypes(filter: Filter): SearchFacetFilters["types"] | undefined {
  if (filter === "Paths") return ["PATH"];
  if (filter === "Courses") return ["COURSE"];
  if (filter === "Modules") return ["MODULE"];
  return undefined;
}

function getCuratedCatalogItems(items: LearningItem[], limit?: number) {
  // Lead the default "All" view with the genuinely-available offerings, then
  // let the curriculum-map "Coming soon" items fill in behind them.
  const preferredIds = [
    "welcome-to-lace",
    "eviction-defense-48h",
    "clock-starts",
    "notice-types",
    "drafting-answer",
    "walking-into-housing-court",
    "brightspace-wrapper-demo",
    "faculty-starter",
  ];
  const byId = new Map(items.map((item) => [item.id, item]));
  const preferredMatches = preferredIds
    .map((id) => byId.get(id))
    .filter((item): item is LearningItem => Boolean(item));
  const remainingMatches = items.filter((item) => !preferredIds.includes(item.id));
  // Built/real offerings first, then the rest of the curriculum. On the
  // homepage we show a capped preview; the full set lives on /browse.
  const ordered = [...preferredMatches, ...remainingMatches];
  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

// All catalog search/filter state for the homepage, plus the derived item
// lists. This is the seam where a future Supabase-backed catalog can replace
// getLearningItems() without touching the page UI.
export function useCatalogFilters(
  user: AccessProfile | null | undefined,
  options: { previewLimit?: number } = {},
) {
  const { previewLimit } = options;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [skillFilter, setSkillFilter] = useState<SkillId | null>(null);
  const [showRefine, setShowRefine] = useState(false);
  const [practiceAreaFilter, setPracticeAreaFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState<SelectValue<SearchAudience>>("All");
  const [statusFilter, setStatusFilter] = useState<SelectValue<ContentLifecycleStatus>>("All");
  const [durationFilter, setDurationFilter] = useState<SelectValue<DurationFacet>>("All");

  /**
   * Scoring is ~99% of a query's cost (the index itself is cached per item in
   * lib/search.ts), and it runs over every catalog item on every keystroke. At
   * today's ~100 items that is under a millisecond, but it is synchronous work
   * between the keypress and the next paint, and it grows with the catalog.
   *
   * Deferring the value keeps the input itself responsive: React renders the
   * typed character immediately and re-runs the search at lower priority,
   * interrupting it if another key arrives. `query` still drives the input, so
   * typing never lags; `deferredQuery` drives the expensive derivation.
   */
  const deferredQuery = useDeferredValue(query);

  const allItems = useMemo(() => getEligibleLearningItems(getLearningItems(), user), [user]);
  const facetOptions = useMemo(() => getSearchFacetOptions(allItems), [allItems]);
  const activeSearchFilters = useMemo<SearchFacetFilters>(
    () => ({
      types: filterToSearchTypes(filter),
      practiceAreas: practiceAreaFilter === "All" ? undefined : [practiceAreaFilter],
      levels: levelFilter === "All" ? undefined : [levelFilter as Level],
      audiences: audienceFilter === "All" ? undefined : [audienceFilter],
      statuses: statusFilter === "All" ? undefined : [statusFilter],
      durations: durationFilter === "All" ? undefined : [durationFilter],
    }),
    [audienceFilter, durationFilter, filter, levelFilter, practiceAreaFilter, statusFilter],
  );
  const searchResults = useMemo(
    () => searchLearningItems(allItems, deferredQuery, activeSearchFilters),
    [allItems, deferredQuery, activeSearchFilters],
  );
  const searchSuggestions = useMemo(() => searchResults.slice(0, 6), [searchResults]);
  const noResultSuggestions = useMemo(() => getNoResultSuggestions(deferredQuery), [deferredQuery]);

  // Search results, then narrowed by the homepage skill lens.
  const visibleItems = useMemo(() => {
    let items = searchResults.map((result) => result.item);
    if (skillFilter) {
      items = items.filter(
        (item) => item.type === "MODULE" && getModuleSkillId(item.id) === skillFilter,
      );
    }
    return items;
  }, [searchResults, skillFilter]);

  const pathItems = visibleItems.filter(
    (item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH",
  );
  const eligiblePathItems = allItems.filter(
    (item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH",
  );
  const visibleModuleItems = allItems.filter(
    (item): item is Extract<LearningItem, { type: "MODULE" }> => item.type === "MODULE",
  );
  // Only show skill lenses the signed-in user actually has content for. For a
  // non-lawyer advocate this drops courtroom/negotiation/litigation tiles —
  // skills outside their role (and the UPL boundary) — rather than dead "0 modules" cards.
  const skillTiles = skills
    .map((skill) => ({
      skill,
      count: visibleModuleItems.filter((module) => getModuleSkillId(module.id) === skill.id).length,
    }))
    .filter((entry) => entry.count > 0);
  const curatedItems = useMemo(
    () => getCuratedCatalogItems(visibleItems, previewLimit),
    [visibleItems, previewLimit],
  );
  const catalogItems =
    filter === "All"
      ? curatedItems
      : previewLimit
        ? visibleItems.slice(0, previewLimit)
        : visibleItems;
  // How many items the current search/lens actually matches, and whether the
  // homepage preview is hiding some (drives the "See all" affordance).
  const catalogTotal = visibleItems.length;
  const hasMoreThanPreview = previewLimit ? visibleItems.length > previewLimit : false;

  const advancedFilterCount = [
    practiceAreaFilter,
    levelFilter,
    audienceFilter,
    statusFilter,
    durationFilter,
  ].filter((value) => value !== "All").length;

  function selectSkill(id: SkillId) {
    setSkillFilter((current) => (current === id ? null : id));
    setFilter("Modules");
    scrollToBrowse();
  }

  function resetAllFilters() {
    setPracticeAreaFilter("All");
    setLevelFilter("All");
    setAudienceFilter("All");
    setStatusFilter("All");
    setDurationFilter("All");
    setSkillFilter(null);
    setFilter("All");
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      recordSearchAnalytics({
        // deferredQuery, not query: visibleItems derives from the deferred value,
        // so logging the live one could pair a query with the previous query's
        // result count — which would corrupt zero-result tracking, the single most
        // useful signal this records.
        type: "search_performed",
        query: deferredQuery,
        resultCount: visibleItems.length,
        filters: {
          type: filter,
          practiceArea: practiceAreaFilter,
          level: levelFilter,
          audience: audienceFilter,
          status: statusFilter,
          duration: durationFilter,
        },
      });
    }, 450);

    return () => window.clearTimeout(handle);
  }, [
    audienceFilter,
    durationFilter,
    filter,
    levelFilter,
    practiceAreaFilter,
    deferredQuery,
    statusFilter,
    visibleItems.length,
  ]);

  return {
    query,
    setQuery,
    filter,
    setFilter,
    viewMode,
    setViewMode,
    skillFilter,
    showRefine,
    setShowRefine,
    practiceAreaFilter,
    setPracticeAreaFilter,
    levelFilter,
    setLevelFilter,
    audienceFilter,
    setAudienceFilter,
    statusFilter,
    setStatusFilter,
    durationFilter,
    setDurationFilter,
    allItems,
    facetOptions,
    searchSuggestions,
    noResultSuggestions,
    pathItems,
    eligiblePathItems,
    skillTiles,
    catalogItems,
    catalogTotal,
    hasMoreThanPreview,
    advancedFilterCount,
    selectSkill,
    resetAllFilters,
  };
}

export type CatalogFilters = ReturnType<typeof useCatalogFilters>;
