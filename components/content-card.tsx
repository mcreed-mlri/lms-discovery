import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseId, getCourseLabel, getCourseTheme, getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { courses, getModuleMinutes, type LearningItem } from "@/lib/data";
import type { MouseEvent } from "react";

const comingSoonHref = "#content-coming-soon";
const comingSoonLabel = "Open details";

function preventPlaceholderNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function ComingSoonTooltip() {
  return (
    <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[color:var(--ink-soft)] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
      {comingSoonLabel}
    </span>
  );
}

function getMeta(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses, ${item.totalDuration}`;
  if (item.type === "MODULE") return `${getModuleMinutes(item.id)} min`;
  return `${item.practiceArea}, ${item.duration}`;
}

// Lifecycle badge — a status signal, kept visually separate from topic colour.
// The text label carries the meaning; colour only reinforces it.
function ContentStatusChip({ status }: { status: "New" | "Updated" }) {
  const theme = getStatusTheme(resolveStatusKey(status));

  return (
    <span className={`metadata inline-flex items-center gap-1.5 rounded-md border px-2 py-1 leading-none ${theme.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

// A subtle "Details" affordance — neutral so it never competes for attention.
function DetailsAffordance({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-xs font-semibold text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] transition duration-200 ease-out group-hover:border-[color:var(--line-strong)] group-hover:bg-[color:var(--surface-raised)] group-hover:text-[color:var(--ink)] ${className}`}
    >
      Details <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
      className={`editorial-card group relative flex h-full cursor-pointer flex-col overflow-hidden transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 before:opacity-85 focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 ${
        isModule ? "min-h-[11.25rem] p-4 pt-4 before:h-1" : "min-h-[15.75rem] p-[1.125rem] pt-5 before:h-1"
      } ${
        courseTheme ? `${courseTheme.hoverBorder} ${courseTheme.rail}` : "before:bg-[color:var(--line-strong)]"
      }`}
    >
      <ComingSoonTooltip />
      <div className={`${isModule ? "mb-3" : "mb-3.5"} flex min-h-8 flex-wrap items-start gap-2`}>
        <TypeBadge type={item.type} />
        {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
      </div>
      <h3 className={`card-title ${isModule ? "text-[1.08rem]" : "text-[1.18rem]"} leading-snug`}>{item.title}</h3>
      {isModule && (
        <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} aria-hidden="true" />
          {item.parentCourseTitle}
        </p>
      )}
      <p className={`card-description mt-2.5 text-[0.9rem] leading-relaxed ${isModule ? "line-clamp-2" : "line-clamp-3"}`}>{item.description}</p>
      <div className={`${isModule ? "pt-3.5" : "pt-4"} mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--line-soft)]`}>
        <span className="text-[0.82rem] font-semibold leading-5 tabular-nums text-[color:var(--ink-soft)]">{getMeta(item)}</span>
        <DetailsAffordance className={`h-8 ${isCourse ? "px-3" : "px-2.5"}`} />
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
      className={`editorial-card group relative grid cursor-pointer gap-4 overflow-hidden p-5 pl-5 transition duration-200 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
        courseTheme ? `${courseTheme.hoverBorder} ${courseTheme.rail}` : "before:bg-[color:var(--line-strong)]"
      }`}
    >
      <ComingSoonTooltip />
      <div className="min-w-0">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
          <span className="text-[0.82rem] font-semibold tabular-nums text-[color:var(--ink-soft)]">{getMeta(item)}</span>
        </div>
        <h3 className="card-title text-lg leading-snug">{item.title}</h3>
        {isModule && (
          <p className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold leading-5 ${courseTheme?.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${courseTheme?.dot}`} aria-hidden="true" />
            {item.parentCourseTitle}
          </p>
        )}
        {!isModule && <p className="card-description mt-2 max-w-4xl">{item.description}</p>}
      </div>
      <DetailsAffordance className="w-fit px-3 py-1.5" />
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
      className={`editorial-card group relative block cursor-pointer overflow-hidden p-[1.125rem] pt-5 transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 before:h-1 before:opacity-85 focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 ${
        pathTheme ? `${pathTheme.hoverBorder} ${pathTheme.rail}` : "before:bg-[color:var(--line-strong)]"
      }`}
    >
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[color:var(--ink-soft)] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {comingSoonLabel}
      </span>
      <div className="flex items-start">
        <TypeBadge type="PATH" />
      </div>
      <h3 className="card-title mt-3.5 text-[1.18rem] leading-tight">{item.title}</h3>
      <p className="card-description mt-2.5 line-clamp-3 text-[0.9rem] leading-relaxed">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {relatedCourses.slice(0, 3).map((course) => (
          <span key={course.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getCourseTheme(course.id).chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getCourseTheme(course.id).dot}`} aria-hidden="true" />
            {getCourseLabel(course)}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-[color:var(--line-soft)] pt-3.5">
        <span className="text-[0.82rem] font-semibold leading-5 tabular-nums text-[color:var(--ink-soft)]">
          {item.courseIds.length} courses, {item.totalDuration}
        </span>
        <DetailsAffordance className="px-3 py-1.5" />
      </div>
    </a>
  );
}
