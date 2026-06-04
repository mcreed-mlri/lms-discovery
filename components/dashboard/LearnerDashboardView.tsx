"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProgressRing } from "@/components/progress-ring";
import {
  ArrowIcon,
  BookIcon,
  BookmarkFilledIcon,
  CertificateIcon,
  CheckIcon,
  FlameIcon,
  PlayIcon,
} from "@/components/icons";
import { formatRelativeDate, greetingForHour } from "@/lib/dashboard-utils";
import { getLearningItems, getLearningUrlForDashboardCourse } from "@/lib/data";
import { useSavedLearning } from "@/lib/saved-learning";
import { dashboardService } from "@/lib/services/dashboardService";
import type { LearnerCourse, LearnerDashboardPayload } from "@/types/dashboard";

// Per-area accent so courses keep the catalog's colour vocabulary.
type Tone = { stripe: string; chipBg: string; chipFg: string };
const AREA_TONES: Record<string, Tone> = {
  Housing: { stripe: "#2a5bff", chipBg: "#f5ead0", chipFg: "#8a6218" },
  Ethics: { stripe: "#a45f49", chipBg: "#f4e3da", chipFg: "#8d472e" },
  "Practice skills": { stripe: "#6f927b", chipBg: "#e7efe7", chipFg: "#3d5c47" },
  Benefits: { stripe: "#7a6a8f", chipBg: "#ece7f1", chipFg: "#564876" },
  "Family law": { stripe: "#a87238", chipBg: "#f0e6d8", chipFg: "#7e5022" },
};
const DEFAULT_TONE: Tone = { stripe: "#2a5bff", chipBg: "#f5ead0", chipFg: "#8a6218" };
const toneForArea = (area?: string): Tone => AREA_TONES[area ?? ""] ?? DEFAULT_TONE;

function daysUntil(iso: string): number {
  const due = new Date(iso).getTime();
  return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
}

// ── Small visual atoms ─────────────────────────────────────────────────────
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const width = 120;
  const height = 26;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / Math.max(1, max - min)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StreakHeatmap({ data }: { data: number[] }) {
  const cells = data.slice(0, 84);
  return (
    <div
      className="grid w-fit"
      style={{
        gridTemplateColumns: "repeat(12, 11px)",
        gridTemplateRows: "repeat(7, 11px)",
        gridAutoFlow: "column",
        gap: 3,
      }}
      aria-hidden="true"
    >
      {cells.map((value, index) => {
        const opacity = value === 0 ? 1 : value === 1 ? 0.35 : value === 2 ? 0.6 : value === 3 ? 0.85 : 1;
        return (
          <div
            key={index}
            className="rounded-[2px]"
            style={{ background: value === 0 ? "var(--surface-sunken)" : "#2a5bff", opacity }}
          />
        );
      })}
    </div>
  );
}

function KpiTile({
  label,
  value,
  unit,
  detail,
  accent,
  icon: Icon,
  sparkline,
}: {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  accent: string;
  icon: ComponentType<{ className?: string }>;
  sparkline?: number[];
}) {
  return (
    <article className="editorial-panel rounded-[var(--radius-card)] p-4">
      <div className="flex items-center justify-between">
        <p className="stat-label text-[#8b909d]">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-2.5 flex items-baseline gap-1">
        <span className="hero-title text-[2rem] text-[color:var(--ink)]">{value}</span>
        {unit ? <span className="text-sm font-semibold text-[#8a8173]">{unit}</span> : null}
      </p>
      <p className="mt-1.5 text-[0.82rem] font-medium leading-snug text-[color:var(--ink-muted)]">{detail}</p>
      {sparkline ? (
        <div className="mt-2" style={{ color: accent }}>
          <Sparkline values={sparkline} color={accent} />
        </div>
      ) : null}
    </article>
  );
}

function AreaPill({ area }: { area?: string }) {
  if (!area) return null;
  const tone = toneForArea(area);
  return (
    <span
      className="metadata rounded-full px-2 py-0.5"
      style={{ background: tone.chipBg, color: tone.chipFg }}
    >
      {area}
    </span>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b border-[color:var(--lace-hairline)] pb-3">
      <div>
        <p className="section-kicker secondary">{eyebrow}</p>
        <h2 className="hero-title mt-1 text-[1.5rem] text-[color:var(--ink)]">{title}</h2>
      </div>
      {action ? (
        <Link href={action.href} className="metadata inline-flex items-center gap-1.5 text-[color:var(--brand)] transition hover:text-[color:var(--ink)]">
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
    <div
      className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[var(--shadow-xs)]"
      style={{ borderTop: `3px solid ${tone.stripe}` }}
    >
      <ProgressRing value={course.completionPct} size={52} stroke={5} color={tone.stripe} trackColor="var(--surface-sunken)">
        <span className="font-mono text-[0.72rem] font-bold text-[color:var(--ink)]">{course.completionPct}%</span>
      </ProgressRing>
      <div className="min-w-[12rem] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="metadata rounded-full bg-[color:var(--ink)] px-2 py-0.5 text-[color:var(--surface)]">Resume</span>
          <AreaPill area={course.trainingArea} />
        </div>
        <h3 className="section-title mt-1.5 text-[1.2rem] text-[color:var(--ink)]">{course.title}</h3>
        <p className="metadata mt-1 text-[color:var(--ink-soft)]">Last visited {formatRelativeDate(course.lastAccessedAt)}</p>
      </div>
      <a
        href={getLearningUrlForDashboardCourse(course)}
        className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[0_10px_22px_rgba(23,23,19,0.16)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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
    <div className="flex flex-wrap items-center gap-4 border-t border-[color:var(--lace-hairline)] px-5 py-3.5">
      <span className="hidden h-9 w-1 shrink-0 rounded-full sm:block" style={{ background: tone.stripe }} />
      <ProgressRing value={course.completionPct} size={38} stroke={4} color={tone.stripe} trackColor="#ece3d2">
        <span className="font-mono text-[0.62rem] font-bold text-[color:var(--ink)]">{course.completionPct}</span>
      </ProgressRing>
      <div className="min-w-[10rem] flex-1">
        <AreaPill area={course.trainingArea} />
        <h3 className="section-title mt-1 text-[1rem] text-[color:var(--ink)]">{course.title}</h3>
      </div>
      <p className="metadata text-[color:var(--ink-soft)]">{formatRelativeDate(course.lastAccessedAt)}</p>
      <a
        href={getLearningUrlForDashboardCourse(course)}
        className="inline-flex h-8 items-center rounded-[10px] border border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] px-3.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--border-strong)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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

export function LearnerDashboardView() {
  const [data, setData] = useState<LearnerDashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { savedKeys } = useSavedLearning();
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
  }, []);

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
        <DashboardPageHeader title="Loading your learning…" subtitle="Fetching enrollments and progress." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <TileSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-8 text-center" role="alert">
        <h2 className="section-title text-lg text-[color:var(--ink)]">Could not load your dashboard</h2>
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">{error}</p>
        <button
          type="button"
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { user, summary, courses, recentActivity, certificates } = data;

  if (courses.length === 0) {
    return (
      <>
        <DashboardPageHeader eyebrow="My learning" title={greetingForHour(user.displayName)} />
        <div className="editorial-panel rounded-[var(--radius-card)] p-10 text-center">
          <h2 className="section-title text-lg text-[color:var(--ink)]">No courses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[color:var(--ink-muted)]">
            When you are enrolled in Brightspace trainings, they will appear here with progress and a link to continue.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-raised)] px-5 text-sm font-bold text-[color:var(--ink-muted)] shadow-sm transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
          >
            Browse the discovery library
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
    .sort((a, b) => new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime());
  const notStarted = courses.filter((course) => course.status === "not_started");

  const streakDays = summary.streakDays ?? 0;
  const hasCle = summary.cleEarned != null && summary.cleRequired != null;
  const clePct = hasCle ? Math.round(((summary.cleEarned as number) / (summary.cleRequired as number)) * 100) : 0;
  const heatmap = data.activityHeatmap ?? [];
  const sparkline = data.weeklySparkline ?? [];

  const subtitleParts = [
    streakDays > 0 ? `${streakDays}-day streak` : null,
    requiredCourses.length > 0 ? `${requiredCourses.length} due this quarter` : null,
    `${summary.enrolledCount} enrolled · ${summary.completedCount} completed`,
  ].filter(Boolean);

  return (
    <>
      <DashboardPageHeader
        eyebrow="My learning"
        title={greetingForHour(user.displayName)}
        subtitle={subtitleParts.join(" · ")}
        badge={
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-4 text-sm font-bold text-[color:var(--surface)] shadow-[0_10px_22px_rgba(23,23,19,0.16)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
          >
            <BookIcon className="h-4 w-4" /> Browse library
          </Link>
        }
      />

      {/* KPI tiles — consistency + training hours at a glance */}
      <section aria-label="Learning snapshot" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {hasCle ? (
          <article className="editorial-panel flex items-center gap-4 rounded-[var(--radius-card)] p-4">
            <ProgressRing value={clePct} size={74} stroke={7} color="#2a5bff" trackColor="var(--surface-sunken)">
              <span className="hero-title block text-[1.25rem] leading-none text-[color:var(--ink)]">{clePct}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="stat-label text-[#8b909d]">Training hours</p>
              <p className="hero-title mt-1 text-[1.35rem] text-[color:var(--ink)]">
                {summary.cleEarned} of {summary.cleRequired} hours
              </p>
              <p className="mt-1 text-[0.82rem] font-medium text-[color:var(--ink-muted)]">
                {summary.cleDueLabel ?? "On pace"} · on pace
              </p>
            </div>
          </article>
        ) : null}
        <KpiTile
          label="Streak"
          value={String(streakDays)}
          unit="days"
          detail={summary.longestStreakNote ?? "Keep it going"}
          accent="#2a5bff"
          icon={FlameIcon}
        />
        <KpiTile
          label="In progress"
          value={String(summary.inProgressCount)}
          detail={`${summary.weeklyHoursAvg ?? 0} hrs/week average`}
          accent="#2a5bff"
          icon={PlayIcon}
        />
        <KpiTile
          label="Completed"
          value={String(summary.completedCount)}
          detail="Courses finished this term"
          accent="#6f927b"
          icon={CheckIcon}
          sparkline={sparkline.length > 1 ? sparkline : undefined}
        />
      </section>

      {/* Continue learning — one hero course, then a compact list */}
      {heroCourse ? (
        <section aria-label="Continue learning" className="mt-10">
          <SectionHeading eyebrow="Pick up where you left off" title="Continue learning" />
          <div className="editorial-card overflow-hidden rounded-[var(--radius-card)] p-0">
            <ContinueHeroRow course={heroCourse} />
            {secondaryCourses.map((course) => (
              <ContinueRow key={course.offeringId} course={course} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column — required + not started */}
        <div>
          {requiredCourses.length > 0 ? (
            <section aria-label="Required this quarter">
              <SectionHeading eyebrow="Required" title="Due this quarter" />
              <div className="editorial-card overflow-hidden rounded-[var(--radius-card)] p-0">
                {requiredCourses.map((course, index) => {
                  const days = daysUntil(course.dueDate as string);
                  const urgency = days <= 20 ? "#c8493b" : days <= 40 ? "#2a5bff" : "#6f927b";
                  return (
                    <div
                      key={course.offeringId}
                      className={`flex flex-wrap items-center gap-4 px-5 py-3.5 ${
                        index > 0 ? "border-t border-[color:var(--lace-hairline)]" : ""
                      }`}
                    >
                      <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: urgency }} />
                      <div className="min-w-[10rem] flex-1">
                        <h3 className="section-title text-[1rem] text-[color:var(--ink)]">{course.title}</h3>
                        <div className="mt-1.5">
                          <AreaPill area={course.trainingArea} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold" style={{ color: days <= 20 ? "#c8493b" : "#1f1d19" }}>
                          {new Date(course.dueDate as string).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </p>
                        <p className="metadata text-[#9b9283]">{days} days</p>
                      </div>
                      <a
                        href={getLearningUrlForDashboardCourse(course)}
                        className="inline-flex h-8 items-center rounded-[10px] bg-[color:var(--ink)] px-3.5 text-xs font-bold text-[color:var(--surface)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                      >
                        {course.completionPct > 0 ? "Resume" : "Start"}
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {notStarted.length > 0 ? (
            <section aria-label="Not started" className="mt-9">
              <SectionHeading eyebrow="Up next" title="Not started yet" action={{ label: "Browse library", href: "/" }} />
              <div className="grid gap-3 sm:grid-cols-2">
                {notStarted.map((course) => {
                  const tone = toneForArea(course.trainingArea);
                  return (
                    <article
                      key={course.offeringId}
                      className="editorial-card flex flex-col gap-2 rounded-[var(--radius-card)] p-4"
                      style={{ borderTop: `3px solid ${tone.stripe}` }}
                    >
                      <AreaPill area={course.trainingArea} />
                      <h3 className="section-title text-[1rem] text-[color:var(--ink)]">{course.title}</h3>
                      <a
                        href={getLearningUrlForDashboardCourse(course)}
                        className="mt-1 inline-flex h-9 w-fit items-center gap-2 rounded-[10px] border border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] px-3.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[color:var(--border-strong)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                      >
                        <PlayIcon className="h-3.5 w-3.5" /> Start course
                      </a>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        {/* Right column — consistency + bookmarks */}
        <div>
          <section aria-label="Consistency">
            <SectionHeading eyebrow="Consistency" title="Your last 12 weeks" />
            <div className="editorial-panel rounded-[var(--radius-card)] p-4">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FlameIcon className="h-5 w-5 text-[color:var(--brand)]" />
                  <div>
                    <p className="hero-title text-[1.3rem] leading-none text-[color:var(--ink)]">{streakDays} days</p>
                    <p className="stat-label mt-1 text-[#9b9283]">{summary.weeklyHoursAvg ?? 0} hrs/week avg</p>
                  </div>
                </div>
                {sparkline.length > 1 ? (
                  <span className="text-[#2a5bff]">
                    <Sparkline values={sparkline} color="#2a5bff" />
                  </span>
                ) : null}
              </div>
              {heatmap.length > 0 ? <StreakHeatmap data={heatmap} /> : null}
            </div>
          </section>

          <section aria-label="Bookmarks" className="mt-9">
            <SectionHeading eyebrow="Saved" title="Your bookmarks" />
            {bookmarks.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {bookmarks.map((item) => (
                  <article
                    key={`${item.type}:${item.id}`}
                    className="editorial-card flex items-start gap-3 rounded-[var(--radius-card)] p-3.5"
                  >
                    <BookmarkFilledIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#2a5bff]" />
                    <div className="min-w-0">
                      <h3 className="section-title text-[0.95rem] leading-snug text-[color:var(--ink)]">{item.title}</h3>
                      <p className="metadata mt-1 text-[#9b9283]">{item.type}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="editorial-panel rounded-[var(--radius-card)] p-5 text-center">
                <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                  Bookmark a course or module from the library and it will wait for you here.
                </p>
                <Link href="/" className="mt-3 inline-block metadata text-[color:var(--brand)] transition hover:text-[color:var(--ink)]">
                  Browse the library →
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Activity + certificates */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {recentActivity && recentActivity.length > 0 ? (
          <section aria-label="Recent activity">
            <SectionHeading eyebrow="Recent activity" title="What you've been doing" />
            <div className="editorial-card rounded-[var(--radius-card)] p-2">
              {recentActivity.map((entry, index) => {
                const Icon = activityIcon(entry.label);
                return (
                  <div
                    key={`${entry.label}-${index}`}
                    className={`flex items-center gap-3.5 px-3 py-3 ${
                      index > 0 ? "border-t border-[color:var(--lace-hairline)]" : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-sunken)] text-[color:var(--brand-ink)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="metadata text-[#9b9283]">{formatRelativeDate(entry.at)}</p>
                      <p className="section-title text-[0.95rem] leading-snug text-[color:var(--ink)]">{entry.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {certificates && certificates.length > 0 ? (
          <section aria-label="Certificates">
            <SectionHeading eyebrow="Earned" title="Certificates" />
            <div className="flex flex-col gap-3">
              {certificates.map((certificate) => (
                <article
                  key={certificate.id}
                  className="editorial-card relative overflow-hidden rounded-[var(--radius-card)] p-4"
                >
                  <span className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-[rgba(184,138,45,0.08)]" />
                  <CertificateIcon className="h-5 w-5 text-[color:var(--brand)]" />
                  <h3 className="section-title mt-3 text-[1rem] text-[color:var(--ink)]">{certificate.title}</h3>
                  <p className="metadata mt-1.5 text-[#9b9283]">
                    {certificate.earnedOn} · {certificate.credits}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
