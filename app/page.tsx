"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon, BookIcon, CalendarIcon, FilterIcon, FlagIcon, FolderIcon, GridIcon, HomeIcon, ListIcon, PathIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { DetailModal } from "@/components/detail-modal";
import { SearchBox } from "@/components/search-box";
import { getCourseLabel } from "@/lib/course-theme";
import { continueLearning, courses, getLearningItems, modules, popularTopics, type LearningItem } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";
import { demoUser, useAuth } from "@/lib/auth";

type Filter = "All" | "Paths" | "Courses" | "Modules";
type ViewMode = "grid" | "list";

const filters: Filter[] = ["All", "Paths", "Courses", "Modules"];

const filterContext: Record<Filter, string> = {
  All: "All Practice Areas",
  Paths: "Learning Paths",
  Courses: "Courses",
  Modules: "Modules",
};

const sideNavItems = [
  { title: "Home", href: "#", icon: HomeIcon },
  { title: "Browse", href: "#browse", icon: SearchIcon },
  { title: "My Learning", href: "#learning", icon: BookIcon },
  { title: "Paths", href: "#browse", icon: PathIcon, filter: "Paths" as Filter },
  { title: "Topics", href: "#topics", icon: FolderIcon },
  { title: "New", href: "#browse", icon: SparkIcon },
];

function filterMatches(item: LearningItem, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Paths") return item.type === "PATH";
  if (filter === "Courses") return item.type === "COURSE";
  return item.type === "MODULE";
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

function sectionDescription(type: LearningItem["type"]) {
  if (type === "PATH") return "Structured routes through related training areas.";
  if (type === "COURSE") return "Core Brightspace courses organized by practice focus.";
  return "Focused training units inside the course catalog.";
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
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-[color:var(--lace-hairline)] pb-3">
        <div>
          <p className="section-kicker secondary">{eyebrow}</p>
          <h2 className={`section-title ${isPathSection ? "text-2xl" : "text-xl"} mt-1 leading-tight text-[#25221d]`}>{title}</h2>
          <p className="mt-1 text-sm font-medium text-[color:var(--lace-muted-strong)]">{sectionDescription(items[0].type)}</p>
        </div>
        <p className="metadata hidden rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-2.5 py-1 text-[#706a5f] sm:block">
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

export default function Home() {
  const { user, ready, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const allItems = useMemo(() => getLearningItems(), []);
  const searchResults = useMemo(() => searchLearningItems(allItems, query), [allItems, query]);
  const searchSuggestions = useMemo(() => searchResults.slice(0, 6), [searchResults]);

  const visibleItems = useMemo(() => {
    const sourceItems = query.trim() ? searchResults.map((result) => result.item) : allItems;
    return sourceItems.filter((item) => filterMatches(item, filter));
  }, [allItems, query, filter, searchResults]);

  const pathItems = visibleItems.filter((item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH");
  const selectedCourseTopic = courses.find((course) => getCourseLabel(course) === query)?.id ?? "";
  const learningSummary = {
    completedCourses: 1,
    totalCourses: courses.length,
    completedModules: 4,
    totalModules: modules.length,
    hoursThisMonth: 6.5,
  };
  const resumeItem = continueLearning[0] as Extract<(typeof continueLearning)[number], { progress: number }>;
  const groupedItems = {
    PATH: visibleItems.filter((item) => item.type === "PATH"),
    COURSE: visibleItems.filter((item) => item.type === "COURSE"),
    MODULE: visibleItems.filter((item) => item.type === "MODULE"),
  } satisfies Record<LearningItem["type"], LearningItem[]>;

  function selectTopic(topic: string) {
    setQuery(topic);
    setFilter("All");
  }

  function openSearchResult(result: SearchResult) {
    setQuery(result.item.title);
  }

  if (!ready) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[#1f1d19]">Preparing your library</h1>
          <p className="mt-2 text-sm font-semibold text-[color:var(--lace-muted-strong)]">Loading your courses, modules, and reading list.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4 py-12">
        <div className="editorial-panel w-full max-w-md rounded-2xl p-7 text-center">
          <p className="editorial-eyebrow">LACE Learning Hub</p>
          <h1 className="hero-title mt-4 text-4xl text-[#1f1d19]">Welcome back.</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--lace-muted-strong)]">
            Continue into the curated legal learning library as the demo staff attorney.
          </p>
          <button
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#1f1d19] px-6 text-sm font-bold text-[#fffaf0] shadow-[0_14px_30px_rgba(31,29,25,0.18)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15"
            type="button"
            onClick={login}
          >
            Continue as {demoUser.firstName}
          </button>
          <a className="mt-4 block text-sm font-bold text-[#706a5f] hover:text-[#1f1d19]" href="/login">
            Use the full sign-in page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <a className="skip-link" href="#browse">
        Skip to learning content
      </a>
      <header className="sticky top-0 z-40 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/92 text-[color:var(--ink)] shadow-[0_8px_26px_rgba(40,32,20,0.055)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-fit items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-label="MLRI Learning Hub home">
            <span className="leading-none">
              <span className="block text-[1.85rem] font-normal tracking-[-0.055em]">LACE</span>
              <span className="nav-label mt-1 block text-[#786f62]">Learning Hub</span>
            </span>
          </a>

          <nav className="nav-label ml-auto hidden items-center gap-5 text-[#3a352d] md:flex" aria-label="Account">
            <a className="rounded-md transition hover:text-[#9d7a35] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" href="#browse">Library</a>
            <a className="rounded-md transition hover:text-[#9d7a35] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" href="#learning">Programs</a>
            <div className="flex items-center gap-3 border-l border-[color:var(--lace-hairline)] pl-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d19] text-xs font-bold text-[#fffaf0]">
                {user.initials}
              </div>
              <span className="sr-only">{user.firstName}</span>
              <button
                onClick={logout}
                className="text-[#706a5f] transition hover:text-[#1f1d19] focus:outline-none"
                aria-label={`Sign out ${user.firstName}`}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[4.75rem] z-30 hidden w-44 border-r border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/88 shadow-[16px_0_34px_rgba(40,32,20,0.035)] backdrop-blur lg:block">
        <nav className="flex h-full flex-col gap-2 px-3 py-5" aria-label="Primary">
          {sideNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 0;
            return (
              <a
                key={item.title}
                href={item.href}
                onClick={() => item.filter && setFilter(item.filter)}
                className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                  isActive ? "bg-[#e5d7c2] text-[#171713] shadow-[inset_0_0_0_1px_rgba(23,23,19,0.08)]" : "text-[#5f5a4f] hover:bg-[#fffaf0] hover:text-[#171713]"
                }`}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </a>
            );
          })}
          <div className="mt-auto border-t border-[color:var(--lace-hairline)] pt-4">
            <p className="text-sm font-bold text-[#25221d]">Maya Okafor</p>
            <p className="text-xs font-semibold text-[#81786a]">{user.title}</p>
          </div>
        </nav>
      </aside>

      <main id="main-content" className="lg:pl-44">
        <section id="learning" className="relative overflow-hidden border-b border-[color:var(--border-subtle)]">
          <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)] lg:items-center lg:px-8">
            <div className="max-w-xl">
              <p className="section-kicker primary">Welcome back, {user.firstName}</p>
              <h1 className="hero-title mt-3 max-w-[34rem] text-[2.45rem] text-[#171713] sm:text-[3.15rem]">Keep learning. Make impact.</h1>
              <p className="mt-3 text-base font-semibold text-[color:var(--lace-muted-strong)]">{user.title} - {user.unit}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <dd className="text-2xl font-bold text-[#1f1d19]">{learningSummary.completedCourses}/{learningSummary.totalCourses}</dd>
                  <dt className="stat-label mt-0.5 text-[#7d7467]">Courses</dt>
                </div>
                <div>
                  <dd className="text-2xl font-bold text-[#1f1d19]">{learningSummary.completedModules}/{learningSummary.totalModules}</dd>
                  <dt className="stat-label mt-0.5 text-[#7d7467]">Modules</dt>
                </div>
                <div>
                  <dd className="text-2xl font-bold text-[#1f1d19]">{learningSummary.hoursThisMonth}</dd>
                  <dt className="stat-label mt-0.5 text-[#7d7467]">Hours this month</dt>
                </div>
              </dl>
            </div>
            <aside className="editorial-panel rounded-[var(--radius-card)] p-5 shadow-[0_16px_42px_rgba(40,32,20,0.075)]" aria-label="Learning snapshot">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="section-kicker primary">Continue learning</p>
                  <h2 className="mt-3 max-w-[17rem] text-[1.04rem] font-bold leading-snug tracking-[-0.005em] text-[#25221d]">{resumeItem.title}</h2>
                  <p className="mt-2 font-mono text-[0.72rem] font-bold uppercase leading-4 tracking-[0.055em] text-[#6f6658]">{resumeItem.detail} - {resumeItem.progress}% complete</p>
                </div>
                <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[#f3e5c2] text-sm font-bold text-[#7d5919] shadow-[inset_0_0_0_1px_rgba(184,137,47,0.12)] transition hover:bg-[#ead8ae] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" type="button" aria-label="Resume Professional Foundations for Legal Aid">
                  PF
                </button>
              </div>
              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6dccb] shadow-[inset_0_1px_2px_rgba(40,32,20,0.08)]"
                role="progressbar"
                aria-label={`${resumeItem.title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={resumeItem.progress}
              >
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#a97824,#c89a3f)]" style={{ width: `${resumeItem.progress}%` }} />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[color:var(--lace-muted-strong)]">
                  <FlagIcon className="h-4 w-4 shrink-0 text-[#b88a2d]" />
                  <span className="truncate">Next: Inside a Legal Aid Office</span>
                </p>
                <button className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[#171713] px-4 text-sm font-bold text-[#fffaf0] shadow-[0_10px_22px_rgba(23,23,19,0.16)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15" type="button">
                  Resume Reading <ArrowIcon className="h-4 w-4" />
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section className="sticky-filter z-30 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/88 shadow-[0_14px_34px_rgba(40,32,20,0.055)] backdrop-blur-xl" aria-label="Search and filter learning content">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 lg:grid-cols-[minmax(28rem,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} prominent />
              </div>
              <p className="metadata inline-flex h-10 w-fit items-center gap-2 rounded-md border border-[color:var(--lace-hairline-strong)] bg-[#fffdf7] px-3 text-[#706a5f] lg:mt-2 lg:justify-self-end" role="status" aria-live="polite">
                <CalendarIcon className="h-4 w-4 text-[#9d7a35]" />
                {visibleItems.length} available
              </p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0" aria-label="Learning filters">
              <div className="inline-flex shrink-0 rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[#eee4d3] p-1 shadow-sm">
                {filters.map((entry) => (
                  <button
                    key={entry}
                    className={`h-9 rounded-[10px] px-4 text-xs font-bold transition duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                      filter === entry ? "bg-[#171713] text-[#fffaf0] shadow-sm" : "text-[#5f5a4f] hover:bg-[#fffaf0] hover:text-[#171713]"
                    }`}
                    type="button"
                    onClick={() => setFilter(entry)}
                    aria-pressed={filter === entry}
                  >
                    {entry}
                  </button>
                ))}
              </div>
              <span className="hidden h-8 w-px shrink-0 bg-[color:var(--lace-hairline)] sm:block" />
              <label className="sr-only" htmlFor="topic-filter">Topic</label>
              <select
                id="topic-filter"
                value={selectedCourseTopic}
                onChange={(event) => {
                  const course = courses.find((entry) => entry.id === event.target.value);
                  setQuery(course ? getCourseLabel(course) : "");
                  setFilter("All");
                }}
                className="h-11 w-44 shrink-0 rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[#fffdf7] px-4 pr-9 text-sm font-bold text-[#5f5a4f] shadow-sm outline-none transition hover:border-[color:var(--border-strong)] hover:text-[#171713] focus:border-[#b88a2d] focus:ring-4 focus:ring-[#b88a2d]/15"
              >
                <option value="">All topics</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {getCourseLabel(course)}
                  </option>
                ))}
              </select>
              <button className="inline-flex h-11 w-44 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[#fffdf7] px-4 text-sm font-bold text-[#5f5a4f] shadow-sm transition hover:border-[color:var(--border-strong)] hover:text-[#171713] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" type="button" aria-haspopup="dialog" aria-label="Open more filters">
                More filters <FilterIcon className="h-4 w-4" />
              </button>
              <div className="ml-auto hidden rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[#eee4d3] p-1 sm:inline-flex">
                <button className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "grid" ? "bg-[#fffdf7] text-[#1f1d19]" : "text-[#706a5f]"}`} type="button" onClick={() => setViewMode("grid")} aria-label="Grid view">
                  <GridIcon className="h-4 w-4" />
                </button>
                <button className={`flex h-9 w-10 items-center justify-center rounded-md ${viewMode === "list" ? "bg-[#fffdf7] text-[#1f1d19]" : "text-[#706a5f]"}`} type="button" onClick={() => setViewMode("list")} aria-label="List view">
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="browse" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" tabIndex={-1} aria-label="Learning content">

          {filter === "All" ? (
            (["PATH", "COURSE", "MODULE"] as const).map((type) => (
              <ResultSection
                key={type}
                title={sectionTitle(type)}
                eyebrow={sectionEyebrow(type)}
                items={groupedItems[type]}
                viewMode={viewMode}
                onOpen={setSelectedItem}
              />
            ))
          ) : viewMode === "grid" ? (
            filter === "Paths" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pathItems.map((item) => (
                  <PathCard key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item) => (
                  <ContentCard key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
                ))}
              </div>
            )
          ) : (
            <div className="grid gap-4">
              {visibleItems.map((item) => (
                <ContentListRow key={`${item.type}-${item.id}`} item={item} onOpen={setSelectedItem} />
              ))}
            </div>
          )}

          {visibleItems.length === 0 && (
            <div className="editorial-card rounded-xl border-dashed p-8 text-center">
              <SearchIcon className="mx-auto h-9 w-9 text-[#9b9283]" />
              <h2 className="mt-4 text-xl font-bold text-[#1f1d19]">No matching learning content</h2>
              <p className="mt-2 text-base text-[#706a5f]">Try a topic like evictions, client intake, motions, or courtroom procedures.</p>
            </div>
          )}
        </section>

        <section id="topics" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="editorial-panel rounded-[var(--radius-card)] p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title text-xl text-[#25221d]">Popular topics</h2>
              <p className="mt-0.5 text-sm text-[color:var(--lace-muted-strong)]">Fast routes into the most-used training areas.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-3 py-1.5 text-sm font-semibold text-[#62594b] shadow-sm transition hover:border-[#b88a2d]/45 hover:text-[#1f1d19] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
                  type="button"
                  onClick={() => selectTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--lace-hairline)] bg-[#f8f2e8]/95 px-5 py-2 shadow-[0_-14px_32px_rgba(65,52,32,0.10)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          <a href="#" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[#9d7a35] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-current="page">
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a href="#browse" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[#706a5f] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <SearchIcon className="h-5 w-5" />
            Browse
          </a>
          <a href="#learning" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[#706a5f] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <BookIcon className="h-5 w-5" />
            Learning
          </a>
          <button onClick={logout} className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-[#81786a] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-label={`Sign out ${user.firstName}`}>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f1d19] text-[10px] font-bold text-[#fffaf0]">
              {user.initials}
            </div>
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}
