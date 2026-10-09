"use client";

import { useMemo } from "react";
import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { continueLearning, courses, getContinueLearningUrl, type LearningItem } from "@/lib/data";
import type { SearchResult } from "@/lib/search";
import type { User } from "@/lib/auth";

type ResumeEntry = Extract<(typeof continueLearning)[number], { progress: number }>;

function minutesLeft(duration?: string) {
  if (!duration || !/min/i.test(duration)) return null;
  return `about ${duration
    .replace(/[~\s]*min\s*$/i, "")
    .replace(/^~/, "")
    .trim()} min left`;
}

function useResumeCard(allItems: LearningItem[]) {
  const eligibleItemIds = useMemo(() => new Set(allItems.map((item) => item.id)), [allItems]);
  const resumeItem =
    (continueLearning.find((item) => "progress" in item && eligibleItemIds.has(item.id)) as
      ResumeEntry | undefined) ??
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
  // The title already names the course, so the lesson line carries only time left.
  const context = minutesLeft(resumeCourse?.duration);

  // "2/5" → part 2 of 5, drawn as five stops. Anything else has no stops.
  const lesson = /^(\d+)\/(\d+)$/.exec(resumeItem.progressLabel ?? "");
  const current = lesson ? Number(lesson[1]) : 0;
  const total = lesson ? Number(lesson[2]) : 0;

  return { resumeItem, resumeUrl, context, current, total };
}

// The T Map's stop line: one stop per lesson, with "You are here" set under the
// current one. Decorative; the lesson line below carries the same fact in words.
function LessonStops({ current, total }: { current: number; total: number }) {
  return (
    <div className="relative mt-4 flex items-center pb-5" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => {
        const stop = index + 1;
        const here = stop === current;
        return (
          <span key={stop} className="contents">
            {index > 0 ? <span className="h-0.5 flex-1 bg-[color:var(--feature-track)]" /> : null}
            <span
              className={`relative ${
                here
                  ? "h-5 w-5 shrink-0 rounded-full bg-[color:var(--feature-ink)] shadow-[0_0_0_3px_var(--feature-surface),0_0_0_5px_var(--tab-learning)]"
                  : stop < current
                    ? "h-3 w-3 shrink-0 rounded-full bg-[color:var(--feature-ink)]"
                    : "h-3 w-3 shrink-0 rounded-full border-2 border-[color:var(--feature-ink)]"
              }`}
            >
              {here ? (
                <span className="absolute left-0 top-[calc(100%+6px)] whitespace-nowrap text-[12px] font-semibold text-[color:var(--feature-ink)]">
                  You are here
                </span>
              ) : null}
            </span>
          </span>
        );
      })}
    </div>
  );
}

// HERO — greeting, search, and the resume card. It scrolls with the page; Ctrl K
// opens search from anywhere.
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
  const { resumeItem, resumeUrl, context, current, total } = useResumeCard(allItems);

  return (
    <section className="mx-auto grid min-w-0 max-w-[1180px] gap-6 px-4 pb-2 pt-6 sm:px-6 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-11 lg:px-11 lg:pt-10">
      <div className="min-w-0">
        <h1 className="hero-display text-[32px] leading-[1.08] tracking-[-0.025em] text-[color:var(--ink)] sm:text-[42px]">
          Welcome back, {user.firstName}.
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-[color:var(--ink-muted)]">
          <span>{user.title}</span>
          {user.unit ? <span>{user.unit}</span> : null}
        </div>

        <div className="mt-6">
          <SearchBox
            value={query}
            onChange={onQueryChange}
            suggestions={suggestions}
            onSelect={onSelectResult}
            placeholder="What’s in front of you today? Try “notice to quit”"
            prominent
          />
        </div>
      </div>

      {isAdmin ? (
        <aside
          className="min-w-0 self-start rounded-[12px] bg-[color:var(--feature-surface)] px-5 py-5 text-[color:var(--feature-ink)]"
          aria-label="Brightspace Manager"
        >
          <p className="text-[12px] font-semibold text-[color:var(--feature-muted)]">
            Service account
          </p>
          <h2 className="mt-1 text-[19px] font-extrabold tracking-[-0.01em]">
            Brightspace Manager
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--feature-muted)]">
            Course operations, sync checks, and Brightspace setup live there.
          </p>
          <Link
            href={getBrightspaceManagerUrl()}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-[7px] bg-[color:var(--feature-action-bg)] px-4 text-[14px] font-bold text-[color:var(--feature-action-ink)] transition hover:opacity-90 focus-ring-inverse"
          >
            Open Manager
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </aside>
      ) : (
        <aside
          className="min-w-0 self-start rounded-[12px] bg-[color:var(--feature-surface)] px-5 py-5 text-[color:var(--feature-ink)] sm:px-6"
          aria-label="Resume learning"
        >
          <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.01em]">
            {resumeItem.title}
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--feature-muted)]">
            Next: {resumeItem.detail}
          </p>
          {total > 1 ? <LessonStops current={current} total={total} /> : null}
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-[12px] text-[color:var(--feature-muted)]">
              {[
                total > 0 ? `Part ${current} of ${total}` : `${resumeItem.progress}% complete`,
                context,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <a
              href={resumeUrl}
              aria-label={`Resume ${resumeItem.title}`}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[7px] bg-[color:var(--feature-action-bg)] px-4 text-[14px] font-bold text-[color:var(--feature-action-ink)] transition hover:opacity-90 focus-ring-inverse"
            >
              Resume
              <ArrowIcon className="h-4 w-4" />
            </a>
          </div>
        </aside>
      )}
    </section>
  );
}
