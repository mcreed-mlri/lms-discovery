"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  ArrowIcon,
  BookIcon,
  BookmarkFilledIcon,
  CertificateIcon,
  CheckIcon,
  PlayIcon,
} from "@/components/icons";
import { RateCourseCard } from "@/components/dashboard/RateCourseCard";
import { StalledCourseNudge } from "@/components/dashboard/StalledCourseNudge";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { getLearningItems, getLearningUrlForDashboardCourse } from "@/lib/data";
import { STALLED_AFTER_DAYS, useFeedbackPrompts } from "@/lib/feedback-prompts";
import { useSavedLearning } from "@/lib/saved-learning";
import { dashboardService } from "@/lib/services/dashboardService";
import type { LearnerCourse, LearnerDashboardPayload } from "@/types/dashboard";

// Per-area accent so courses keep the catalog's colour vocabulary.
type Tone = { stripe: string; chipBg: string; chipFg: string };
const AREA_TONES: Record<string, Tone> = {
  Housing: {
    stripe: "var(--topic-court)",
    chipBg: "var(--topic-court-soft)",
    chipFg: "var(--topic-court-ink)",
  },
  Ethics: {
    stripe: "var(--topic-ethics)",
    chipBg: "var(--topic-ethics-soft)",
    chipFg: "var(--topic-ethics-ink)",
  },
  "Legal skills": {
    stripe: "var(--topic-client)",
    chipBg: "var(--topic-client-soft)",
    chipFg: "var(--topic-client-ink)",
  },
  Orientation: {
    stripe: "var(--topic-foundations)",
    chipBg: "var(--topic-foundations-soft)",
    chipFg: "var(--topic-foundations-ink)",
  },
};
const DEFAULT_TONE: Tone = {
  stripe: "var(--brand-fill)",
  chipBg: "var(--brand-tint)",
  chipFg: "var(--brand-ink)",
};
const toneForArea = (area?: string): Tone => AREA_TONES[area ?? ""] ?? DEFAULT_TONE;

function daysUntil(iso: string): number {
  const due = new Date(iso).getTime();
  return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
}

function daysIdle(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

// ── Small visual atoms ─────────────────────────────────────────────────────
// A thin bar with the number beside it: progress reads as a fact, not a gauge.
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <span className="flex min-w-[7rem] items-center gap-2">
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-sunken)]">
        <span
          className="block h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </span>
      <span className="metadata shrink-0 tabular-nums text-[color:var(--ink-soft)]">{value}%</span>
    </span>
  );
}

function AreaPill({ area }: { area?: string }) {
  if (!area) return null;
  const tone = toneForArea(area);
  return (
    <span
      className="metadata rounded-[6px] px-2 py-0.5"
      style={{ background: tone.chipBg, color: tone.chipFg }}
    >
      {area}
    </span>
  );
}

function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-3">
      <h2 className="hero-title text-[22px] text-[color:var(--ink)]">{title}</h2>
      {action ? (
        <Link
          href={action.href}
          className="metadata inline-flex items-center gap-1.5 text-[color:var(--brand)] transition hover:text-[color:var(--ink)] focus-ring"
        >
          {action.label}
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

// ── Loading / error scaffolding ────────────────────────────────────────────
function TileSkeleton() {
  return (
    <div className="editorial-panel animate-pulse rounded-[var(--radius-card)] p-4" aria-hidden>
      <div className="h-3 w-1/3 rounded bg-[color:var(--surface-sunken)]" />
      <div className="mt-4 h-7 w-1/2 rounded bg-[color:var(--surface-sunken)]" />
      <div className="mt-3 h-3 w-2/3 rounded bg-[color:var(--surface-sunken)]" />
    </div>
  );
}

// ── Continue-learning rows ─────────────────────────────────────────────────
function ContinueHeroRow({ course }: { course: LearnerCourse }) {
  const tone = toneForArea(course.trainingArea);
  return (
    <div className="flex flex-wrap items-center gap-4 p-5">
      <div className="min-w-[12rem] flex-1">
        <AreaPill area={course.trainingArea} />
        <h3 className="section-title mt-1.5 text-[19px] text-[color:var(--ink)]">{course.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <ProgressBar value={course.completionPct} color={tone.stripe} />
          <p className="metadata text-[color:var(--ink-soft)]">
            Last opened {formatRelativeDate(course.lastAccessedAt)}
          </p>
        </div>
      </div>
      <a
        href={getLearningUrlForDashboardCourse(course)}
        className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] transition hover:opacity-90 focus-ring"
        aria-label={`Continue ${course.title}`}
      >
        <PlayIcon className="h-3.5 w-3.5" /> Continue
      </a>
    </div>
  );
}

function ContinueRow({ course }: { course: LearnerCourse }) {
  const tone = toneForArea(course.trainingArea);
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-[color:var(--line)] px-5 py-3.5">
      <div className="min-w-[10rem] flex-1">
        <AreaPill area={course.trainingArea} />
        <h3 className="section-title mt-1 text-[16px] text-[color:var(--ink)]">{course.title}</h3>
      </div>
      <ProgressBar value={course.completionPct} color={tone.stripe} />
      <p className="metadata text-[color:var(--ink-soft)]">
        {formatRelativeDate(course.lastAccessedAt)}
      </p>
      <a
        href={getLearningUrlForDashboardCourse(course)}
        className="inline-flex h-9 items-center rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--line-strong)] focus-ring"
        aria-label={`Resume ${course.title}`}
      >
        Resume
      </a>
    </div>
  );
}

function activityIcon(label: string): ComponentType<{ className?: string }> {
  const first = label.toLowerCase();
  if (first.startsWith("completed")) return CheckIcon;
  if (first.startsWith("bookmarked")) return BookmarkFilledIcon;
  if (first.startsWith("earned")) return CertificateIcon;
  return PlayIcon;
}

type FeedbackPrompts = ReturnType<typeof useFeedbackPrompts>;
type LearningBookmark = ReturnType<typeof getLearningItems>[number];

// Due dates stay neutral ink. Alert Red is reserved for law-changed notices
// (DESIGN.md, The One Red Rule), so it never doubles as a deadline colour.
function RequiredCoursesSection({ courses }: { courses: LearnerCourse[] }) {
  if (courses.length === 0) return null;

  return (
    <section aria-label="Required this quarter">
      <SectionHeading title="Due this quarter" />
      <div className="editorial-card overflow-hidden rounded-[var(--radius-card)] p-0">
        {courses.map((course, index) => {
          const days = daysUntil(course.dueDate as string);
          return (
            <div
              key={course.offeringId}
              className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${
                index > 0 ? "border-t border-[color:var(--line)]" : ""
              }`}
            >
              <div className="min-w-[10rem] flex-1">
                <h3 className="section-title text-[16px] text-[color:var(--ink)]">
                  {course.title}
                </h3>
                <div className="mt-1.5">
                  <AreaPill area={course.trainingArea} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-[color:var(--ink)]">
                  {new Date(course.dueDate as string).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="metadata tabular-nums text-[color:var(--ink-soft)]">in {days} days</p>
              </div>
              <a
                href={getLearningUrlForDashboardCourse(course)}
                className="inline-flex h-9 items-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-3.5 text-xs font-bold text-[color:var(--surface)] transition hover:opacity-90 focus-ring"
              >
                {course.completionPct > 0 ? "Resume" : "Start"}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function NotStartedSection({ courses }: { courses: LearnerCourse[] }) {
  if (courses.length === 0) return null;

  return (
    <section aria-label="Not started">
      <SectionHeading
        title="Not started yet"
        action={{ label: "Browse library", href: "/browse" }}
      />
      <div className="grid gap-3 2xl:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.offeringId}
            className="editorial-card flex flex-col gap-2 rounded-[var(--radius-card)] p-4"
          >
            <AreaPill area={course.trainingArea} />
            <h3 className="section-title text-[16px] text-[color:var(--ink)]">{course.title}</h3>
            <a
              href={getLearningUrlForDashboardCourse(course)}
              className="mt-1 inline-flex h-9 w-fit items-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--line-strong)] focus-ring"
            >
              <PlayIcon className="h-3.5 w-3.5" /> Start course
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentActivitySection({
  activity,
}: {
  activity: LearnerDashboardPayload["recentActivity"];
}) {
  if (!activity || activity.length === 0) return null;

  return (
    <section aria-label="Recent activity">
      <SectionHeading title="Recent activity" />
      <div className="editorial-card rounded-[var(--radius-card)] p-2">
        {activity.map((entry, index) => {
          const Icon = activityIcon(entry.label);
          return (
            <div
              key={`${entry.label}-${index}`}
              className={`flex items-center gap-3.5 px-3 py-3 ${
                index > 0 ? "border-t border-[color:var(--line)]" : ""
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--ink-soft)]" />
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-snug text-[color:var(--ink)]">
                  {entry.label}
                </p>
                <p className="metadata text-[color:var(--ink-soft)]">
                  {formatRelativeDate(entry.at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LearningPlanColumn({
  requiredCourses,
  notStarted,
  recentActivity,
}: {
  requiredCourses: LearnerCourse[];
  notStarted: LearnerCourse[];
  recentActivity: LearnerDashboardPayload["recentActivity"];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-9">
      <RequiredCoursesSection courses={requiredCourses} />
      <NotStartedSection courses={notStarted} />
      <RecentActivitySection activity={recentActivity} />
    </div>
  );
}

function LearningSidebarColumn({
  bookmarks,
  certificates,
}: {
  bookmarks: LearningBookmark[];
  certificates: LearnerDashboardPayload["certificates"];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-9">
      <section aria-label="Saved">
        <SectionHeading title="Saved" />
        {bookmarks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {bookmarks.map((item) => (
              <article
                key={`${item.type}:${item.id}`}
                className="editorial-card flex items-start gap-3 rounded-[var(--radius-card)] p-3.5"
              >
                <BookmarkFilledIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-fill)]" />
                <div className="min-w-0">
                  <h3 className="section-title text-[15px] leading-snug text-[color:var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="metadata mt-1 text-[color:var(--ink-soft)]">{item.type}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="editorial-panel rounded-[var(--radius-card)] p-5">
            <p className="text-sm font-medium text-[color:var(--ink-muted)]">
              Nothing saved yet. Use “Add to my list” on any course or module in the library.
            </p>
            <Link
              href="/browse"
              className="mt-3 inline-flex items-center gap-1.5 metadata text-[color:var(--brand)] transition hover:text-[color:var(--ink)] focus-ring"
            >
              Browse the library
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>

      {certificates && certificates.length > 0 ? (
        <section aria-label="Certificates">
          <SectionHeading title="Certificates" />
          <div className="flex flex-col gap-3">
            {certificates.map((certificate) => (
              <article
                key={certificate.id}
                className="editorial-card flex items-start gap-3 rounded-[var(--radius-card)] p-4"
              >
                <CertificateIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <div className="min-w-0">
                  <h3 className="section-title text-[16px] text-[color:var(--ink)]">
                    {certificate.title}
                  </h3>
                  <p className="metadata mt-1.5 tabular-nums text-[color:var(--ink-soft)]">
                    {certificate.earnedOn} {"·"} {certificate.credits}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function DashboardMainColumns({
  requiredCourses,
  notStarted,
  recentActivity,
  bookmarks,
  certificates,
}: {
  requiredCourses: LearnerCourse[];
  notStarted: LearnerCourse[];
  recentActivity: LearnerDashboardPayload["recentActivity"];
  bookmarks: LearningBookmark[];
  certificates: LearnerDashboardPayload["certificates"];
}) {
  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">
      <LearningPlanColumn
        requiredCourses={requiredCourses}
        notStarted={notStarted}
        recentActivity={recentActivity}
      />
      <LearningSidebarColumn bookmarks={bookmarks} certificates={certificates} />
    </div>
  );
}

// The payload is mocked (lib/services/dashboardService.ts → mocks/dashboard.ts).
// Say so on the page until the real /api/me/dashboard ships.
function SampleDataNote() {
  return (
    <p
      role="note"
      className="mb-6 max-w-3xl rounded-[var(--radius-control)] border border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)] px-3 py-2.5 text-[13px] leading-relaxed text-[color:var(--ink)]"
    >
      <strong className="font-bold">Sample data.</strong> Your real enrollments, progress, and
      certificates will come from Brightspace once it is connected.
    </p>
  );
}

function LoadedLearnerDashboardBody({
  data,
  bookmarks,
  feedbackPrompts,
  displayNameOverride,
}: {
  data: LearnerDashboardPayload;
  bookmarks: LearningBookmark[];
  feedbackPrompts: FeedbackPrompts;
  displayNameOverride?: string;
}) {
  const { user, summary, courses, recentActivity, certificates } = data;
  const learnerName = displayNameOverride || user.displayName;

  if (courses.length === 0) {
    return (
      <>
        <DashboardPageHeader title="My learning" subtitle={learnerName} />
        <div className="editorial-panel rounded-[var(--radius-card)] p-10 text-center">
          <h2 className="section-title text-lg text-[color:var(--ink)]">No courses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[color:var(--ink-muted)]">
            When you are enrolled in Brightspace trainings, they will appear here with progress and
            a link to continue.
          </p>
          <Link
            href="/browse"
            className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 text-sm font-bold text-[color:var(--ink-muted)] shadow-sm transition hover:text-[color:var(--ink)] focus-ring"
          >
            Browse the library
          </Link>
        </div>
      </>
    );
  }

  const inProgress = [...courses]
    .filter((course) => course.status === "in_progress")
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
  const heroCourse = inProgress[0];
  const secondaryCourses = inProgress.slice(1);
  const requiredCourses = [...courses]
    .filter((course) => course.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime(),
    );
  const notStarted = courses.filter((course) => course.status === "not_started");

  const ratingCandidate = feedbackPrompts.hydrated
    ? courses.find(
        (course) =>
          course.status === "completed" && !feedbackPrompts.isResolved("rating", course.offeringId),
      )
    : undefined;
  const stalledCandidate =
    feedbackPrompts.hydrated && !ratingCandidate
      ? courses.find(
          (course) =>
            course.status === "in_progress" &&
            daysIdle(course.lastAccessedAt) >= STALLED_AFTER_DAYS &&
            !feedbackPrompts.isResolved("stalled", course.offeringId),
        )
      : undefined;

  const hasHoursGoal = summary.hoursEarned != null && summary.hoursRequired != null;
  const hoursPart = hasHoursGoal
    ? `${summary.hoursEarned} of ${summary.hoursRequired} training hours${
        summary.hoursDueLabel ? `, ${summary.hoursDueLabel.replace(/^Due/, "due")}` : ""
      }`
    : null;

  const subtitleParts = [
    hoursPart,
    requiredCourses.length > 0 ? `${requiredCourses.length} due this quarter` : null,
    `${summary.enrolledCount} enrolled · ${summary.completedCount} completed`,
  ].filter(Boolean);

  return (
    <>
      <DashboardPageHeader
        title="My learning"
        subtitle={subtitleParts.join(" · ")}
        badge={
          <Link
            href="/browse"
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface)] px-4 text-sm font-bold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
          >
            <BookIcon className="h-4 w-4" /> Browse library
          </Link>
        }
      />

      <SampleDataNote />

      {ratingCandidate ? (
        <section aria-label="Course feedback" className="mb-6">
          <RateCourseCard
            course={ratingCandidate}
            onResolved={(action) =>
              feedbackPrompts.resolvePrompt("rating", ratingCandidate.offeringId, action)
            }
          />
        </section>
      ) : stalledCandidate ? (
        <section aria-label="Checking in on a stalled course" className="mb-6">
          <StalledCourseNudge
            course={stalledCandidate}
            onResolved={(action) =>
              feedbackPrompts.resolvePrompt("stalled", stalledCandidate.offeringId, action)
            }
          />
        </section>
      ) : null}

      {heroCourse ? (
        <section aria-label="Continue learning">
          <SectionHeading title="Continue learning" />
          <div className="editorial-card overflow-hidden rounded-[var(--radius-card)] p-0">
            <ContinueHeroRow course={heroCourse} />
            {secondaryCourses.map((course) => (
              <ContinueRow key={course.offeringId} course={course} />
            ))}
          </div>
        </section>
      ) : null}

      <DashboardMainColumns
        requiredCourses={requiredCourses}
        notStarted={notStarted}
        recentActivity={recentActivity}
        bookmarks={bookmarks}
        certificates={certificates}
      />
    </>
  );
}

/**
 * `displayNameOverride` personalizes the page during the Google-gated staff
 * demo (ADR 0012). The dashboard payload is still mocked, and its `user` is the
 * demo persona, so without this the home hero names the real staffer while this
 * page one click away still says "Sarah Chen".
 *
 * Deliberately a prop rather than an argument to `dashboardService`: that service
 * is the swap point for a real `fetch('/api/me/dashboard')`, where identity comes
 * from the session cookie server-side. A client handing a server endpoint its own
 * display name is the shape that would have to be unwound at the swap. When the
 * real payload ships, delete the prop and `user.displayName` takes over again.
 */
export function LearnerDashboardView({ displayNameOverride }: { displayNameOverride?: string }) {
  const [data, setData] = useState<LearnerDashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Bumped by "Try again" to re-run the fetch effect. This used to be
  // window.location.reload(), which threw away every bit of client state —
  // scroll position, open dialogs, saved-learning hydration — and re-ran the
  // whole auth waterfall to retry a single request.
  const [attempt, setAttempt] = useState(0);
  const { savedKeys } = useSavedLearning();
  const feedbackPrompts = useFeedbackPrompts();
  const allItems = useMemo(() => getLearningItems(), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    dashboardService
      .getLearnerDashboard()
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const bookmarks = useMemo(
    () =>
      savedKeys
        .map((key) => allItems.find((item) => `${item.type}:${item.id}` === key))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .slice(0, 4),
    [savedKeys, allItems],
  );

  if (loading) {
    return (
      <>
        <DashboardPageHeader
          title="Loading your learning…"
          subtitle="Fetching enrollments and progress."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <TileSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-8 text-center" role="alert">
        <h2 className="section-title text-lg text-[color:var(--ink)]">
          Could not load your dashboard
        </h2>
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">{error}</p>
        <button
          type="button"
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] focus-ring"
          onClick={() => setAttempt((n) => n + 1)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;
  return (
    <LoadedLearnerDashboardBody
      data={data}
      bookmarks={bookmarks}
      feedbackPrompts={feedbackPrompts}
      displayNameOverride={displayNameOverride}
    />
  );
}
