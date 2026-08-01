"use client";

import { useEffect, type CSSProperties } from "react";
import { ArrowIcon, BookIcon, CloseIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { getCourseAccent, getCourseLabel, getItemAccent, type Accent } from "@/lib/course-theme";
import {
  courses,
  getLearningItemUrl,
  getModuleMinutes,
  modules,
  type LearningItem,
} from "@/lib/data";

function accentVars(accent: Accent): CSSProperties {
  return {
    "--accent": accent.solid,
    "--accent-tint": accent.tint,
    "--accent-ink": accent.ink,
  } as CSSProperties;
}

type SyllabusEntry = {
  id: string;
  label: string;
  title: string;
  description: string;
  duration: string;
  accent: Accent;
  href?: string;
};

function getSummary(item: LearningItem) {
  if (item.type === "PATH") return item.description;
  return item.description;
}

function getDuration(item: LearningItem) {
  if (item.type === "PATH") return item.totalDuration.replace(" total", "");
  if (item.type === "MODULE") return "Approx. 25 min";
  return item.duration;
}

function getSyllabus(item: LearningItem): SyllabusEntry[] {
  if (item.type === "PATH") {
    return courses
      .filter((course) => item.courseIds.includes(course.id))
      .map((course) => ({
        id: course.id,
        label: getCourseLabel(course),
        title: course.title,
        description: course.description,
        duration: course.duration,
        accent: getCourseAccent(course.id, course.hueIndex),
        href: getLearningItemUrl({ ...course, type: "COURSE" as const }),
      }));
  }

  if (item.type === "COURSE") {
    return modules
      .filter((module) => module.courseId === item.id)
      .map((module) => ({
        id: module.id,
        label: "Module",
        title: module.title,
        description: module.description,
        duration: `${getModuleMinutes(module.id)} min`,
        accent: getItemAccent({ ...module, type: "MODULE" as const }),
        href: getLearningItemUrl({ ...module, type: "MODULE" as const }),
      }));
  }

  // MODULE — its lessons ("micro-modules"); these aren't separate pages.
  const accent = getItemAccent(item);
  if (item.lessons && item.lessons.length > 0) {
    return item.lessons.map((lesson, index) => ({
      id: `${item.id}-lesson-${index}`,
      label: `Lesson ${index + 1}`,
      title: lesson,
      description: "",
      duration: "",
      accent,
    }));
  }

  return [
    {
      id: item.id,
      label: item.parentCourseTitle,
      title: item.title,
      description: item.description,
      duration: `${getModuleMinutes(item.id)} min`,
      accent,
      href: getLearningItemUrl(item),
    },
  ];
}

export function DetailModal({
  item,
  onClose,
  isSaved = false,
  onToggleSaved,
}: {
  item: LearningItem | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSaved?: (item: LearningItem) => void;
}) {
  const dialogRef = useFocusTrap<HTMLDivElement>(Boolean(item));

  useEffect(() => {
    if (!item) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const syllabus = getSyllabus(item);
  const syllabusLabel =
    item.type === "PATH"
      ? `${syllabus.length} courses`
      : item.type === "COURSE"
        ? `${syllabus.length} modules`
        : item.lessons && item.lessons.length > 0
          ? `${syllabus.length} lessons`
          : "Overview";

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[color:var(--ink)]/35 backdrop-blur-sm sm:items-start sm:py-10 sm:overflow-y-auto sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learning-detail-title"
    >
      <button
        className="absolute inset-0 cursor-default"
        type="button"
        aria-label="Close detail view"
        data-focus-skip="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <section className="editorial-panel animate-slide-up sm:animate-fade-in-scale relative w-full max-w-4xl bg-[color:var(--surface-raised)] p-5 text-[color:var(--ink)] sm:p-8 rounded-t-2xl rounded-b-none sm:rounded-b-2xl sm:rounded-2xl max-sm:max-h-[88vh] max-sm:overflow-y-auto pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {/* Pull handle for mobile drawer */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[color:var(--line-strong)] sm:hidden" />
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] leading-none text-[color:var(--ink-muted)] transition hover:text-[color:var(--ink)] focus-ring max-sm:top-3"
          type="button"
          onClick={onClose}
          aria-label="Close detail view"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="pr-8">
            <TypeBadge type={item.type} />
            <h2
              id="learning-detail-title"
              className="modal-title mt-5 max-w-2xl text-4xl text-[color:var(--ink)] sm:text-5xl"
            >
              {item.title}
            </h2>
            <p className="readable-copy mt-5 max-w-2xl text-[16px] leading-7">{getSummary(item)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
                href={getLearningItemUrl(item)}
              >
                <BookIcon className="h-4 w-4" />
                Open in Learning Hub
              </a>
              <button
                className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold transition focus-ring ${
                  isSaved
                    ? "border-[color:var(--line-strong)] bg-[color:var(--surface-sunken)] text-[color:var(--ink)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)]"
                }`}
                type="button"
                onClick={() => item && onToggleSaved?.(item)}
              >
                {isSaved ? "Saved to my list" : "Add to my list"}
              </button>
            </div>
          </div>

          <aside className="border-t border-[color:var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-12">
            <dl className="grid gap-5 text-sm">
              <div>
                <dt className="editorial-eyebrow">Type</dt>
                <dd className="mt-1 font-bold text-[color:var(--ink)]">
                  {item.type === "PATH"
                    ? "Learning path"
                    : item.type === "COURSE"
                      ? "Course"
                      : "Module"}
                </dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Duration</dt>
                <dd className="mt-1 font-bold text-[color:var(--ink)]">{getDuration(item)}</dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Level</dt>
                <dd className="mt-1 font-bold text-[color:var(--ink)]">{item.level}</dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Format</dt>
                <dd className="mt-1 font-bold text-[color:var(--ink)]">Self-paced reading</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-8 border-t border-[color:var(--line)] pt-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="editorial-eyebrow">Syllabus</p>
            <span className="metadata text-[color:var(--ink-soft)]">- {syllabusLabel}</span>
          </div>
          <div className="divide-y divide-[color:var(--line)]">
            {syllabus.map((entry) => {
              const rowClass = `group relative grid gap-3 py-4 pl-4 pr-2 transition md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-start before:absolute before:bottom-4 before:left-0 before:top-4 before:w-0.5 before:bg-[color:var(--accent)] ${
                entry.href ? "hover:bg-[color:var(--surface-sunken)]" : ""
              }`;
              const inner = (
                <>
                  <span className="metadata max-w-[8rem] break-words pt-1 leading-4 text-[color:var(--accent-ink)] md:max-w-[6.5rem]">
                    {entry.label}
                  </span>
                  <span className="min-w-0">
                    <span className="card-title block text-[16px] leading-snug">{entry.title}</span>
                    {entry.description && (
                      <span className="readable-copy mt-1 block max-w-2xl text-[15px] leading-6">
                        {entry.description}
                      </span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-3 justify-self-start whitespace-nowrap pt-1 text-sm font-semibold text-[color:var(--ink-muted)] md:justify-self-end">
                    {entry.duration}
                    {entry.href && (
                      <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    )}
                  </span>
                </>
              );
              return entry.href ? (
                <a
                  key={entry.id}
                  style={accentVars(entry.accent)}
                  className={rowClass}
                  href={entry.href}
                >
                  {inner}
                </a>
              ) : (
                <div key={entry.id} style={accentVars(entry.accent)} className={rowClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
