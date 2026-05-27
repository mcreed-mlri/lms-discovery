"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { DetailModal } from "@/components/detail-modal";
import { LibraryShell } from "@/components/library-shell";
import { ProgressRing } from "@/components/progress-ring";
import { SearchBox } from "@/components/search-box";
import { SkillGlyph } from "@/components/skill-glyph";
import { getCourseTheme, getSkillTheme } from "@/lib/course-theme";
import {
  continueLearning,
  getLearningItems,
  getModuleSkillId,
  getSkill,
  getSkillModuleCount,
  skills,
  type LearningItem,
  type Level,
  type Skill,
  type SkillId,
} from "@/lib/data";
import { getSearchFacetOptions, getNoResultSuggestions, searchLearningItems, type DurationFacet, type SearchFacetFilters, type SearchResult } from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { ContentLifecycleStatus, SearchAudience } from "@/lib/search-metadata";
import { demoUser, useAuth } from "@/lib/auth";
import { useSavedLearning } from "@/lib/saved-learning";

type Filter = "All" | "Paths" | "Courses" | "Modules";
type ViewMode = "grid" | "list";
type SelectValue<T extends string> = "All" | T;

const filters: Filter[] = ["All", "Paths", "Courses", "Modules"];

function filterToSearchTypes(filter: Filter): SearchFacetFilters["types"] | undefined {
  if (filter === "Paths") return ["PATH"];
  if (filter === "Courses") return ["COURSE"];
  if (filter === "Modules") return ["MODULE"];
  return undefined;
}

function sectionTitle(type: LearningItem["type"]) {
  if (type === "PATH") return "Learning Paths";
  if (type === "COURSE") return "Courses";
  return "Modules";
}

function sectionEyebrow(type: LearningItem["type"]) {
  if (type === "PATH") return "Guided Curriculum";
  if (type === "COURSE") return "Brightspace Courses";
  return "Modules Inside Courses";
}

function getCuratedCatalogItems(items: LearningItem[]) {
  const preferredIds = [
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
  const preferredMatches = preferredIds.map((id) => byId.get(id)).filter((item): item is LearningItem => Boolean(item));
  const remainingMatches = items.filter((item) => !preferredIds.includes(item.id));
  return [...preferredMatches, ...remainingMatches].slice(0, 8);
}

function scrollToBrowse() {
  document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ResultSection({
  title,
  eyebrow,
  items,
  viewMode,
  onOpen,
}: {
  title: string;
  eyebrow: string;
  items: LearningItem[];
  viewMode: ViewMode;
  onOpen: (item: LearningItem) => void;
}) {
  if (items.length === 0) return null;
  const isPathSection = items[0]?.type === "PATH";
  const gridColumns = isPathSection ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-3">
        <div>
          <p className="section-kicker secondary">{eyebrow}</p>
          <h2 className={`section-title ${isPathSection ? "text-2xl" : "text-xl"} mt-1 leading-tight text-[color:var(--ink)]`}>{title}</h2>
        </div>
        <p className="metadata hidden text-[color:var(--ink-soft)] sm:block">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>
      {viewMode === "grid" ? (
        <div className={`grid gap-4 ${gridColumns}`}>
          {items.map((item) =>
            item.type === "PATH" ? (
              <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpen} />
            ) : (
              <ContentCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpen} />
            ),
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <ContentListRow key={`${item.type}-${item.id}`} item={item} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

// "Browse by skill" tile — the primary lens of the homepage. The icon carries
// the topic colour so the grid reads as a calm spread of orientation cues
// rather than eight identical gold tiles.
function SkillTile({ skill, onSelect }: { skill: Skill; onSelect: (id: SkillId) => void }) {
  const count = getSkillModuleCount(skill.id);
  const topic = getSkillTheme(skill.id);
  return (
    <button
      type="button"
      onClick={() => onSelect(skill.id)}
      className="interactive-tile group flex min-h-[8rem] flex-col gap-2 p-3.5 text-left focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${topic.iconWrap}`}>
          <SkillGlyph kind={skill.glyph} className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[0.72rem] font-bold text-[color:var(--ink-soft)]">{count} modules</span>
      </div>
      <h3 className="section-title mt-1 text-base leading-snug text-[color:var(--ink)]">{skill.name}</h3>
      <p className="line-clamp-2 text-sm leading-snug text-[color:var(--ink-muted)]">{skill.blurb}</p>
    </button>
  );
}

export default function Home() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const [skillFilter, setSkillFilter] = useState<SkillId | null>(null);
  const [showRefine, setShowRefine] = useState(false);
  const [practiceAreaFilter, setPracticeAreaFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState<SelectValue<SearchAudience>>("All");
  const [statusFilter, setStatusFilter] = useState<SelectValue<ContentLifecycleStatus>>("All");
  const [durationFilter, setDurationFilter] = useState<SelectValue<DurationFacet>>("All");

  const savedLearning = useSavedLearning();
  const allItems = useMemo(() => getLearningItems(), []);
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
      items = items.filter((item) => item.type === "MODULE" && getModuleSkillId(item.id) === skillFilter);
    }
    return items;
  }, [searchResults, skillFilter]);

  const pathItems = visibleItems.filter((item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH");
  const curatedItems = useMemo(() => getCuratedCatalogItems(visibleItems), [visibleItems]);
  const catalogItems = filter === "All" ? curatedItems : visibleItems;

  const advancedFilterCount = [practiceAreaFilter, levelFilter, audienceFilter, statusFilter, durationFilter].filter(
    (value) => value !== "All",
  ).length;

  const resumeItem = continueLearning[0] as Extract<(typeof continueLearning)[number], { progress: number }>;
  const resumeTheme = getCourseTheme(resumeItem.id);
  const resumeUrl =
    resumeItem.resumeUrl ??
    "https://mlri.brightspace.com/content/enforced/6703-course.outline/notice-types.html?ou=6703&d2l_body_type=3";
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  function selectSkill(id: SkillId) {
    setSkillFilter((current) => (current === id ? null : id));
    setFilter("Modules");
    scrollToBrowse();
  }

  function openSearchResult(result: SearchResult) {
    setQuery(result.item.title);
    recordSearchAnalytics({
      type: "search_result_selected",
      query,
      resultId: result.document.id,
      resultType: result.item.type,
      resultTitle: result.item.title,
    });
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

  // ⌘K / Ctrl-K focuses the command bar — busy advocates should never hunt for it.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[type="search"]');
        input?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
  }, [audienceFilter, durationFilter, filter, levelFilter, practiceAreaFilter, query, statusFilter, visibleItems.length]);

  if (!ready) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[color:var(--ink)]">Preparing your library</h1>
          <p className="mt-2 text-sm font-semibold text-[color:var(--ink-muted)]">Loading your courses, modules, and reading list.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4 py-12">
        <div className="editorial-panel w-full max-w-md rounded-2xl p-7 text-center">
          <p className="editorial-eyebrow">LACE Learning Hub</p>
          <h1 className="hero-title mt-4 text-4xl text-[color:var(--ink)]">Welcome back.</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--ink-muted)]">
            Continue into the curated legal learning library as the demo staff attorney.
          </p>
          <button
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
            type="button"
            onClick={login}
          >
            Continue as {demoUser.firstName}
          </button>
          <a className="mt-4 block text-sm font-bold text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]" href="/login">
            Use the full sign-in page
          </a>
        </div>
      </div>
    );
  }

  const roleSummary = `${user.title} · ${user.unit}`;

  return (
    <LibraryShell
      onNavFilter={(navFilter) => {
        setFilter(navFilter);
        scrollToBrowse();
      }}
    >
        <div className="flex flex-col">
        {/* SEARCH — first on mobile so advocates get to content fast */}
        <section className="sticky-filter order-1 border-b border-[color:var(--line)] bg-[color:var(--bg-surface-soft)] lg:order-2" aria-label="Search the library">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} prominent />
              </div>
              <button
                type="button"
                onClick={() => setShowRefine((value) => !value)}
                aria-expanded={showRefine}
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:h-14 sm:px-4 ${
                  showRefine || advancedFilterCount > 0
                    ? "border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] text-[color:var(--ink)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink-muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
                }`}
              >
                <FilterIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Refine</span>
                {advancedFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--ink)] px-1.5 text-[0.7rem] font-bold text-[color:var(--surface)]">
                    {advancedFilterCount}
                  </span>
                )}
              </button>
            </div>

            {showRefine && (
              <div className="mt-3 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-sm sm:mt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="section-kicker secondary">Refine results</p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="metadata text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none"
                  >
                    Reset all
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <RefineSelect id="practice-area-filter" label="Practice area" value={practiceAreaFilter} onChange={setPracticeAreaFilter} allLabel="All practice areas" options={facetOptions.practiceAreas} />
                  <RefineSelect id="level-filter" label="Level" value={levelFilter} onChange={setLevelFilter} allLabel="All levels" options={facetOptions.levels} />
                  <RefineSelect id="audience-filter" label="Audience" value={audienceFilter} onChange={(value) => setAudienceFilter(value as SelectValue<SearchAudience>)} allLabel="All audiences" options={facetOptions.audiences} />
                  <RefineSelect id="status-filter" label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as SelectValue<ContentLifecycleStatus>)} allLabel="All statuses" options={facetOptions.statuses} />
                  <RefineSelect id="duration-filter" label="Duration" value={durationFilter} onChange={(value) => setDurationFilter(value as SelectValue<DurationFacet>)} allLabel="Any duration" options={facetOptions.durations} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* HERO — compact on mobile; greeting + continue below search */}
        <section className="order-2 border-b border-[color:var(--line)] bg-[color:var(--paper)] lg:order-1">
          <div className="relative mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:gap-6 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.4fr)] lg:items-start lg:gap-8 lg:px-8 lg:py-8">
            <div className="max-w-2xl">
              <p className="metadata hidden text-[color:var(--ink-soft)] sm:block">{dateLabel}</p>
              <h1 className="hero-display text-xl text-[color:var(--ink)] sm:mt-2 sm:text-[2rem] lg:text-[2.35rem]">
                Welcome back, {user.firstName}.
              </h1>
              <p className="metadata mt-2 hidden text-[color:var(--ink-soft)] sm:mt-3 sm:block">{roleSummary}</p>
            </div>

            <aside
              className="hero-continue editorial-panel rounded-[var(--radius-card)] p-3 sm:p-5"
              aria-label="Continue learning"
            >
              <p className="section-kicker primary hidden sm:block">Continue learning</p>
              <div className="flex items-center gap-3 sm:mt-2.5 sm:items-start sm:gap-3.5">
                <div className="sm:hidden">
                  <ProgressRing value={resumeItem.progress} size={40} stroke={4} color={resumeTheme.ring} trackColor="var(--surface-sunken)" label={`${resumeItem.progressLabel ?? resumeItem.progress} complete`}>
                    <span className="text-[0.62rem] font-semibold tabular-nums text-[color:var(--ink)]">
                      {resumeItem.progressLabel ?? `${resumeItem.progress}%`}
                    </span>
                  </ProgressRing>
                </div>
                <div className="hidden sm:block">
                  <ProgressRing value={resumeItem.progress} size={54} stroke={5} color={resumeTheme.ring} trackColor="var(--surface-sunken)" label={`${resumeItem.progressLabel ?? resumeItem.progress} complete`}>
                    <span className="text-[0.7rem] font-semibold tabular-nums text-[color:var(--ink)]">
                      {resumeItem.progressLabel ?? `${resumeItem.progress}%`}
                    </span>
                  </ProgressRing>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="card-title line-clamp-2 text-sm leading-snug text-[color:var(--ink)] sm:text-base">{resumeItem.title}</h2>
                  <p className="metadata mt-0.5 text-[color:var(--ink-soft)] sm:mt-1">Next · {resumeItem.detail}</p>
                </div>
                <a
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--surface-raised)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:hidden"
                  href={resumeUrl}
                  aria-label="Resume learning"
                >
                  <ArrowIcon className="h-4 w-4" />
                </a>
              </div>
              <a
                className="mt-4 hidden h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] text-sm font-bold text-[color:var(--surface-raised)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:inline-flex"
                href={resumeUrl}
              >
                Resume learning <ArrowIcon className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </section>
        </div>

        {/* SKILLS — the primary lens: legal practice as verbs */}
        <section className="mx-auto mt-6 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8" aria-label="Browse by skill">
          <div className="section-panel pt-5 sm:pt-8">
          <div className="flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-3">
            <div>
              <p className="section-kicker secondary">Browse by action</p>
              <h2 className="section-title mt-1 text-xl text-[color:var(--ink)] sm:text-2xl">What do you need to do?</h2>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill) => (
              <SkillTile key={skill.id} skill={skill} onSelect={selectSkill} />
            ))}
          </div>
          </div>
        </section>

        {/* BROWSE — the full catalog, with filter pills + the active lens */}
        <section id="browse" className="mx-auto mt-6 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:px-8" tabIndex={-1} aria-label="Learning content">
          <div className="section-panel pt-5 sm:pt-8">
          <div className="mb-4 border-b border-[color:var(--line)] pb-3">
            <p className="section-kicker secondary">Catalog</p>
            <h2 className="section-title mt-1 text-xl text-[color:var(--ink)] sm:text-2xl">Find the right next step</h2>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="-mx-4 flex max-w-full shrink-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <div className="inline-flex shrink-0 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-1">
              {filters.map((entry) => (
                <button
                  key={entry}
                  className={`h-9 rounded-[8px] px-4 text-xs font-bold transition duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                    filter === entry ? "control-active" : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-raised)] hover:text-[color:var(--ink)]"
                  }`}
                  type="button"
                  onClick={() => setFilter(entry)}
                  aria-pressed={filter === entry}
                >
                  {entry}
                </button>
              ))}
              </div>
            </div>
            {skillFilter && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
              >
                Skill: {getSkill(skillFilter)?.name}
                <span aria-hidden="true">✕</span>
                <span className="sr-only">Clear filter</span>
              </button>
            )}
            <div className="ml-auto hidden rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-1 sm:inline-flex">
              <button className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "grid" ? "control-toggle-active" : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"}`} type="button" onClick={() => setViewMode("grid")} aria-label="Grid view" aria-pressed={viewMode === "grid"}>
                <GridIcon className="h-4 w-4" />
              </button>
              <button className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "list" ? "control-toggle-active" : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"}`} type="button" onClick={() => setViewMode("list")} aria-label="List view" aria-pressed={viewMode === "list"}>
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            filter === "Paths" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pathItems.map((item) => (
                  <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catalogItems.map((item) =>
                  item.type === "PATH" ? (
                    <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
                  ) : (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
                  ),
                )}
              </div>
            )
          ) : (
            <div className="grid gap-4">
              {catalogItems.map((item) => (
                <ContentListRow key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
              ))}
            </div>
          )}

          {catalogItems.length === 0 && (
            <div className="editorial-card rounded-xl border-dashed p-8 text-center">
              <SearchIcon className="mx-auto h-9 w-9 text-[color:var(--ink-soft)]" />
              <h2 className="mt-4 text-xl font-bold text-[color:var(--ink)]">No matching learning content</h2>
              <p className="mt-2 text-base text-[color:var(--ink-muted)]">Try a suggested topic or clear one of the active filters.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {noResultSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-muted)] shadow-sm transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      resetAllFilters();
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        </section>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
        onLaunch={(item) =>
          recordSearchAnalytics({
            type: "brightspace_launched",
            resultId: `${item.type}-${item.id}`,
            resultType: item.type,
            resultTitle: item.title,
          })
        }
      />
    </LibraryShell>
  );
}

function RefineSelect({
  id,
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: readonly string[];
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="metadata mb-1 block text-[color:var(--ink-soft)]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-sm font-bold text-[color:var(--ink-muted)] shadow-sm outline-none transition hover:border-[color:var(--line-strong)] focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#b88a2d]/15"
      >
        <option value="All">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
