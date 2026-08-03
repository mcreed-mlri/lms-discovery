import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import {
  getCourseAccent,
  getCourseLabel,
  getItemAccent,
  getStatusTheme,
  resolveStatusKey,
  type Accent,
} from "@/lib/course-theme";
import { courses, getModuleMinutes, type LearningItem } from "@/lib/data";
import type { CSSProperties } from "react";

// Expose an item's accent colour as CSS custom properties on a card, so the
// static Tailwind classes below (`bg-[color:var(--accent)]` etc.) pick up the
// per-skill-area colour without runtime class names.
function accentVars(accent: Accent): CSSProperties {
  return {
    "--accent": accent.solid,
    "--accent-tint": accent.tint,
    "--accent-ink": accent.ink,
  } as CSSProperties;
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
    <span
      className={`metadata inline-flex items-center gap-1.5 rounded-md border px-2 py-1 leading-none ${theme.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

// A subtle "Details" affordance — neutral so it never competes for attention.
function DetailsAffordance({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface)] text-xs font-semibold text-[color:var(--ink-muted)] shadow-[var(--shadow-xs)] transition duration-200 ease-out group-hover:border-[color:var(--line-strong)] group-hover:bg-[color:var(--surface-raised)] group-hover:text-[color:var(--ink)] ${className}`}
    >
      Details{" "}
      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </span>
  );
}

export function ContentCard({
  item,
  onOpen,
  variant = "standard",
}: {
  item: LearningItem;
  onOpen?: (item: LearningItem) => void;
  variant?: "standard" | "featured";
}) {
  const isModule = item.type === "MODULE";
  const isCourse = item.type === "COURSE";
  const isFeatured = variant === "featured" && isCourse;
  const accent = getItemAccent(item);

  // A button, not a link: this opens a detail dialog in place. It used to be an
  // <a href="#content-coming-soon"> with preventDefault, which announced itself
  // as a link to a fragment that does not exist.
  return (
    <button
      type="button"
      style={accentVars(accent)}
      onClick={() => onOpen?.(item)}
      aria-label={`${item.title}. Open detail view.`}
      className={`editorial-card group relative flex h-full cursor-pointer flex-col overflow-hidden text-left transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 before:opacity-85 before:bg-[color:var(--accent)] hover:border-[color:var(--accent)] focus-ring ${
        isFeatured
          ? "min-h-0 border-[color:var(--brand)] p-4 pt-5 before:h-1.5 sm:col-span-2 sm:min-h-[15.75rem] sm:p-6 sm:pt-7 lg:col-span-2"
          : isModule
            ? "min-h-0 p-3 pt-3.5 before:h-1 sm:min-h-[11.25rem] sm:p-4 sm:pt-4"
            : "min-h-0 p-3 pt-3.5 before:h-1 sm:min-h-[15.75rem] sm:p-[1.125rem] sm:pt-5"
      }`}
    >
      {isFeatured && (
        <div className="mb-3 flex items-center gap-2 border-l-2 border-[color:var(--brand)] pl-3 text-[12px] font-bold text-[color:var(--brand-ink)]">
          Recommended next
        </div>
      )}
      <div
        className={`${isModule ? "mb-2 sm:mb-3" : "mb-2 sm:mb-3.5"} flex min-h-0 flex-wrap items-start gap-1.5 sm:min-h-8 sm:gap-2`}
      >
        <TypeBadge type={item.type} />
        {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
        <span className="ml-auto text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)] sm:hidden">
          {getMeta(item)}
        </span>
      </div>
      <h3
        className={`card-title line-clamp-2 ${
          isFeatured
            ? "text-[20px] sm:text-[24px]"
            : isModule
              ? "text-[16px] sm:text-[17px]"
              : "text-[16px] sm:text-[19px]"
        } leading-snug`}
      >
        {item.title}
      </h3>
      {isModule && (
        <p className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-md border border-[color:var(--line)] bg-[color:var(--accent-tint)] px-2 py-0.5 text-[11px] font-semibold leading-5 text-[color:var(--accent-ink)] sm:mt-2 sm:px-2 sm:py-1 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" aria-hidden="true" />
          {item.parentCourseTitle}
        </p>
      )}
      <p
        className={`card-description mt-1.5 hidden text-[14px] leading-relaxed sm:mt-2.5 sm:block ${
          isFeatured
            ? "max-w-xl text-[15px] line-clamp-3"
            : isModule
              ? "line-clamp-2"
              : "line-clamp-3"
        }`}
      >
        {item.description}
      </p>
      <div
        className={`${isModule ? "pt-2.5 sm:pt-3.5" : "pt-2.5 sm:pt-4"} mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--line-soft)]`}
      >
        <span className="hidden text-[13px] font-semibold leading-5 tabular-nums text-[color:var(--ink-soft)] sm:inline">
          {getMeta(item)}
        </span>
        <DetailsAffordance
          className={`hidden h-8 sm:inline-flex ${isCourse ? "px-3" : "px-2.5"}`}
        />
        <ArrowIcon
          className="ml-auto h-4 w-4 text-[color:var(--ink-soft)] sm:hidden"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

export function ContentListRow({
  item,
  onOpen,
}: {
  item: LearningItem;
  onOpen?: (item: LearningItem) => void;
}) {
  const isModule = item.type === "MODULE";
  const accent = getItemAccent(item);

  return (
    <button
      type="button"
      style={accentVars(accent)}
      onClick={() => onOpen?.(item)}
      aria-label={`${item.title}. Open detail view.`}
      className="editorial-card group relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden p-3 pl-3.5 text-left transition duration-200 ease-out before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[color:var(--accent)] hover:border-[color:var(--accent)] focus-ring sm:grid-cols-1 sm:gap-4 sm:p-5 sm:pl-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 sm:mb-2.5 sm:gap-2">
          <TypeBadge type={item.type} />
          {isModule && item.contentStatus && <ContentStatusChip status={item.contentStatus} />}
          <span className="text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)] sm:text-[13px]">
            {getMeta(item)}
          </span>
        </div>
        <h3 className="card-title line-clamp-2 text-[15px] leading-snug sm:line-clamp-none sm:text-lg">
          {item.title}
        </h3>
        {isModule && (
          <p className="mt-1 hidden w-fit items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-[color:var(--accent-tint)] px-2.5 py-1.5 text-xs font-semibold leading-5 text-[color:var(--accent-ink)] sm:mt-2 sm:inline-flex">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
              aria-hidden="true"
            />
            {item.parentCourseTitle}
          </p>
        )}
        {!isModule && (
          <p className="card-description mt-1 hidden line-clamp-2 sm:mt-2 sm:block sm:max-w-4xl">
            {item.description}
          </p>
        )}
      </div>
      <ArrowIcon
        className="h-4 w-4 shrink-0 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5 sm:hidden"
        aria-hidden="true"
      />
      <DetailsAffordance className="hidden w-fit px-3 py-1.5 sm:inline-flex" />
    </button>
  );
}

export function PathCard({
  item,
  onOpen,
}: {
  item: Extract<LearningItem, { type: "PATH" }>;
  onOpen?: (item: LearningItem) => void;
}) {
  const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));
  const firstCourse = relatedCourses[0];
  // A path spans several courses; take the first course's colour as the card's
  // rail, and let each course chip below carry its own skill-area colour.
  const accent = firstCourse
    ? getCourseAccent(firstCourse.id, firstCourse.hueIndex)
    : getItemAccent(item);

  return (
    <button
      type="button"
      style={accentVars(accent)}
      onClick={() => onOpen?.(item)}
      aria-label={`${item.title}. Open detail view.`}
      className="editorial-card group relative block w-full cursor-pointer overflow-hidden p-3 pt-3.5 text-left transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 before:h-1 before:opacity-85 before:bg-[color:var(--accent)] hover:border-[color:var(--accent)] focus-ring sm:p-[1.125rem] sm:pt-5"
    >
      <div className="flex items-start justify-between gap-2">
        <TypeBadge type="PATH" />
        <span className="text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)] sm:hidden">
          {item.courseIds.length} courses
        </span>
      </div>
      <h3 className="card-title mt-2 line-clamp-2 text-[16px] leading-snug sm:mt-3.5 sm:line-clamp-none sm:text-[19px] sm:leading-tight">
        {item.title}
      </h3>
      <p className="card-description mt-1.5 hidden line-clamp-3 text-[14px] leading-relaxed sm:mt-2.5 sm:block">
        {item.description}
      </p>
      <div className="mt-2.5 hidden flex-wrap gap-1.5 sm:mt-4 sm:flex">
        {relatedCourses.slice(0, 3).map((course) => (
          <span
            key={course.id}
            style={accentVars(getCourseAccent(course.id, course.hueIndex))}
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--line)] bg-[color:var(--accent-tint)] px-2.5 py-1 text-xs font-medium text-[color:var(--accent-ink)]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
              aria-hidden="true"
            />
            {getCourseLabel(course)}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-[color:var(--line-soft)] pt-2.5 sm:mt-5 sm:pt-3.5">
        <span className="text-[12px] font-semibold leading-5 tabular-nums text-[color:var(--ink-soft)] sm:text-[13px]">
          {item.courseIds.length} courses, {item.totalDuration}
        </span>
        <DetailsAffordance className="hidden px-3 py-1.5 sm:inline-flex" />
        <ArrowIcon className="h-4 w-4 text-[color:var(--ink-soft)] sm:hidden" aria-hidden="true" />
      </div>
    </button>
  );
}
