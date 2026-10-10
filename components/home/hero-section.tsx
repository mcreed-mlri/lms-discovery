"use client";

import { useMemo } from "react";
import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { findFiling, hearsaySkills } from "@/lib/binder";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { continueLearning, courses, getContinueLearningUrl, type LearningItem } from "@/lib/data";
import type { BinderHit } from "@/lib/binder-search";
import type { SearchResult } from "@/lib/search";
import type { User } from "@/lib/auth";

type ResumeEntry = Extract<(typeof continueLearning)[number], { progress: number }>;

/** A stop on the resume card's line: done, the current part, still ahead, or not built yet. */
export type Stop = "done" | "here" | "ahead" | "coming";

export type ResumeCard = {
  /** The binder and tab the course is filed under, when it has one. */
  filing?: { binderId: string; binderName: string; tabLabel: string; topicTitle: string };
  title: string;
  subline: string;
  stops: Stop[];
  meta: string;
  href: string;
  action: string;
};

/**
 * Time left on a course of `duration` when the learner is on part `current` of
 * `total`. Parts are assumed equal, so the estimate is rounded to 5 minutes and
 * said with "about". Without parts there is nothing honest to subtract from, so
 * the course length is shown as a length, not as time left.
 */
export function timeLeft(duration: string | undefined, current: number, total: number) {
  const minutes = Number(/(\d+)\s*min/i.exec(duration ?? "")?.[1]);
  if (!minutes) return null;
  if (total < 1 || current < 1) return `about ${minutes} min`;
  // On part 2 of 5, parts 2 through 5 are still ahead.
  const remaining = (minutes * (total - current + 1)) / total;
  return `about ${Math.max(5, Math.round(remaining / 5) * 5)} min left`;
}

const HEARSAY_COURSE_ID = "legal-skills-hearsay";

/**
 * What the resume card says. The Hearsay pilot knows which of its parts are
 * built, so its card names the open part, resumes straight into it, and draws
 * the unbuilt parts as "coming" rather than as done or ahead. Anything else
 * falls back to its "2/5" progress label.
 */
export function getResumeCard(allItems: LearningItem[]): ResumeCard {
  const eligibleItemIds = new Set(allItems.map((item) => item.id));
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
  const filed = findFiling(resumeItem.id);
  const filing = filed
    ? {
        binderId: filed.binder.id,
        binderName: filed.binder.name,
        tabLabel: filed.tab.label,
        topicTitle: filed.topic.title,
      }
    : undefined;

  const openIndex = hearsaySkills.findIndex((skill) => skill.status === "open");
  const openSkill = hearsaySkills[openIndex];
  if (resumeItem.id === HEARSAY_COURSE_ID && openSkill?.href) {
    const part = openIndex + 1;
    const openCount = hearsaySkills.filter((skill) => skill.status === "open").length;
    return {
      filing,
      title: openSkill.title,
      subline: `${resumeItem.title}, part ${part} of ${hearsaySkills.length}`,
      stops: hearsaySkills.map((skill, index) =>
        index === openIndex ? "here" : skill.status === "open" ? "ahead" : "coming",
      ),
      meta: [
        openCount === 1 ? "The only part open so far" : `${openCount} parts open`,
        openSkill.minutes ? `about ${openSkill.minutes} min` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      href: openSkill.href,
      action: `Resume part ${part}`,
    };
  }

  // "2/5" → part 2 of 5, drawn as five stops. Anything else has no stops.
  const lesson = /^(\d+)\/(\d+)$/.exec(resumeItem.progressLabel ?? "");
  const current = lesson ? Number(lesson[1]) : 0;
  const total = lesson ? Number(lesson[2]) : 0;
  const resumeCourse = courses.find((course) => course.id === resumeItem.id);
  return {
    filing,
    title: resumeItem.title,
    subline: `Next: ${resumeItem.detail}`,
    stops: Array.from({ length: total }, (_, index) =>
      index + 1 < current ? "done" : index + 1 === current ? "here" : "ahead",
    ),
    meta: [
      total > 0 ? `Part ${current} of ${total}` : `${resumeItem.progress}% complete`,
      timeLeft(resumeCourse?.duration, current, total),
    ]
      .filter(Boolean)
      .join(" · "),
    href: getContinueLearningUrl(resumeItem, allItems),
    action: "Resume",
  };
}

const stopClass: Record<Stop, string> = {
  // Ringed in the binder's colour; the card sets data-binder.
  here: "h-5 w-5 bg-[color:var(--feature-ink)] shadow-[0_0_0_3px_var(--feature-surface),0_0_0_5px_var(--binder)]",
  done: "h-3 w-3 bg-[color:var(--feature-ink)]",
  ahead: "h-3 w-3 border-2 border-[color:var(--feature-ink)]",
  coming: "h-2.5 w-2.5 border-2 border-[color:var(--feature-muted)]",
};

// The T Map's stop line: one stop per part, with "You are here" set under the
// current one. Parts not built yet are small hollow dots on a dashed track. Decorative; the line under it carries the same facts in words.
function LessonStops({ stops }: { stops: Stop[] }) {
  return (
    <div className="relative mt-4 flex items-center pb-5" aria-hidden="true">
      {stops.map((stop, index) => (
        <span key={index} className="contents">
          {index > 0 ? (
            stop === "coming" || stops[index - 1] === "coming" ? (
              <span className="flex-1 border-t-2 border-dashed border-[color:var(--feature-track)]" />
            ) : (
              <span className="h-0.5 flex-1 bg-[color:var(--feature-track)]" />
            )
          ) : null}
          <span className={`relative shrink-0 rounded-full ${stopClass[stop]}`}>
            {stop === "here" ? (
              <span className="absolute left-0 top-[calc(100%+6px)] whitespace-nowrap text-[12px] font-semibold text-[color:var(--feature-ink)]">
                You are here
              </span>
            ) : null}
          </span>
        </span>
      ))}
    </div>
  );
}

// HERO — greeting, search, and the resume card. It scrolls with the page; Ctrl K
// opens search from anywhere. Renders two cells of the Home grid in app/page.tsx
// (see HOME_GRID there): the greeting, and the side card that spans two rows so
// "Your binders" can start right under search instead of under the card.
export function HeroSection({
  user,
  isAdmin,
  query,
  onQueryChange,
  suggestions,
  onSelectResult,
  binderHits,
  onSelectBinderHit,
  allItems,
}: {
  user: User;
  isAdmin: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
  binderHits?: BinderHit[];
  onSelectBinderHit?: (hit: BinderHit) => void;
  allItems: LearningItem[];
}) {
  const card = useMemo(() => getResumeCard(allItems), [allItems]);

  return (
    <>
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <h1 className="hero-display text-[30px] leading-[1.1] tracking-[-0.025em] text-[color:var(--ink)] sm:text-[34px]">
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
            binderHits={binderHits}
            onSelectBinderHit={onSelectBinderHit}
            placeholder="What’s in front of you today? Try “notice to quit”"
            prominent
          />
        </div>
      </div>

      {isAdmin ? (
        <aside
          className="min-w-0 self-start rounded-[12px] bg-[color:var(--feature-surface)] px-5 py-5 text-[color:var(--feature-ink)] lg:col-start-2 lg:row-span-2 lg:row-start-1"
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
          className="min-w-0 self-start rounded-[12px] bg-[color:var(--feature-surface)] px-5 py-5 text-[color:var(--feature-ink)] sm:px-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          aria-label="Resume learning"
          data-binder={card.filing?.binderId}
        >
          {card.filing ? (
            <p className="flex items-center gap-2 text-[12px] font-semibold text-[color:var(--feature-muted)]">
              <span aria-hidden="true" className="binder-swatch scale-90" />
              {card.filing.binderName} › {card.filing.tabLabel} › {card.filing.topicTitle}
            </p>
          ) : null}
          <h2 className="mt-1.5 text-[21px] font-extrabold leading-tight tracking-[-0.01em]">
            {card.title}
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--feature-muted)]">{card.subline}</p>
          {card.stops.length > 1 ? <LessonStops stops={card.stops} /> : null}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <p className="text-[12px] text-[color:var(--feature-muted)]">{card.meta}</p>
            <a
              href={card.href}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[7px] bg-[color:var(--feature-action-bg)] px-4 text-[14px] font-bold text-[color:var(--feature-action-ink)] transition hover:opacity-90 focus-ring-inverse"
            >
              {card.action}
              <ArrowIcon className="h-4 w-4" />
            </a>
          </div>
        </aside>
      )}
    </>
  );
}
