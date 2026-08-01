"use client";

import { useMemo } from "react";
import Link from "next/link";

import { ArrowIcon, PlayIcon } from "@/components/icons";
import { ProgressRing } from "@/components/progress-ring";
import { SearchBox } from "@/components/search-box";
import { getAccessLabel } from "@/lib/access";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import {
  continueLearning,
  courses,
  getContinueLearningUrl,
  learnerProgress,
  type LearningItem,
} from "@/lib/data";
import { resumeMinutesLeftLabel, scrollToBrowse } from "@/lib/home-helpers";
import type { SearchResult } from "@/lib/search";
import type { User } from "@/lib/auth";

// Suggested searches under the command bar — a short, scannable set of the
// things a busy advocate reaches for most. Presented as suggestions, not filters.
const popularSearches = ["notice to quit", "confidentiality", "SNAP appeal", "709 motion"];

type ResumeEntry = Extract<(typeof continueLearning)[number], { progress: number }>;

function useResumeCard(allItems: LearningItem[]) {
  const eligibleItemIds = useMemo(() => new Set(allItems.map((item) => item.id)), [allItems]);
  const resumeItem =
    (continueLearning.find((item) => "progress" in item && eligibleItemIds.has(item.id)) as
      | ResumeEntry
      | undefined) ??
    ({
      id: "welcome-to-lace",
      type: "COURSE",
      title: "Welcome to the Learning Hub",
      detail: "Get oriented and find your assigned learning",
      progress: 0,
      progressLabel: "0%",
    } satisfies ResumeEntry);
  const resumeUrl = getContinueLearningUrl(resumeItem, allItems);
  const resumeCourse = courses.find((course) => course.id === resumeItem.id);
  const resumeEyebrow = [resumeCourse?.practiceArea, resumeMinutesLeftLabel(resumeCourse?.duration)]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();
  const resumeProgressLabel = resumeItem.progressLabel
    ? `Lesson ${resumeItem.progressLabel}`
    : `${resumeItem.progress}%`;

  return { resumeItem, resumeUrl, resumeEyebrow, resumeProgressLabel };
}

// HERO — compact personalized greeting, search, and resume card.
export function HeroSection({
  user,
  isAdmin,
  query,
  onQueryChange,
  suggestions,
  onSelectResult,
  allItems,
}: {
  user: User;
  isAdmin: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
  allItems: LearningItem[];
}) {
  const { resumeItem, resumeUrl, resumeEyebrow, resumeProgressLabel } = useResumeCard(allItems);
  const clePct = Math.round((learnerProgress.cleEarned / learnerProgress.cleRequired) * 100);

  return (
    <section className="overflow-x-clip border-b border-[color:var(--line)]">
      <div className="mx-auto min-w-0 max-w-[1120px] px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
        {/* Top row: headline + training hours / this-week streak */}
        <div className="flex min-w-0 items-center justify-between gap-3 sm:gap-6">
          <div className="min-w-0">
            <h1 className="hero-display min-w-0 text-[22px] leading-[1.1] text-[color:var(--ink)] sm:text-[32px] sm:leading-[1.06] lg:text-[34px]">
              Welcome back, {user.firstName}.
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[13px] text-[color:var(--ink-muted)] sm:mt-1.5 sm:text-[14px]">
              <span className="font-semibold tracking-[-0.01em] text-[color:var(--ink-soft)]">
                {user.organization ?? "MLRI"}
              </span>
              <span className="text-[color:var(--ink-soft)]/45" aria-hidden="true">
                ·
              </span>
              <span>{user.unit}</span>
              <span className="text-[color:var(--ink-soft)]/45" aria-hidden="true">
                ·
              </span>
              <span className="font-semibold text-[color:var(--ink)]">
                {getAccessLabel(user.userType)} access: {user.accessStatus}
              </span>
            </p>
          </div>

          {/* Mobile: text-only training hours — no ring. Hidden for the
              headless admin account, which tracks no personal progress. */}
          {!isAdmin && (
            <p className="shrink-0 pt-0.5 text-right font-mono text-[11px] leading-tight tabular-nums sm:hidden">
              <span className="block font-semibold uppercase tracking-[0.04em] text-[color:var(--ink-soft)]">
                Training
              </span>
              <span className="font-semibold text-[color:var(--ink)]">
                {learnerProgress.cleEarned}/{learnerProgress.cleRequired} hrs
              </span>
            </p>
          )}

          {!isAdmin && (
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
                  <span className="text-[10px] font-bold tabular-nums text-[color:var(--ink)]">
                    {clePct}%
                  </span>
                </ProgressRing>
                <p className="text-[13px] leading-tight text-[color:var(--ink-soft)]">
                  <span className="font-semibold text-[color:var(--ink)]">
                    {learnerProgress.cleEarned}/{learnerProgress.cleRequired} hrs
                  </span>{" "}
                  to goal
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
          )}
        </div>

        {/* Main row: resume first on mobile, then search */}
        <div className="mt-3 grid min-w-0 gap-3 sm:mt-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
          {isAdmin ? (
            <aside
              className="order-1 min-w-0 rounded-[12px] bg-[color:var(--feature-surface)] px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3 lg:order-2 lg:self-start"
              aria-label="Brightspace Manager"
            >
              <div className="flex items-start gap-2.5 sm:items-center sm:gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-[color:var(--feature-muted)] sm:text-[10px]">
                    Service account
                  </p>
                  <h2 className="mt-0.5 truncate text-[14px] font-bold leading-snug tracking-[-0.01em] text-[color:var(--feature-ink)] sm:text-[15px] sm:leading-tight">
                    Brightspace Manager
                  </h2>
                </div>
                <Link
                  href={getBrightspaceManagerUrl()}
                  aria-label="Open Brightspace Manager"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[color:var(--feature-action-border)] bg-[color:var(--feature-action-bg)] text-[color:var(--feature-action-ink)] shadow-[0_1px_2px_rgba(0,0,0,0.14)] transition hover:opacity-90 focus-ring-inverse sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-[13px] sm:font-bold"
                >
                  <ArrowIcon className="h-[14px] w-[14px]" />
                  <span className="hidden sm:inline">Manager</span>
                </Link>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[color:var(--feature-muted)] sm:mt-2">
                Course operations, sync checks, and Brightspace setup now live there.
              </p>
            </aside>
          ) : (
            <aside
              className="order-1 min-w-0 rounded-[12px] bg-[color:var(--feature-surface)] px-3 py-2.5 shadow-[var(--shadow-card)] sm:px-4 sm:py-3 lg:order-2 lg:self-start"
              aria-label="Resume learning"
            >
              <div className="flex items-start gap-2.5 sm:items-center sm:gap-3">
                <div className="min-w-0 flex-1">
                  {resumeEyebrow ? (
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-[color:var(--feature-muted)] sm:text-[10px]">
                      {resumeEyebrow}
                    </p>
                  ) : null}
                  <h2 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug tracking-[-0.01em] text-[color:var(--feature-ink)] sm:line-clamp-none sm:truncate sm:text-[15px] sm:leading-tight">
                    {resumeItem.title}
                  </h2>
                </div>
                <a
                  href={resumeUrl}
                  aria-label={`Resume ${resumeItem.title}. Up next: ${resumeItem.detail}. ${resumeProgressLabel}.`}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[color:var(--feature-action-border)] bg-[color:var(--feature-action-bg)] text-[color:var(--feature-action-ink)] shadow-[0_1px_2px_rgba(0,0,0,0.14)] transition hover:opacity-90 focus-ring-inverse sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-[13px] sm:font-bold"
                >
                  <PlayIcon className="h-[14px] w-[14px]" />
                  <span className="hidden sm:inline">Resume</span>
                </a>
              </div>
              <div className="mt-1.5 flex items-center gap-2 sm:mt-2 sm:gap-2.5">
                <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-[color:var(--feature-track)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--brand-fill)]"
                    style={{ width: `${resumeItem.progress}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-[9px] font-semibold tabular-nums text-[color:var(--feature-muted)] sm:text-[10px]">
                  {resumeProgressLabel}
                </span>
              </div>
            </aside>
          )}

          <div className="order-2 min-w-0 lg:order-1">
            <SearchBox
              value={query}
              onChange={onQueryChange}
              suggestions={suggestions}
              onSelect={onSelectResult}
              prominent
            />
            <div className="-mx-4 mt-2 flex min-w-0 gap-2 overflow-x-auto px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-2.5 sm:hidden sm:px-0 [&::-webkit-scrollbar]:hidden">
              {popularSearches.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    onQueryChange(q);
                    scrollToBrowse();
                  }}
                  className="shrink-0 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-2.5 hidden flex-wrap items-center gap-2 sm:flex">
              <span className="text-[13px] font-medium text-[color:var(--ink-soft)]">Popular:</span>
              {popularSearches.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    onQueryChange(q);
                    scrollToBrowse();
                  }}
                  className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-[13px] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
                >
                  {q}
                </button>
              ))}
            </div>
            <nav
              className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] sm:hidden"
              aria-label="Jump to section"
            >
              <span className="font-medium text-[color:var(--ink-soft)]">Jump to</span>
              <a href="#skills" className="font-semibold text-[color:var(--brand)]">
                Skills
              </a>
              <a href="#browse" className="font-semibold text-[color:var(--brand)]">
                Library
              </a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
