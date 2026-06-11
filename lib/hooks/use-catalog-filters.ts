"use client";

import { useEffect, useMemo, useState } from "react";

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

function getCuratedCatalogItems(items: LearningItem[]) {
  const preferredIds = [
    "advocate-upl-onboarding",
    "upl-boundaries-advocates",
    "new-attorney-foundations",
    "client-centered-communication-path",
    "client-centered-practice",
    "first-steps-in-court",
    "first-client-interview",
    "first-appearance-checklist",
    "safety-screening",
    "ethics-and-confidentiality",
  ];
  const byId = new Map(items.map((item) => [item.id, item]));
  const preferredMatches = preferredIds
    .map((id) => byId.get(id))
    .filter((item): item is LearningItem => Boolean(item));
  const remainingMatches = items.filter((item) => !preferredIds.includes(item.id));
  return [...preferredMatches, ...remainingMatches].slice(0, 8);
}

// All catalog search/filter state for the homepage, plus the derived item
// lists. This is the seam where a future Supabase-backed catalog can replace
// getLearningItems() without touching the page UI.
export function useCatalogFilters(user: AccessProfile | null | undefined) {
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
    () => searchLearningItems(allItems, query, activeSearchFilters),
    [allItems, query, activeSearchFilters],
  );
  const searchSuggestions = useMemo(() => searchResults.slice(0, 6), [searchResults]);
  const noResultSuggestions = useMemo(() => getNoResultSuggestions(query), [query]);

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
  const curatedItems = useMemo(() => getCuratedCatalogItems(visibleItems), [visibleItems]);
  const catalogItems = filter === "All" ? curatedItems : visibleItems;

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
        type: "search_performed",
        query,
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
    query,
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
    advancedFilterCount,
    selectSkill,
    resetAllFilters,
  };
}

export type CatalogFilters = ReturnType<typeof useCatalogFilters>;
