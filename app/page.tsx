"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookIcon, FolderIcon, GridIcon, HelpIcon, HomeIcon, ListIcon, PathIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { ContinueCard } from "@/components/continue-card";
import { SearchBox } from "@/components/search-box";
import { getCourseLabel, getCourseTheme } from "@/lib/course-theme";
import { continueLearning, courses, getLearningItems, popularTopics, type LearningItem } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";
import { useAuth } from "@/lib/auth";

type Filter = "All" | "Paths" | "Courses" | "Modules";
type ViewMode = "grid" | "list";

const filters: Filter[] = ["All", "Paths", "Courses", "Modules"];

const filterContext: Record<Filter, string> = {
  All: "All Practice Areas",
  Paths: "Learning Paths",
  Courses: "Courses",
  Modules: "Modules",
};

const quickActions = [
  {
    title: "Browse by Topic",
    description: "Explore training by practice area",
    icon: FolderIcon,
    color: "bg-blue-600",
  },
  {
    title: "Learning Paths",
    description: "Follow structured paths from start to finish",
    icon: PathIcon,
    color: "bg-emerald-600",
  },
  {
    title: "Quick Help",
    description: "Find answers to common tasks and questions",
    icon: HelpIcon,
    color: "bg-violet-600",
  },
  {
    title: "What's New",
    description: "See the latest training and updates",
    icon: SparkIcon,
    color: "bg-amber-500",
  },
];

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
}: {
  title: string;
  eyebrow: string;
  items: LearningItem[];
  viewMode: ViewMode;
}) {
  if (items.length === 0) return null;
  const isPathSection = items[0]?.type === "PATH";
  const gridColumns = isPathSection ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="mb-12">
      <div className={`mb-4 flex items-end justify-between gap-4 pb-3 ${isPathSection ? "border-b-2 border-mlri-blue/20" : "border-b border-slate-200/80"}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mlri-blue">{eyebrow}</p>
          <h2 className={`${isPathSection ? "text-2xl" : "text-xl"} mt-1 font-bold text-slate-800`}>{title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{sectionDescription(items[0].type)}</p>
        </div>
        <p className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:block">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>
      {viewMode === "grid" ? (
        <div className={`grid gap-4 ${gridColumns}`}>
          {items.map((item) =>
            item.type === "PATH" ? (
              <PathCard key={`${item.type}-${item.id}`} item={item} />
            ) : (
              <ContentCard key={`${item.type}-${item.id}`} item={item} />
            ),
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <ContentListRow key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const allItems = useMemo(() => getLearningItems(), []);
  const searchResults = useMemo(() => searchLearningItems(allItems, query), [allItems, query]);
  const searchSuggestions = useMemo(() => searchResults.slice(0, 6), [searchResults]);

  const visibleItems = useMemo(() => {
    const sourceItems = query.trim() ? searchResults.map((result) => result.item) : allItems;
    return sourceItems.filter((item) => filterMatches(item, filter));
  }, [allItems, query, filter, searchResults]);

  const pathItems = visibleItems.filter((item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH");
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

  if (!ready || !user) return null;

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-mlri-navy text-white shadow-lg shadow-slate-900/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-fit items-center gap-3" aria-label="MLRI Learning Hub home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10">
              <BookIcon className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold">MLRI</span>
              <span className="block text-sm font-semibold text-sky-50">Learning Hub</span>
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-5 text-sm font-bold text-sky-50 md:flex">
            <a className="transition hover:text-white" href="#browse">Browse</a>
            <a className="transition hover:text-white" href="#learning">My Learning</a>
            <div className="flex items-center gap-3 border-l border-white/15 pl-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mlri-sky/30 text-xs font-bold text-white ring-2 ring-white/20">
                {user.initials}
              </div>
              <span className="text-sm font-semibold text-sky-100">{user.firstName}</span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-sky-300 transition hover:text-white focus:outline-none"
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-16 border-r border-slate-200 bg-white/90 shadow-[16px_0_40px_rgba(8,45,87,0.05)] backdrop-blur lg:block">
        <nav className="flex h-full flex-col items-center gap-2 px-2 py-5" aria-label="Primary">
          {sideNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 0;
            return (
              <a
                key={item.title}
                href={item.href}
                onClick={() => item.filter && setFilter(item.filter)}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-lg transition focus:outline-none focus:ring-4 focus:ring-sky-100 ${
                  isActive ? "bg-mlri-navy text-white shadow-sm" : "text-slate-500 hover:bg-sky-50 hover:text-mlri-blue"
                }`}
                aria-label={item.title}
              >
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute left-[3.35rem] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.title}
                </span>
              </a>
            );
          })}
          <div className="mt-auto flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-mlri-navy">
            {user.initials}
          </div>
        </nav>
      </aside>

      <main className="lg:pl-16">
        <section className="border-b border-slate-200/70 bg-white/80">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 lg:grid-cols-[minmax(12rem,0.72fr)_minmax(22rem,1.55fr)_auto] lg:items-center">
              <div>
                <p className="text-base font-bold text-slate-800">Welcome back, {user.firstName}.</p>
                <p className="mt-0.5 text-sm font-medium text-slate-500">{user.title} &middot; {user.unit}</p>
              </div>
              <div className="lg:max-w-2xl">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} />
              </div>
              <p className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                {visibleItems.length} available
              </p>
            </div>
          </div>
        </section>

        <section id="learning" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-mlri-blue/20 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mlri-blue">{user.firstName}&rsquo;s Learning</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">Pick up where you left off</h2>
            </div>
            <a href="#browse" className="text-sm font-semibold text-mlri-blue">View all</a>
          </div>
          <div>
            <ContinueCard item={continueLearning[0]} priority="primary" />
          </div>
        </section>

        <section id="browse" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="sticky-filter mb-8 grid gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:grid-cols-[auto_minmax(18rem,30rem)_auto] lg:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {filters.map((entry) => (
                  <button
                    key={entry}
                    className={`h-9 rounded-lg px-3 text-xs font-semibold transition duration-200 ease-out ${
                      filter === entry ? "bg-mlri-navy text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                    type="button"
                    onClick={() => setFilter(entry)}
                  >
                    {entry}
                  </button>
                ))}
              </div>
              <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1" aria-label="Choose result layout">
                <button
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition duration-200 ease-out ${
                    viewMode === "grid" ? "bg-white text-mlri-navy shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                >
                  <GridIcon className="h-3.5 w-3.5" />
                  Grid
                </button>
                <button
                  className={`flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition duration-200 ease-out ${
                    viewMode === "list" ? "bg-white text-mlri-navy shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                >
                  <ListIcon className="h-3.5 w-3.5" />
                  List
                </button>
              </div>
              <div className="hidden h-8 w-px bg-slate-200 2xl:block" />
              <div className="hidden flex-wrap gap-1.5 2xl:flex" aria-label="Shortcuts">
                {quickActions.slice(0, 3).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.title}
                      className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-sky-50 hover:text-mlri-blue focus:outline-none focus:ring-4 focus:ring-sky-100"
                      type="button"
                      onClick={() => action.title === "Learning Paths" && setFilter("Paths")}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {action.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="min-w-0">
              <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} compact />
            </div>
            <div className="flex flex-col gap-2 lg:items-end">
              <div className="hidden flex-wrap items-center gap-1.5 xl:flex">
                <span className="mr-1 text-xs font-semibold text-slate-500">Course areas</span>
                {courses.map((course) => {
                  const theme = getCourseTheme(course.id);
                  return (
                    <span key={course.id} className={`inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-2 py-1 text-[0.68rem] font-semibold opacity-65 ${theme.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                      {getCourseLabel(course)}
                    </span>
                  );
                })}
              </div>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200" aria-live="polite">
                {visibleItems.length} result{visibleItems.length === 1 ? "" : "s"} - {filterContext[filter]}
                {query ? ` - "${query}"` : ""}
              </p>
            </div>
          </div>

          {filter === "All" ? (
            (["PATH", "COURSE", "MODULE"] as const).map((type) => (
              <ResultSection
                key={type}
                title={sectionTitle(type)}
                eyebrow={sectionEyebrow(type)}
                items={groupedItems[type]}
                viewMode={viewMode}
              />
            ))
          ) : viewMode === "grid" ? (
            filter === "Paths" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pathItems.map((item) => (
                  <PathCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item) => (
                  <ContentCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="grid gap-4">
              {visibleItems.map((item) => (
                <ContentListRow key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          )}

          {visibleItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <SearchIcon className="mx-auto h-9 w-9 text-slate-400" />
              <h2 className="mt-4 text-xl font-extrabold text-slate-950">No matching learning content</h2>
              <p className="mt-2 text-base text-slate-700">Try a topic like evictions, client intake, motions, or courtroom procedures.</p>
            </div>
          )}
        </section>

        <section id="topics" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-mlri-mist p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Popular Topics</h2>
              <p className="mt-0.5 text-sm text-slate-600">Fast routes into the most-used training areas.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-mlri-blue hover:ring-sky-200 focus:outline-none focus:ring-4 focus:ring-sky-100"
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

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-5 py-2 shadow-[0_-14px_32px_rgba(8,45,87,0.10)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          <a href="#" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-mlri-blue">
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a href="#browse" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600">
            <SearchIcon className="h-5 w-5" />
            Browse
          </a>
          <a href="#learning" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600">
            <BookIcon className="h-5 w-5" />
            Learning
          </a>
          <button onClick={logout} className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-slate-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-mlri-navy text-[10px] font-bold text-white">
              {user.initials}
            </div>
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}
