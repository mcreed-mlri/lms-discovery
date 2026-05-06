"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookIcon, CalendarIcon, FilterIcon, FlagIcon, FolderIcon, HelpIcon, HomeIcon, PathIcon, PlayIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { SearchBox } from "@/components/search-box";
import { getCourseLabel, getCourseTheme } from "@/lib/course-theme";
import { continueLearning, courses, getLearningItems, modules, popularTopics, type LearningItem } from "@/lib/data";
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

  if (!ready || !user) return null;

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <a className="skip-link" href="#browse">
        Skip to learning content
      </a>
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

          <nav className="ml-auto hidden items-center gap-5 text-sm font-bold text-sky-50 md:flex" aria-label="Account">
            <a className="rounded-md transition hover:text-white focus:outline-none focus:ring-4 focus:ring-sky-300/30" href="#browse">Browse</a>
            <a className="rounded-md transition hover:text-white focus:outline-none focus:ring-4 focus:ring-sky-300/30" href="#learning">My Learning</a>
            <div className="flex items-center gap-3 border-l border-white/15 pl-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mlri-sky/30 text-xs font-bold text-white ring-2 ring-white/20">
                {user.initials}
              </div>
              <span className="text-sm font-semibold text-sky-100">{user.firstName}</span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-sky-300 transition hover:text-white focus:outline-none"
                aria-label={`Sign out ${user.firstName}`}
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
                aria-current={isActive ? "page" : undefined}
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

      <main id="main-content" className="lg:pl-16">
        <section id="learning" className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef5ff_62%,#f8fbff_100%)]">
          <div className="absolute right-[-12rem] top-[-18rem] h-[30rem] w-[44rem] rounded-full bg-blue-100/45 blur-3xl" />
          <div className="absolute right-[10rem] top-[2rem] h-36 w-64 rounded-full bg-white/45 blur-2xl" />
          <div className="relative mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.48fr)] lg:items-center lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">Welcome back, {user.firstName}.</h1>
              <p className="mt-2 text-base font-semibold text-slate-500">{user.title} &bull; {user.unit}</p>
              <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <div className="flex items-baseline gap-1.5">
                  <dt className="font-semibold text-slate-500">Courses</dt>
                  <dd className="font-black text-slate-950">{learningSummary.completedCourses}/{learningSummary.totalCourses}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="font-semibold text-slate-500">Modules</dt>
                  <dd className="font-black text-slate-950">{learningSummary.completedModules}/{learningSummary.totalModules}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="font-semibold text-slate-500">Month</dt>
                  <dd className="font-black text-slate-950">{learningSummary.hoursThisMonth} hrs</dd>
                </div>
              </dl>
            </div>
            <aside className="rounded-2xl border border-white/70 bg-white/55 p-3 shadow-[0_14px_44px_rgba(8,45,87,0.08)] ring-1 ring-slate-200/40 backdrop-blur-xl" aria-label="Learning snapshot">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">Resume</p>
                  <h2 className="mt-1 truncate text-sm font-black text-slate-950">{resumeItem.title}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{resumeItem.detail} &bull; {resumeItem.progress}%</p>
                </div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm ring-1 ring-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-100" type="button" aria-label="Resume Professional Foundations for Legal Aid">
                  <PlayIcon className="h-4 w-4 fill-white stroke-white" />
                </button>
              </div>
              <div
                className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200/90"
                role="progressbar"
                aria-label={`${resumeItem.title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={resumeItem.progress}
              >
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${resumeItem.progress}%` }} />
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500">
                  <FlagIcon className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="truncate">Next: Professional Foundations</span>
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="sticky-filter z-30 bg-white/85 shadow-[0_18px_44px_rgba(8,45,87,0.09)] backdrop-blur-xl" aria-label="Search and filter learning content">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 lg:grid-cols-[minmax(28rem,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} prominent />
              </div>
              <p className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-slate-50 px-3 text-xs font-bold text-slate-600 ring-1 ring-slate-200 lg:mt-2 lg:justify-self-end" role="status" aria-live="polite">
                <CalendarIcon className="h-4 w-4 text-mlri-blue" />
                {visibleItems.length} available
              </p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0" aria-label="Learning filters">
              <div className="inline-flex shrink-0 rounded-full bg-slate-100 p-1 shadow-sm ring-1 ring-slate-200">
                {filters.map((entry) => (
                  <button
                    key={entry}
                    className={`h-9 rounded-full px-4 text-xs font-bold transition duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-sky-100 ${
                      filter === entry ? "bg-mlri-navy text-white shadow-sm" : "text-slate-700 hover:bg-white hover:text-slate-950"
                    }`}
                    type="button"
                    onClick={() => setFilter(entry)}
                    aria-pressed={filter === entry}
                  >
                    {entry}
                  </button>
                ))}
              </div>
              <span className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />
              <label className="sr-only" htmlFor="topic-filter">Topic</label>
              <select
                id="topic-filter"
                value={selectedCourseTopic}
                onChange={(event) => {
                  const course = courses.find((entry) => entry.id === event.target.value);
                  setQuery(course ? getCourseLabel(course) : "");
                  setFilter("All");
                }}
                className="h-11 w-44 shrink-0 rounded-full border border-slate-200 bg-white px-4 pr-9 text-sm font-bold text-slate-700 shadow-sm outline-none transition hover:border-sky-200 hover:text-mlri-blue focus:border-mlri-sky focus:ring-4 focus:ring-sky-100"
              >
                <option value="">All topics</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {getCourseLabel(course)}
                  </option>
                ))}
              </select>
              <button className="inline-flex h-11 w-44 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100" type="button" aria-haspopup="dialog" aria-label="Open more filters">
                More filters <FilterIcon className="h-4 w-4" />
              </button>
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
          <a href="#" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-mlri-blue focus:outline-none focus:ring-4 focus:ring-sky-100" aria-current="page">
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a href="#browse" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600 focus:outline-none focus:ring-4 focus:ring-sky-100">
            <SearchIcon className="h-5 w-5" />
            Browse
          </a>
          <a href="#learning" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600 focus:outline-none focus:ring-4 focus:ring-sky-100">
            <BookIcon className="h-5 w-5" />
            Learning
          </a>
          <button onClick={logout} className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-slate-500 focus:outline-none focus:ring-4 focus:ring-sky-100" aria-label={`Sign out ${user.firstName}`}>
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
