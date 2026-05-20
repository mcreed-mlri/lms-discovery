"use client";

import { useEffect, useState } from "react";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { greetingForHour } from "@/lib/dashboard-utils";
import { dashboardService } from "@/lib/services/dashboardService";
import type { LearnerDashboardPayload } from "@/types/dashboard";

function CourseCardSkeleton() {
  return (
    <div className="editorial-card animate-pulse border-l-4 border-l-[#e6dccb] p-5" aria-hidden>
      <div className="h-5 w-3/4 rounded bg-[#e6dccb]" />
      <div className="mt-3 h-4 w-1/4 rounded bg-[#eee4d3]" />
      <div className="mt-6 h-2 rounded-full bg-[#e6dccb]" />
      <div className="mt-4 h-4 w-1/2 rounded bg-[#eee4d3]" />
      <div className="mt-5 h-10 rounded-[var(--radius-control)] bg-[#e6dccb]" />
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
      className={`editorial-panel mb-6 rounded-[var(--radius-card)] border-l-4 p-4 ${
        isWarning ? "border-l-[#b76545]" : "border-l-[#b88a2d]"
      }`}
      role="status"
    >
      <p className="section-kicker primary">{isWarning ? "Notice" : "Update"}</p>
      <h2 className="card-title mt-1 text-lg">{notice.title}</h2>
      <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">{notice.body}</p>
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
      <div className="editorial-panel rounded-[var(--radius-card)] p-8 text-center" role="alert">
        <h2 className="section-title text-lg text-[#171713]">Could not load your dashboard</h2>
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">{error}</p>
        <button
          type="button"
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[#171713] px-5 text-sm font-bold text-[#fffaf0] focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15"
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
        eyebrow="My learning"
        title={greetingForHour(user.displayName)}
        subtitle={subtitle}
      />

      {courses.length === 0 ? (
        <div className="editorial-panel rounded-[var(--radius-card)] p-10 text-center">
          <h2 className="section-title text-lg text-[#171713]">No courses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[color:var(--ink-muted)]">
            When you are enrolled in Brightspace trainings, they will appear here with progress and a link to continue.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[#fffdf7] px-5 text-sm font-bold text-[#5f5a4f] shadow-sm transition hover:text-[#171713] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
          >
            Browse the discovery library
          </a>
        </div>
      ) : (
        <section aria-label="Your courses">
          <h2 className="section-kicker secondary mb-4">Your courses</h2>
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
