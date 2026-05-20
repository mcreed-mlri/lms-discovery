import { ArrowIcon } from "@/components/icons";
import { formatRelativeDate, statusLabel } from "@/lib/dashboard-utils";
import type { LearnerCourse } from "@/types/dashboard";
import { ProgressBar } from "./ProgressBar";

const statusStyles: Record<LearnerCourse["status"], string> = {
  not_started: "bg-[rgba(96,165,250,0.12)] text-[var(--lace-dash-cyan)]",
  in_progress: "bg-[rgba(45,212,191,0.15)] text-[var(--lace-dash-teal)]",
  completed: "bg-[rgba(45,212,191,0.22)] text-[#a7f3ec]",
};

export function CourseProgressCard({ course }: { course: LearnerCourse }) {
  return (
    <article className="lace-dash-card flex flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-snug text-[var(--lace-dash-text)]">{course.title}</h3>
          {course.trainingArea ? (
            <span className="lace-dash-mono mt-2 inline-block rounded-md border border-[rgba(45,212,191,0.25)] bg-[rgba(45,212,191,0.08)] px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-teal)]">
              {course.trainingArea}
            </span>
          ) : null}
        </div>
        <span
          className={`lace-dash-mono shrink-0 rounded-full px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-wider ${statusStyles[course.status]}`}
        >
          {statusLabel(course.status)}
        </span>
      </div>

      <div className="mt-5">
        <ProgressBar value={course.completionPct} label={`${course.title} progress`} />
      </div>

      <p className="mt-4 text-sm text-[var(--lace-dash-muted)]">
        Last visited <span className="text-[var(--lace-dash-text-soft)]">{formatRelativeDate(course.lastAccessedAt)}</span>
        {course.dueDate ? (
          <>
            {" "}
            · Due{" "}
            <span className="text-[var(--lace-dash-text-soft)]">
              {new Date(course.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </>
        ) : null}
      </p>

      <a
        href={course.resumeUrl}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--lace-dash-teal)] px-4 text-sm font-semibold text-[var(--lace-dash-navy)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--lace-dash-navy)] sm:w-auto"
        target={course.resumeUrl.startsWith("http") ? "_blank" : undefined}
        rel={course.resumeUrl.startsWith("http") ? "noreferrer" : undefined}
        aria-label={`Continue learning ${course.title}`}
      >
        Continue learning <ArrowIcon className="h-4 w-4" />
      </a>
    </article>
  );
}
