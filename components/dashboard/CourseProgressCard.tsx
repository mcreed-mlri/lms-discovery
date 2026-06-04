import { ArrowIcon } from "@/components/icons";
import { BrightspaceLaunchLink } from "@/components/brightspace-launch-link";
import { formatRelativeDate, statusLabel } from "@/lib/dashboard-utils";
import type { LearnerCourse } from "@/types/dashboard";
import { ProgressBar } from "./ProgressBar";

const statusStyles: Record<LearnerCourse["status"], string> = {
  not_started: "border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] text-[color:var(--ink-soft)]",
  in_progress: "border-[#d4b87a] bg-[#f5edd8] text-[#7a5f1f]",
  completed: "border-[#a8c4b0] bg-[#e8f0ea] text-[#3d5c47]",
};

export function CourseProgressCard({ course }: { course: LearnerCourse }) {
  return (
    <article className="editorial-card flex flex-col border-l-4 border-l-[#2a5bff] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="card-title text-lg">{course.title}</h3>
          {course.trainingArea ? (
            <span className="metadata mt-2 inline-block rounded-full border border-[color:var(--lace-hairline)] bg-[color:var(--surface-raised)] px-2.5 py-0.5 text-[color:var(--ink-soft)]">
              {course.trainingArea}
            </span>
          ) : null}
        </div>
        <span
          className={`metadata shrink-0 rounded-full border px-2.5 py-1 ${statusStyles[course.status]}`}
        >
          {statusLabel(course.status)}
        </span>
      </div>

      <div className="mt-5">
        <ProgressBar value={course.completionPct} label={`${course.title} progress`} />
      </div>

      <p className="mt-4 text-sm font-medium text-[color:var(--ink-muted)]">
        Last visited <span className="text-[color:var(--ink-muted)]">{formatRelativeDate(course.lastAccessedAt)}</span>
        {course.dueDate ? (
          <>
            {" "}
            · Due{" "}
            <span className="text-[color:var(--ink-muted)]">
              {new Date(course.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </>
        ) : null}
      </p>

      <BrightspaceLaunchLink
        href={course.resumeUrl}
        launchTitle={course.title}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-4 text-sm font-bold text-[color:var(--surface)] shadow-[0_10px_22px_rgba(23,23,19,0.16)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15 sm:w-auto"
        aria-label={`Continue learning ${course.title}`}
      >
        Continue learning <ArrowIcon className="h-4 w-4" />
      </BrightspaceLaunchLink>
    </article>
  );
}
