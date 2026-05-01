"use client";

import { useMemo, useState } from "react";
import { BookIcon, FolderIcon, GridIcon, HelpIcon, HomeIcon, ListIcon, PathIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { ContinueCard } from "@/components/continue-card";
import { SearchBox } from "@/components/search-box";
import { continueLearning, getLearningItems, popularTopics, type LearningItem } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";

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

  return (
    <div className="mb-14">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200/70 pb-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-mlri-blue">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">{title}</h2>
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    window.location.href = result.href;
  }

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-mlri-navy text-white shadow-lg shadow-slate-900/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-fit items-center gap-3" aria-label="MLRI Learning Hub home">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <BookIcon className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold">MLRI</span>
              <span className="block text-[15px] font-semibold text-sky-50">Learning Hub</span>
            </span>
          </a>

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} compact />
          </div>

          <nav className="ml-auto hidden items-center gap-7 text-base font-bold text-sky-50 md:flex">
            <a className="transition hover:text-white" href="#browse">Browse</a>
            <a className="transition hover:text-white" href="#learning">My Learning</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-bl-[7rem] bg-sky-100/70" />
          <div className="absolute right-36 top-24 h-48 w-48 rounded-full bg-emerald-100/70" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-base font-extrabold text-mlri-blue">Discovery layer for Brightspace</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] text-mlri-ink sm:text-5xl">
                What do you need help with?
              </h1>
              <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-700">
                Find training quickly across courses, modules inside courses, and learning paths, then jump directly into Brightspace when you are ready to continue.
              </p>
              <div className="mt-7 md:hidden">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} />
              </div>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100"
                    type="button"
                    onClick={() => action.title === "Learning Paths" && setFilter("Paths")}
                  >
                    <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="block text-lg font-extrabold text-slate-950">{action.title}</span>
                    <span className="mt-1 block text-[15px] leading-6 text-slate-700">{action.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="learning" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-mlri-blue">My Learning</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Continue Learning</h2>
            </div>
            <a href="#browse" className="text-base font-extrabold text-mlri-blue">View all</a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {continueLearning.map((item) => (
              <ContinueCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="browse" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="sticky-filter mb-9 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1.5">
                {filters.map((entry) => (
                  <button
                    key={entry}
                    className={`h-11 rounded-xl px-4 text-sm font-black transition duration-200 ease-out ${
                      filter === entry ? "bg-mlri-navy text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                    type="button"
                    onClick={() => setFilter(entry)}
                  >
                    {entry}
                  </button>
                ))}
              </div>
              <div className="inline-flex w-fit rounded-2xl bg-slate-100 p-1.5" aria-label="Choose result layout">
                <button
                  className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-black transition duration-200 ease-out ${
                    viewMode === "grid" ? "bg-white text-mlri-navy shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                >
                  <GridIcon className="h-4 w-4" />
                  Grid
                </button>
                <button
                  className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-black transition duration-200 ease-out ${
                    viewMode === "list" ? "bg-white text-mlri-navy shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                >
                  <ListIcon className="h-4 w-4" />
                  List
                </button>
              </div>
            </div>
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-base font-black text-slate-800 ring-1 ring-slate-200" aria-live="polite">
              {visibleItems.length} result{visibleItems.length === 1 ? "" : "s"} - {filterContext[filter]}
              {query ? ` - "${query}"` : ""}
            </p>
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pathItems.map((item) => (
                  <PathCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <SearchIcon className="mx-auto h-9 w-9 text-slate-400" />
              <h2 className="mt-4 text-2xl font-extrabold text-slate-950">No matching learning content</h2>
              <p className="mt-2 text-lg text-slate-700">Try a topic like evictions, client intake, motions, or courtroom procedures.</p>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-mlri-mist p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Popular Topics</h2>
              <p className="mt-1 text-base font-semibold text-slate-700">Fast routes into the most-used training areas.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="rounded-full bg-white px-4 py-2 text-base font-extrabold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:text-mlri-blue hover:ring-sky-200 focus:outline-none focus:ring-4 focus:ring-sky-100"
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
        <div className="mx-auto grid max-w-md grid-cols-3">
          <a href="#" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-mlri-blue">
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a href="#browse" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600">
            <SearchIcon className="h-5 w-5" />
            Search
          </a>
          <a href="#learning" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-extrabold text-slate-600">
            <BookIcon className="h-5 w-5" />
            My Learning
          </a>
        </div>
      </nav>
    </div>
  );
}
