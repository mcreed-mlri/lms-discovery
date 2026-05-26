"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowIcon,
  BellIcon,
  BookIcon,
  FilterIcon,
  FlameIcon,
  FolderIcon,
  GridIcon,
  HomeIcon,
  ListIcon,
  PathIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/icons";
import { ContentCard, ContentListRow, PathCard } from "@/components/content-card";
import { DetailModal } from "@/components/detail-modal";
import { ProgressRing } from "@/components/progress-ring";
import { SearchBox } from "@/components/search-box";
import { SkillGlyph } from "@/components/skill-glyph";
import { getCourseTheme, getSkillTheme, getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import {
  contentUpdates,
  continueLearning,
  courses,
  getLearningItems,
  getModuleMinutes,
  getModuleSkillId,
  getSkill,
  getSkillModuleCount,
  modulesUpdatedThisWeek,
  popularTopics,
  practiceAreaChips,
  quickSearches,
  skills,
  modules,
  paths,
  type ContentUpdate,
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

// Demo learner streak — surfaced as a consistency cue in the header. The brief
// asked for a streak indicator; the real value will come from Brightspace.
const learnerStreak = 12;

const resumeBrightspaceUrl =
  "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Sequencing.html?ou=6698&d2l_body_type=3&ou=6698";

const sideNavItems = [
  { title: "Home", href: "#", icon: HomeIcon },
  { title: "Browse", href: "#browse", icon: SearchIcon },
  { title: "My Learning", href: "/my-learning", icon: BookIcon },
  { title: "Paths", href: "#browse", icon: PathIcon, filter: "Paths" as Filter },
  { title: "Topics", href: "#topics", icon: FolderIcon },
  { title: "What's new", href: "#whats-new", icon: SparkIcon },
];

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

function sectionDescription(type: LearningItem["type"]) {
  if (type === "PATH") return "Structured routes through related training areas.";
  if (type === "COURSE") return "Core Brightspace courses organized by practice focus.";
  return "Focused training units inside the course catalog.";
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
          <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">{sectionDescription(items[0].type)}</p>
        </div>
        <p className="metadata hidden rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] px-2.5 py-1 font-bold text-[color:var(--ink-soft)] shadow-[var(--shadow-xs)] sm:block">
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
      className="group flex min-h-[8.5rem] flex-col gap-2 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-3.5 text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:shadow-[var(--shadow-md)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${topic.iconWrap}`}>
          <SkillGlyph kind={skill.glyph} className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[0.72rem] font-bold text-[color:var(--ink-soft)]">{count} modules</span>
      </div>
      <h3 className="section-title mt-1 text-[1rem] leading-snug text-[color:var(--ink)]">{skill.name}</h3>
      <p className="line-clamp-2 text-[0.8rem] leading-snug text-[color:var(--ink-muted)]">{skill.blurb}</p>
      <span className={`mt-auto inline-flex items-center gap-1 text-xs font-bold transition ${topic.eyebrow}`}>
        Browse <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

// "Updated this week" card — emphasizes *what changed, and when*. It uses the
// status palette (New / Updated / Law changed), never topic colour, so a
// change always reads the same regardless of which course it lives in.
function UpdateCard({ update, lead, onOpen }: { update: ContentUpdate; lead?: boolean; onOpen: (moduleId: string) => void }) {
  const status = getStatusTheme(resolveStatusKey(update.tag));
  const isHigh = update.severity === "high";
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-[color:var(--surface-raised)] ${
        lead
          ? "surface-featured border-[color:var(--line-strong)]"
          : "border-[color:var(--line)] shadow-[var(--shadow-card)]"
      } ${isHigh ? `before:absolute before:inset-y-0 before:left-0 before:w-0.5 ${status.rail}` : ""} ${
        lead ? "p-5 sm:p-6" : "p-4 lg:min-h-0"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`metadata inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${status.pill}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
          {update.tag}
        </span>
        <span className="metadata text-[color:var(--ink-soft)]">{update.when}</span>
      </div>
      <h3 className={`mt-3 text-[color:var(--ink)] ${lead ? "hero-title text-[1.55rem] leading-[1.12]" : "section-title text-[1rem] leading-snug"}`}>
        {update.title}
      </h3>
      <p className={`mt-2 leading-relaxed text-[color:var(--ink-muted)] ${lead ? "text-sm" : "text-[0.82rem]"}`}>
        {update.summary}
      </p>
      <button
        type="button"
        onClick={() => onOpen(update.moduleId)}
        className={`mt-4 inline-flex items-center gap-2 self-start rounded-[var(--radius-control)] text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
          lead
            ? "h-10 bg-[color:var(--ink)] px-4 text-[color:var(--surface-raised)] hover:opacity-90"
            : "mt-3 px-0 text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
        }`}
      >
        {lead ? `Open updated module · ${getModuleMinutes(update.moduleId)} min` : "View what changed"}
        <ArrowIcon className="h-4 w-4" />
      </button>
    </article>
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
  const [skillFilter, setSkillFilter] = useState<SkillId | null>(null);
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
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

  // Search results, then narrowed by the homepage's skill / course lenses.
  const visibleItems = useMemo(() => {
    let items = searchResults.map((result) => result.item);
    if (skillFilter) {
      items = items.filter((item) => item.type === "MODULE" && getModuleSkillId(item.id) === skillFilter);
    }
    if (courseFilter) {
      items = items.filter(
        (item) =>
          (item.type === "MODULE" && item.courseId === courseFilter) ||
          (item.type === "COURSE" && item.id === courseFilter),
      );
    }
    return items;
  }, [searchResults, skillFilter, courseFilter]);

  const pathItems = visibleItems.filter((item): item is Extract<LearningItem, { type: "PATH" }> => item.type === "PATH");
  const curatedItems = useMemo(() => getCuratedCatalogItems(visibleItems), [visibleItems]);
  const catalogItems = filter === "All" ? curatedItems : visibleItems;
  const catalogCountLabel = filter === "All" ? `${catalogItems.length} curated` : `${catalogItems.length} available`;

  const advancedFilterCount = [practiceAreaFilter, levelFilter, audienceFilter, statusFilter, durationFilter].filter(
    (value) => value !== "All",
  ).length;
  const lensActive = Boolean(skillFilter || courseFilter);

  const resumeItem = continueLearning[0] as Extract<(typeof continueLearning)[number], { progress: number }>;
  const resumeTheme = getCourseTheme(resumeItem.id);
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const quickStats = [
    { label: "Paths", value: paths.length },
    { label: "Courses", value: courses.length },
    { label: "Modules", value: modules.length },
  ];

  function openItemById(id: string) {
    const match = allItems.find((item) => item.id === id);
    if (match) setSelectedItem(match);
  }

  function selectTopic(topic: string) {
    setQuery(topic);
    setFilter("All");
    setSkillFilter(null);
    setCourseFilter(null);
    scrollToBrowse();
  }

  function selectSkill(id: SkillId) {
    setSkillFilter((current) => (current === id ? null : id));
    setCourseFilter(null);
    setFilter("Modules");
    scrollToBrowse();
  }

  function selectCourse(courseId: string) {
    setCourseFilter((current) => (current === courseId ? null : courseId));
    setSkillFilter(null);
    setFilter("All");
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
    setCourseFilter(null);
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

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <a className="skip-link" href="#browse">
        Skip to learning content
      </a>
      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--bg-surface-soft)]/92 text-[color:var(--ink)] shadow-[var(--shadow-sm)] backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex min-w-fit items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-label="MLRI Learning Hub home">
            <span className="leading-none">
              <span className="block text-[1.85rem] font-normal tracking-[-0.055em]">LACE</span>
              <span className="nav-label mt-1 block text-[color:var(--ink-soft)]">Learning Hub</span>
            </span>
          </a>

          <nav className="nav-label ml-auto hidden items-center gap-5 text-[color:var(--ink-muted)] md:flex" aria-label="Account">
            <a className="rounded-md transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" href="#browse">Library</a>
            <Link className="rounded-md transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" href="/my-learning">My Learning</Link>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2.5 py-1 text-[color:var(--ink-muted)]"
              title={`${learnerStreak}-day learning streak`}
            >
              <FlameIcon className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              {learnerStreak}-day streak
            </span>
            <button className="relative text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" type="button" aria-label="Notifications">
              <BellIcon className="h-[1.15rem] w-[1.15rem]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[color:var(--status-changed)]" />
            </button>
            <div className="flex items-center gap-3 border-l border-[color:var(--line)] pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--ink)] text-xs font-bold text-[color:var(--surface)]">
                {user.initials}
              </div>
              <span className="sr-only">{user.firstName}</span>
              <button
                onClick={logout}
                className="text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none"
                aria-label={`Sign out ${user.firstName}`}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[4.75rem] z-30 hidden w-44 border-r border-[color:var(--line)] bg-[color:var(--bg-surface-soft)]/88 shadow-[var(--shadow-sm)] backdrop-blur lg:block">
        <nav className="flex h-full flex-col gap-2 px-3 py-5" aria-label="Primary">
          {sideNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 0;
            const className = `group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
              isActive
                ? "nav-link-active"
                : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--ink)]"
            }`;
            return item.href.startsWith("/") ? (
              <Link key={item.title} href={item.href} className={className} aria-label={item.title}>
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ) : (
              <a
                key={item.title}
                href={item.href}
                onClick={() => item.filter && setFilter(item.filter)}
                className={className}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </a>
            );
          })}
          <div className="mt-auto border-t border-[color:var(--line)] pt-4">
            <p className="text-sm font-bold text-[color:var(--ink)]">{user.name}</p>
            <p className="text-xs font-semibold text-[color:var(--ink-soft)]">{user.title}</p>
          </div>
        </nav>
      </aside>

      <main id="main-content" className="lg:pl-44">
        {/* HERO — mission-led headline + a single Continue card for hierarchy */}
        <section className="relative overflow-hidden border-b border-[color:var(--line)] bg-[color:var(--paper)]">
          <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.46fr)] lg:items-end lg:gap-8 lg:px-8 lg:py-9">
            <div className="max-w-2xl">
              <p className="metadata flex flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--ink-soft)]">
                <span>{dateLabel}</span>
                <span className="text-[color:var(--ink-soft)]">·</span>
                <span>{modulesUpdatedThisWeek} modules updated this week</span>
              </p>
              <h1 className="hero-title mt-2.5 text-[2.6rem] text-[color:var(--ink)] sm:text-[3.35rem]">
                Welcome back, {user.firstName}. <span className="italic text-[color:var(--brand-ink)]">Make impact.</span>
              </h1>
              <p className="mt-3.5 max-w-lg text-base leading-relaxed text-[color:var(--ink-muted)]">
                Keep moving through practical legal aid training shaped around the work you do with clients.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-sm font-bold text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)]">
                  {user.title} <span className="mx-2 text-[color:var(--ink-soft)]">/</span> {user.unit}
                </span>
                {quickStats.map((stat) => (
                  <span key={stat.label} className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-soft)] shadow-[var(--shadow-xs)]">
                    <strong className="mr-1.5 text-[color:var(--ink)]">{stat.value}</strong> {stat.label}
                  </span>
                ))}
              </div>
            </div>

            <aside
              className="hero-continue editorial-panel rounded-[var(--radius-card)] p-5 sm:p-5"
              style={{ borderLeftColor: resumeTheme.ring }}
              aria-label="Continue learning"
            >
              <p className="section-kicker primary">Continue learning</p>
              <div className="mt-2.5 flex items-start gap-3.5">
                <ProgressRing value={resumeItem.progress} size={54} stroke={5} color={resumeTheme.ring} trackColor="var(--surface-sunken)">
                  <span className="font-mono text-[0.7rem] font-bold text-[color:var(--ink)]">{resumeItem.progress}%</span>
                </ProgressRing>
                <div className="min-w-0">
                  <h2 className="hero-title text-[1.12rem] leading-[1.18] text-[color:var(--ink)]">{resumeItem.title}</h2>
                  <p className="metadata mt-1.5 text-[color:var(--ink-soft)]">Next · {resumeItem.detail}</p>
                </div>
              </div>
              <a
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] text-sm font-bold text-[color:var(--surface-raised)] shadow-[var(--shadow-sm)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
                href={resumeBrightspaceUrl}
              >
                Resume learning <ArrowIcon className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </section>

        {/* COMMAND BAR — the front door. Search is the fastest path to content. */}
        <section className="sticky-filter border-b border-[color:var(--line)] bg-[color:var(--bg-surface-soft)]/82 shadow-[var(--shadow-sm)] backdrop-blur-xl" aria-label="Search the library">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <SearchBox value={query} onChange={setQuery} suggestions={searchSuggestions} onSelect={openSearchResult} prominent />
              </div>
              <button
                type="button"
                onClick={() => setShowRefine((value) => !value)}
                aria-expanded={showRefine}
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 sm:h-14 ${
                  showRefine || advancedFilterCount > 0
                    ? "border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] text-[color:var(--ink)] shadow-[var(--shadow-xs)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
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
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip-label metadata">Often searched</span>
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => selectTopic(term)}
                  className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-2.5 py-1 text-[0.82rem] font-semibold text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
                >
                  {term}
                </button>
              ))}
            </div>

            {showRefine && (
              <div className="mt-4 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-sm">
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

        {/* SKILLS — the primary lens: legal practice as verbs */}
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8" aria-label="Browse by skill">
          <div className="flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-3">
            <div>
              <p className="section-kicker secondary">Browse by action</p>
              <h2 className="hero-title mt-1 text-[1.85rem] text-[color:var(--ink)]">What do you need to do?</h2>
              <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
                Browse training by the real skills you use in legal aid work.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill) => (
              <SkillTile key={skill.id} skill={skill} onSelect={selectSkill} />
            ))}
          </div>

          {/* Practice areas — the secondary lens, demoted to a chip strip */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="chip-label metadata">Or by course</span>
            {practiceAreaChips.map((chip) => {
              const theme = getCourseTheme(chip.courseId);
              const active = courseFilter === chip.courseId;
              return (
                <button
                  key={chip.courseId}
                  type="button"
                  onClick={() => selectCourse(chip.courseId)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                    active
                      ? "control-active border-[color:var(--ink)]"
                      : "border-[color:var(--line)] bg-[color:var(--surface-raised)] text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-sm ${theme.dot}`} aria-hidden="true" />
                  {chip.name}
                  <span className={`font-mono text-[0.68rem] font-bold ${active ? "text-[color:var(--surface-sunken)]" : "text-[color:var(--ink-soft)]"}`}>{chip.moduleCount}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* UPDATED THIS WEEK — the law moves, and so does the catalog */}
        <section id="whats-new" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8" aria-label="Updated this week">
          <div className="flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-3">
            <div>
              <p className="section-kicker secondary">The law moved</p>
              <h2 className="hero-title mt-1 text-[1.85rem] text-[color:var(--ink)]">Updated this week</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_0.9fr_0.9fr]">
            {contentUpdates.slice(0, 3).map((update, index) => (
              <UpdateCard key={update.id} update={update} lead={index === 0} onOpen={openItemById} />
            ))}
          </div>
        </section>

        {/* BROWSE — the full catalog, with filter pills + the active lens */}
        <section id="browse" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" tabIndex={-1} aria-label="Learning content">
          <div className="mb-4 border-b border-[color:var(--line)] pb-3">
            <p className="section-kicker secondary">Catalog</p>
            <h2 className="hero-title mt-1 text-[1.85rem] text-[color:var(--ink)]">Find the right next step</h2>
            <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
              Use the tabs to scan a curated mix or narrow to one learning format.
            </p>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="-mx-4 flex max-w-full shrink-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <div className="inline-flex shrink-0 rounded-[var(--radius-control)] border border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)] p-1 shadow-[var(--shadow-xs)]">
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
            <p className="metadata inline-flex h-9 items-center gap-2 rounded-md border border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] px-3 font-bold text-[color:var(--ink-soft)] shadow-[var(--shadow-xs)]" role="status" aria-live="polite">
              {catalogCountLabel}
            </p>
            {lensActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] px-3 text-xs font-bold text-[color:var(--ink)] shadow-[var(--shadow-xs)] transition hover:border-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
              >
                {skillFilter ? `Skill: ${getSkill(skillFilter)?.name}` : `Course: ${practiceAreaChips.find((chip) => chip.courseId === courseFilter)?.name}`}
                <span aria-hidden="true">✕</span>
                <span className="sr-only">Clear filter</span>
              </button>
            )}
            <div className="ml-auto hidden rounded-[var(--radius-control)] border border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)] p-1 shadow-[var(--shadow-xs)] sm:inline-flex">
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
        </section>

        <section id="topics" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="surface-featured rounded-[var(--radius-card)] p-4 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="section-title text-xl text-[color:var(--ink)]">Popular topics</h2>
              <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">Fast routes into the most-used training areas.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:justify-end">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
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

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--line)] bg-[color:var(--bg-surface-soft)]/95 px-5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-md)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          <a href="#" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-current="page">
            <HomeIcon className="h-5 w-5" />
            Home
          </a>
          <a href="#browse" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[color:var(--ink-soft)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <SearchIcon className="h-5 w-5" />
            Browse
          </a>
          <Link href="/my-learning" className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[color:var(--ink-soft)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15">
            <BookIcon className="h-5 w-5" />
            Learning
          </Link>
          <button onClick={logout} className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--ink-soft)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15" aria-label={`Sign out ${user.firstName}`}>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--ink)] text-[10px] font-bold text-[color:var(--surface)]">
              {user.initials}
            </div>
            Sign out
          </button>
        </div>
      </nav>
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
