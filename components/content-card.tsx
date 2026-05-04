import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseId, getCourseLabel, getCourseTheme } from "@/lib/course-theme";
import { courses, type LearningItem } from "@/lib/data";
import type { MouseEvent } from "react";

const comingSoonHref = "#content-coming-soon";
const comingSoonLabel = "Details coming soon";

function preventPlaceholderNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function ComingSoonTooltip() {
  return (
    <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
      {comingSoonLabel}
    </span>
  );
}

function getMeta(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses - ${item.totalDuration}`;
  if (item.type === "MODULE") return item.practiceArea;
  return `${item.practiceArea} - ${item.duration}`;
}

function ContentStatusChip({ status }: { status: "New" | "Updated" }) {
  const styles =
    status === "New"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[0.68rem] font-black uppercase leading-none tracking-[0.08em] ${styles}`}>
      {status}
    </span>
  );
}

export function ContentCard({ item }: { item: LearningItem }) {
  const isModule = item.type === "MODULE";
  const isCourse = item.type === "COURSE";
  const courseTheme = item.type === "PATH" ? null : getCourseTheme(getCourseId(item));

  return (
    <a
      href={comingSoonHref}
      onClick={preventPlaceholderNavigation}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100 ${
        isModule ? "min-h-40 p-3.5 pt-4 before:h-0.5" : "min-h-48 p-4 pt-5 before:h-1"
      } ${
        courseTheme ? `${courseTheme.border} ${courseTheme.hoverBorder} ${courseTheme.rail}` : "border-slate-200 before:bg-slate-200 hover:border-sky-200"
      }`}
    >
      <ComingSoonTooltip />
      <div className={`${isModule ? "mb-2" : "mb-3"} flex flex-wrap items-start gap-2`}>
        <TypeBadge type={item.type} />
        {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
      </div>
      <h3 className={`${isModule ? "text-base" : "text-lg"} font-bold leading-snug text-slate-800`}>{item.title}</h3>
      {isModule && (
        <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} />
          {item.parentCourseTitle}
        </p>
      )}
      <p className={`${isModule ? "line-clamp-2 leading-5" : "line-clamp-3 leading-6"} mt-2 text-sm text-slate-600`}>{item.description}</p>
      <div className={`${isModule ? "pt-4" : "pt-5"} mt-auto flex items-end justify-between gap-3`}>
        <span className="text-sm font-medium text-slate-500">{isModule ? item.practiceArea : getMeta(item)}</span>
        <span className={`inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-sm transition duration-200 ease-out group-hover:border-sky-200 group-hover:text-mlri-blue ${isCourse ? "px-3" : "px-2.5"}`}>
          Preview <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function ContentListRow({ item }: { item: LearningItem }) {
  const isModule = item.type === "MODULE";
  const courseTheme = item.type === "PATH" ? null : getCourseTheme(getCourseId(item));

  return (
    <a
      href={comingSoonHref}
      onClick={preventPlaceholderNavigation}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`group relative grid cursor-pointer gap-4 overflow-hidden rounded-xl border bg-white p-4 pl-5 shadow-sm transition duration-200 ease-out before:absolute before:inset-y-0 before:left-0 before:w-1 hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
        courseTheme ? `${courseTheme.border} ${courseTheme.hoverBorder} ${courseTheme.rail}` : "border-slate-200 before:bg-slate-200 hover:border-sky-200"
      }`}
    >
      <ComingSoonTooltip />
      <div className="min-w-0">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
          <span className="text-sm font-medium text-slate-500">{getMeta(item)}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-slate-800">{item.title}</h3>
        {isModule && (
          <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} />
            {item.parentCourseTitle}
          </p>
        )}
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{item.description}</p>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition duration-200 ease-out group-hover:border-sky-200 group-hover:text-mlri-blue">
        Preview <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export function PathCard({ item }: { item: Extract<LearningItem, { type: "PATH" }> }) {
  const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));

  return (
    <a
      href={comingSoonHref}
      onClick={preventPlaceholderNavigation}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className="group relative block cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100"
    >
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {comingSoonLabel}
      </span>
      <div className="flex items-start">
        <TypeBadge type="PATH" />
      </div>
      <h3 className="mt-3 text-lg font-bold leading-tight text-slate-800">{item.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {relatedCourses.slice(0, 3).map((course) => (
          <span key={course.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getCourseTheme(course.id).chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getCourseTheme(course.id).dot}`} />
            {getCourseLabel(course)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-medium text-slate-500">
          {item.courseIds.length} courses - {item.totalDuration}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition duration-200 ease-out group-hover:border-sky-200 group-hover:text-mlri-blue">
          Preview <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}
