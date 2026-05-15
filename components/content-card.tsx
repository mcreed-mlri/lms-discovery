import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseId, getCourseLabel, getCourseTheme } from "@/lib/course-theme";
import { courses, type LearningItem } from "@/lib/data";
import type { MouseEvent } from "react";

const comingSoonHref = "#content-coming-soon";
const comingSoonLabel = "Open details";

function preventPlaceholderNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function ComingSoonTooltip() {
  return (
    <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-2.5 py-1 text-xs font-semibold text-[#706a5f] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
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
    <span className={`metadata inline-flex items-center rounded-md border px-2 py-1 leading-none ${styles}`}>
      {status}
    </span>
  );
}

function handleOpen(event: MouseEvent<HTMLAnchorElement>, item: LearningItem, onOpen?: (item: LearningItem) => void) {
  event.preventDefault();
  onOpen?.(item);
}

export function ContentCard({ item, onOpen }: { item: LearningItem; onOpen?: (item: LearningItem) => void }) {
  const isModule = item.type === "MODULE";
  const isCourse = item.type === "COURSE";
  const courseTheme = item.type === "PATH" ? null : getCourseTheme(getCourseId(item));

  return (
    <a
      href={comingSoonHref}
      onClick={(event) => (onOpen ? handleOpen(event, item, onOpen) : preventPlaceholderNavigation(event))}
      title={comingSoonLabel}
      aria-label={`${item.title}. Open detail view.`}
      className={`editorial-card group relative flex h-full cursor-pointer flex-col overflow-hidden transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(40,32,20,0.10)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
        isModule ? "min-h-36 p-4 pt-4 before:h-0.5" : "min-h-48 p-5 pt-5 before:h-0.5"
      } ${
        courseTheme ? `${courseTheme.hoverBorder} ${courseTheme.rail}` : "before:bg-slate-200"
      }`}
    >
      <ComingSoonTooltip />
      <div className={`${isModule ? "mb-3" : "mb-3.5"} flex flex-wrap items-start gap-2`}>
        <TypeBadge type={item.type} />
        {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
      </div>
      <h3 className={`card-title ${isModule ? "text-[1.02rem]" : "text-[1.08rem]"} leading-snug`}>{item.title}</h3>
      {isModule && (
        <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} />
          {item.parentCourseTitle}
        </p>
      )}
      {!isModule && <p className="card-description mt-2.5 line-clamp-3">{item.description}</p>}
      <div className={`${isModule ? "pt-4" : "pt-5"} mt-auto flex items-end justify-between gap-3`}>
        <span className="text-sm font-medium text-[color:var(--lace-muted-strong)]">{isModule ? item.practiceArea : getMeta(item)}</span>
        <span className={`inline-flex h-8 items-center gap-1.5 rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] text-xs font-semibold text-[#62594b] shadow-sm transition duration-200 ease-out group-hover:border-[#b88a2d]/45 group-hover:text-[#1f1d19] ${isCourse ? "px-3" : "px-2.5"}`}>
          Details <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export function ContentListRow({ item, onOpen }: { item: LearningItem; onOpen?: (item: LearningItem) => void }) {
  const isModule = item.type === "MODULE";
  const courseTheme = item.type === "PATH" ? null : getCourseTheme(getCourseId(item));

  return (
    <a
      href={comingSoonHref}
      onClick={(event) => (onOpen ? handleOpen(event, item, onOpen) : preventPlaceholderNavigation(event))}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`editorial-card group relative grid cursor-pointer gap-4 overflow-hidden p-5 pl-5 transition duration-200 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(40,32,20,0.10)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
        courseTheme ? `${courseTheme.hoverBorder} ${courseTheme.rail}` : "before:bg-slate-200"
      }`}
    >
      <ComingSoonTooltip />
      <div className="min-w-0">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
          <span className="text-sm font-medium text-[color:var(--lace-muted-strong)]">{getMeta(item)}</span>
        </div>
        <h3 className="card-title text-lg leading-snug">{item.title}</h3>
        {isModule && (
          <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} />
            {item.parentCourseTitle}
          </p>
        )}
        {!isModule && <p className="card-description mt-2 max-w-4xl">{item.description}</p>}
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-3 py-1.5 text-xs font-semibold text-[#62594b] shadow-sm transition duration-200 ease-out group-hover:border-[#b88a2d]/45 group-hover:text-[#1f1d19]">
        Details <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export function PathCard({ item, onOpen }: { item: Extract<LearningItem, { type: "PATH" }>; onOpen?: (item: LearningItem) => void }) {
  const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));
  const pathTheme = relatedCourses[0] ? getCourseTheme(relatedCourses[0].id) : null;

  return (
    <a
      href={comingSoonHref}
      onClick={(event) => (onOpen ? handleOpen(event, item, onOpen) : preventPlaceholderNavigation(event))}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`editorial-card group relative block cursor-pointer overflow-hidden p-5 transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 before:h-0.5 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(40,32,20,0.10)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
        pathTheme ? `${pathTheme.hoverBorder} ${pathTheme.rail}` : "before:bg-slate-200"
      }`}
    >
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-2.5 py-1 text-xs font-semibold text-[#706a5f] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {comingSoonLabel}
      </span>
      <div className="flex items-start">
        <TypeBadge type="PATH" />
      </div>
      <h3 className="card-title mt-4 text-xl leading-tight">{item.title}</h3>
      <p className="card-description mt-3 line-clamp-3">{item.description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {relatedCourses.slice(0, 3).map((course) => (
          <span key={course.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getCourseTheme(course.id).chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getCourseTheme(course.id).dot}`} />
            {getCourseLabel(course)}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[color:var(--lace-hairline)] pt-4">
        <span className="text-sm font-medium text-[color:var(--lace-muted-strong)]">
          {item.courseIds.length} courses - {item.totalDuration}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] px-3 py-1.5 text-xs font-semibold text-[#62594b] shadow-sm transition duration-200 ease-out group-hover:border-[#b88a2d]/45 group-hover:text-[#1f1d19]">
          Details <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}
