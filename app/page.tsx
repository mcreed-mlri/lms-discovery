"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  PathIcon,
  PlayIcon,
  SearchIcon,
} from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { DetailModal } from "@/components/detail-modal";
import { StudioShell } from "@/components/studio-shell";
import { ProgressLine } from "@/components/progress-line";
import { ProgressRing } from "@/components/progress-ring";
import { SearchBox } from "@/components/search-box";
import { SkillGlyph } from "@/components/skill-glyph";
import { getHue } from "@/lib/skill-hue";
import {
  contentUpdates,
  continueLearning,
  courses,
  getLearningItems,
  getModuleSkillId,
  getSkill,
  getSkillModuleCount,
  learnerProgress,
  paths,
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

// Suggested searches under the command bar — a short, scannable set of the
// things a busy advocate reaches for most. Presented as suggestions, not filters.
const popularSearches = ["first appearance", "client intake", "confidentiality", "safety screening"];

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

// "Browse by skill" tile — the primary lens of the homepage. Each tile takes
// the next hue from the 8-hue palette BY INDEX, so the grid reads as one
// systematic family of orientation cues.
function SkillTile({ skill, index, onSelect }: { skill: Skill; index: number; onSelect: (id: SkillId) => void }) {
  const count = getSkillModuleCount(skill.id);
  const hue = getHue(index);
  return (
    <button
      type="button"
      onClick={() => onSelect(skill.id)}
      className="interactive-tile group flex min-h-0 flex-col gap-2 p-3 text-left focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 sm:min-h-[8.25rem] sm:gap-2.5 sm:p-5"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition group-hover:scale-[1.02] sm:h-[46px] sm:w-[46px] sm:rounded-[12px]"
          style={{ background: hue.tint, color: hue.solid }}
        >
          <SkillGlyph kind={skill.glyph} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-1.5 py-0.5 font-mono text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.03em] text-[color:var(--ink-soft)] sm:px-2 sm:text-[0.68rem] sm:leading-5">{count} modules</span>
      </div>
      <h3 className="section-title text-[0.95rem] leading-snug text-[color:var(--ink)] sm:mt-1 sm:text-[1.05rem]">{skill.name}</h3>
      <p className="hidden line-clamp-2 text-[0.9rem] leading-normal text-[color:var(--ink-muted)] sm:block">{skill.blurb}</p>
    </button>
  );
}

// "Changed this week" row — a law/content update inside the updates card.
function UpdateRow({ update, index }: { update: (typeof contentUpdates)[number]; index: number }) {
  const high = update.severity === "high";
  const sevColor = high ? "#c8493b" : "#c8791b";
  const sevBg = high ? "#fbe9e6" : "#fbf0dc";
  return (
    <Link
      href="/updates"
      className={`group flex items-start gap-4 py-[18px] focus:outline-none ${index === 0 ? "" : "border-t border-[color:var(--line-soft)]"}`}
    >
      <span className="mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: sevColor }} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
          <span
            className="rounded-[7px] px-[9px] py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.03em]"
            style={{ background: sevBg, color: sevColor }}
          >
            {update.tag}
          </span>
          <span className="text-[12.5px] text-[color:var(--ink-soft)]">{update.when}</span>
        </div>
        <h3 className="text-[15px] font-[650] leading-snug tracking-[-0.01em] text-[color:var(--ink)] group-hover:text-[color:var(--brand)] group-focus-visible:text-[color:var(--brand)]">{update.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-[color:var(--ink-muted)]">{update.summary}</p>
      </div>
      <span className="mt-0.5 hidden shrink-0 whitespace-nowrap text-[13.5px] font-semibold text-[color:var(--brand)] sm:inline">
        Review →
      </span>
    </Link>
  );
}

// Guided-path card with a hue top-accent bar.
function StudioPathCard({ path, index }: { path: (typeof paths)[number]; index: number }) {
  const hue = getHue(index + 2);
  return (
    <div className="overflow-hidden rounded-[14px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)] transition hover:shadow-[var(--shadow-card)]">
      <div className="h-1.5" style={{ background: hue.solid }} />
      <div className="p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <span style={{ color: hue.solid }}>
            <PathIcon className="h-4 w-4" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-[color:var(--ink-soft)]">Guided path</span>
        </div>
        <h3 className="mb-3.5 text-[17px] font-bold leading-snug tracking-[-0.01em] text-[color:var(--ink)]">{path.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[color:var(--ink-muted)]">
          <span>{path.courseIds.length} course{path.courseIds.length === 1 ? "" : "s"}</span>
          <span>{path.totalDuration.replace(" total", "")}</span>
          <span>{path.level}</span>
        </div>
      </div>
    </div>
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
  const resumeUrl =
    resumeItem.resumeUrl ??
    "https://mlri.brightspace.com/content/enforced/6703-course.outline/notice-types.html?ou=6703&d2l_body_type=3";
  const resumeCourse = courses.find((course) => course.id === resumeItem.id);
  const resumeEyebrow = ["Resume", resumeCourse?.practiceArea, resumeCourse?.duration ? `${resumeCourse.duration} left` : null]
    .filter(Boolean)
    .join(" · ");
  const clePct = Math.round((learnerProgress.cleEarned / learnerProgress.cleRequired) * 100);

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

  // Practice-area rows in the rail link to /?q=<term>#browse. Seed the catalog
  // search from that param on mount so the lens works from any page. (⌘K focus
  // is handled once, app-wide, by StudioShell.)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seeded = params.get("q");
    if (seeded) setQuery(seeded);
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
          <h1 className="hero-title mt-4 text-4xl text-[color:var(--ink)]">Start where the case is.</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--ink-muted)]">
            Continue into focused training for Massachusetts legal aid practice.
          </p>
          <button
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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

  return (
    <StudioShell padded={false}>
      {/* HERO — headline + training hours / streak, search + popular pills, dark Resume card */}
      <section className="border-b border-[color:var(--line)]">
        <div className="mx-auto max-w-[1120px] px-4 py-4 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Top row: headline + training hours / this-week streak */}
          <div className="flex items-start justify-between gap-3 sm:gap-6">
            <h1 className="hero-display min-w-0 text-[1.35rem] leading-[1.1] text-[color:var(--ink)] sm:text-[2.4rem] sm:leading-[1.06] lg:text-[2.6rem]">
              Welcome back, {user.firstName}.
            </h1>

            {/* Mobile: text-only training hours — no ring */}
            <p className="shrink-0 pt-0.5 text-right font-mono text-[11px] leading-tight tabular-nums sm:hidden">
              <span className="block font-semibold uppercase tracking-[0.04em] text-[color:var(--ink-soft)]">Training</span>
              <span className="font-semibold text-[color:var(--ink)]">
                {learnerProgress.cleEarned}/{learnerProgress.cleRequired} hrs
              </span>
            </p>

            <div className="hidden items-center gap-4 sm:flex sm:pt-1.5">
              <div className="flex items-center gap-2.5">
                <ProgressRing
                  value={clePct}
                  size={44}
                  stroke={4}
                  color="var(--brand-fill)"
                  trackColor="var(--surface-sunken)"
                  label={`${clePct}% of training hours goal`}
                >
                  <span className="text-[10px] font-bold tabular-nums text-[color:var(--ink)]">{clePct}%</span>
                </ProgressRing>
                <p className="text-[13px] leading-tight">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-[color:var(--ink-soft)]">
                    Training hours
                  </span>
                  <span className="font-semibold text-[color:var(--ink)]">
                    {learnerProgress.cleEarned}/{learnerProgress.cleRequired} hrs
                  </span>
                </p>
              </div>
              <div className="hidden items-center gap-2.5 border-l border-[color:var(--line)] pl-4 md:flex">
                <span className="text-[13px] text-[color:var(--ink-soft)]">This week</span>
                <div className="flex gap-1" role="img" aria-label="This week's learning activity">
                  {learnerProgress.weeklyActivity.map((day, i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-[3px] ${
                        day === "done"
                          ? "bg-[color:var(--brand-fill)]"
                          : day === "today"
                            ? "border-[1.5px] border-dashed border-[color:var(--brand-fill)]"
                            : "bg-[color:var(--surface-sunken)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main row: search → resume → popular (mobile); search + popular | resume (desktop) */}
          <div className="mt-3 grid gap-3 sm:mt-7 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_27rem] lg:grid-rows-[auto_auto] lg:items-start lg:gap-8">
            <div className="lg:col-start-1 lg:row-start-1">
              <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} prominent />
            </div>

            <aside
              className="rounded-[12px] bg-[color:var(--ink)] p-3.5 shadow-[var(--shadow-card)] sm:rounded-[14px] sm:p-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start"
              aria-label="Resume learning"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-white/55 sm:text-[11px]">
                      <span className="sm:hidden">Resume · {resumeCourse?.practiceArea ?? "Learning"}</span>
                      <span className="hidden sm:inline">{resumeEyebrow}</span>
                    </p>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/55 sm:text-[12px]">{resumeItem.progress}%</span>
                  </div>
                  <h2 className="mt-1 text-[15px] font-bold leading-snug tracking-[-0.01em] text-white sm:mt-2 sm:text-[17px]">{resumeItem.title}</h2>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-white/60 sm:mt-1 sm:text-[13px]">Up next: {resumeItem.detail}</p>
                  <ProgressLine
                    value={resumeItem.progress}
                    color="var(--brand-fill)"
                    trackColor="rgba(255,255,255,0.16)"
                    height={4}
                    label={`${resumeItem.title} — ${resumeItem.progress}% complete`}
                    className="mt-2 sm:mt-3.5"
                  />
                </div>
                <a
                  href={resumeUrl}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[color:var(--brand-fill)] text-white shadow-[0_1px_2px_rgba(42,91,255,0.25)] transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-white/25 sm:hidden"
                  aria-label={`Resume ${resumeItem.title}`}
                >
                  <PlayIcon className="h-[15px] w-[15px]" />
                </a>
              </div>
              <a
                href={resumeUrl}
                className="mt-3 hidden h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-[color:var(--brand-fill)] px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(42,91,255,0.25)] transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-white/25 sm:inline-flex sm:mt-4 sm:w-auto"
              >
                <PlayIcon className="h-[15px] w-[15px]" /> Resume
              </a>
            </aside>

            <div className="hidden lg:col-start-1 lg:row-start-2 sm:block">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-[color:var(--ink-soft)]">Popular:</span>
                {popularSearches.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      scrollToBrowse();
                    }}
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-[13px] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE BY SKILL — the primary lens: legal practice as verbs */}
      <section className="mx-auto max-w-[1120px] px-4 py-5 sm:px-6 sm:py-9 lg:px-10" aria-label="Browse by skill">
        <SectionHead kicker="Practical skills" title="What do you need to do?" />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill, i) => (
            <SkillTile key={skill.id} skill={skill} index={i} onSelect={selectSkill} />
          ))}
        </div>
      </section>

      {/* CHANGED THIS WEEK + GUIDED PATHS */}
      <section className="mx-auto grid max-w-[1120px] gap-8 px-4 pb-2 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:px-10">
        <div>
          <SectionHead kicker="Keep current" title="What changed recently" actionHref="/updates" actionLabel="All updates" />
          <div className="rounded-[14px] border border-[color:var(--line)] bg-[color:var(--surface)] px-4 pb-3 pt-1 shadow-[var(--shadow-card)] sm:px-[22px]">
            {contentUpdates.map((u, i) => (
              <UpdateRow key={u.id} update={u} index={i} />
            ))}
          </div>
        </div>
        <div>
          <SectionHead kicker="Guided learning" title="Follow a clear path" />
          <div className="flex flex-col gap-4">
            {paths.map((p, i) => (
              <StudioPathCard key={p.id} path={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG — the full library, with filter pills + the active lens */}
      <section id="browse" className="mx-auto max-w-[1120px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10" tabIndex={-1} aria-label="Learning content">
          <div className="mb-5 border-b border-[color:var(--line)] pb-3.5">
            <p className="section-kicker secondary">Library</p>
            <h2 className="section-title mt-1 text-[1.35rem] text-[color:var(--ink)] sm:text-[1.65rem]">All learning options</h2>
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowRefine((value) => !value)}
              aria-expanded={showRefine}
              className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3 text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 ${
                showRefine || advancedFilterCount > 0
                  ? "border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] text-[color:var(--ink)]"
                  : "border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink-muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              Refine
              {advancedFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--ink)] px-1.5 text-[0.7rem] font-bold text-[color:var(--surface)]">
                  {advancedFilterCount}
                </span>
              )}
            </button>
            <div className="-mx-4 flex max-w-full shrink-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <div className="inline-flex shrink-0 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-1">
              {filters.map((entry) => (
                <button
                  key={entry}
                  className={`h-9 rounded-[8px] px-4 text-xs font-bold transition duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 ${
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
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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

          {showRefine && (
            <div className="mb-5 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-xs)]">
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
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-muted)] shadow-sm transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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
    </StudioShell>
  );
}

// Section header — mono kicker, title, optional action link (Studio style).
function SectionHead({
  kicker,
  title,
  actionHref,
  actionLabel,
}: {
  kicker: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 sm:mb-[18px]">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--ink-soft)] sm:text-[11px]">{kicker}</p>
        <h2 className="section-title mt-1 text-[1.2rem] text-[color:var(--ink)] sm:mt-2 sm:text-[1.5rem]">{title}</h2>
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[color:var(--brand)]">
          {actionLabel}
          <ArrowIcon className="h-[15px] w-[15px]" />
        </Link>
      )}
    </div>
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
        className="h-11 w-full rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 text-sm font-bold text-[color:var(--ink-muted)] shadow-sm outline-none transition hover:border-[color:var(--line-strong)] focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#2a5bff]/15"
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
