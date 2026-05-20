"use client";

import { useEffect, useState } from "react";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { DashboardPageHeader } from "@/components/dashboard/DashboardShell";
import { greetingForHour } from "@/lib/dashboard-utils";
import { dashboardService } from "@/lib/services/dashboardService";
import type { LearnerDashboardPayload } from "@/types/dashboard";

function CourseCardSkeleton() {
  return (
    <div className="lace-dash-card animate-pulse p-5" aria-hidden>
      <div className="h-5 w-3/4 rounded bg-[rgba(96,165,250,0.15)]" />
      <div className="mt-3 h-4 w-1/4 rounded bg-[rgba(96,165,250,0.1)]" />
      <div className="mt-6 h-2 rounded-full bg-[rgba(96,165,250,0.12)]" />
      <div className="mt-4 h-4 w-1/2 rounded bg-[rgba(96,165,250,0.08)]" />
      <div className="mt-5 h-10 rounded-lg bg-[rgba(45,212,191,0.12)]" />
    </div>
  );
}

function NoticeBanner({
  notices,
}: {
  notices: NonNullable<LearnerDashboardPayload["notices"]>;
}) {
  if (notices.length === 0) return null;
  const notice = notices[0];
  const isWarning = notice.severity === "warning";

  return (
    <aside
      className={`lace-dash-card mb-6 border-l-4 p-4 ${
        isWarning ? "border-l-amber-400" : "border-l-[var(--lace-dash-cyan)]"
      }`}
      role="status"
    >
      <p className="lace-dash-mono text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-teal)]">
        {isWarning ? "Notice" : "Update"}
      </p>
      <h2 className="mt-1 font-semibold text-[var(--lace-dash-text)]">{notice.title}</h2>
      <p className="mt-1 text-sm text-[var(--lace-dash-muted)]">{notice.body}</p>
    </aside>
  );
}

export function LearnerDashboardView() {
  const [data, setData] = useState<LearnerDashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <DashboardPageHeader title="Loading your learning…" subtitle="Fetching enrollments and progress." />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="lace-dash-card p-8 text-center" role="alert">
        <h2 className="text-lg font-semibold text-[var(--lace-dash-text)]">Could not load your dashboard</h2>
        <p className="mt-2 text-sm text-[var(--lace-dash-muted)]">{error}</p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-[var(--lace-dash-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--lace-dash-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-cyan)]"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { user, summary, courses, notices } = data;
  const subtitle = `${summary.enrolledCount} enrolled · ${summary.inProgressCount} in progress · ${summary.completedCount} completed`;

  return (
    <>
      <NoticeBanner notices={notices ?? []} />

      <DashboardPageHeader
        eyebrow="My Learning"
        title={greetingForHour(user.displayName)}
        subtitle={subtitle}
      />

      {courses.length === 0 ? (
        <div className="lace-dash-card p-10 text-center">
          <h2 className="text-lg font-semibold text-[var(--lace-dash-text)]">No courses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--lace-dash-muted)]">
            When you are enrolled in Brightspace trainings, they will appear here with progress and a link to continue.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-lg border border-[rgba(45,212,191,0.35)] px-5 py-2.5 text-sm font-semibold text-[var(--lace-dash-teal)] hover:bg-[rgba(45,212,191,0.08)]"
          >
            Browse the discovery library
          </a>
        </div>
      ) : (
        <section aria-label="Your courses">
          <h2 className="lace-dash-mono mb-4 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
            Your courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <CourseProgressCard key={course.offeringId} course={course} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
