"use client";

import { useEffect } from "react";
import { ArrowIcon, BookIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseId, getCourseLabel, getCourseTheme } from "@/lib/course-theme";
import { courses, getLearningItemUrl, getModuleBrightspaceUrl, getPathBrightspaceUrl, modules, type LearningItem } from "@/lib/data";

function getAccentId(item: LearningItem) {
  if (item.type === "PATH") return item.courseIds[0];
  return getCourseId(item);
}

function getSummary(item: LearningItem) {
  if (item.type === "PATH") return item.description;
  return item.description;
}

function getDuration(item: LearningItem) {
  if (item.type === "PATH") return item.totalDuration.replace(" total", "");
  if (item.type === "MODULE") return "Approx. 25 min";
  return item.duration;
}

function getBrightspaceUrl(item: LearningItem) {
  if (item.type === "PATH") return getPathBrightspaceUrl(item);
  if (item.type === "MODULE") return getModuleBrightspaceUrl(item);
  return item.brightspaceUrl;
}

function getSyllabus(item: LearningItem) {
  if (item.type === "PATH") {
    return courses.filter((course) => item.courseIds.includes(course.id)).map((course) => ({
      id: course.id,
      label: getCourseLabel(course),
      title: course.title,
      description: course.description,
      duration: course.duration,
      themeId: course.id,
    }));
  }

  if (item.type === "COURSE") {
    return modules.filter((module) => module.courseId === item.id).map((module) => ({
      id: module.id,
      label: "Reading",
      title: module.title,
      description: module.description,
      duration: "25 min",
      themeId: module.courseId,
    }));
  }

  return [
    {
      id: item.id,
      label: item.parentCourseTitle,
      title: item.title,
      description: item.description,
      duration: "25 min",
      themeId: item.courseId,
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

  const theme = getCourseTheme(getAccentId(item));
  const syllabus = getSyllabus(item);
  const syllabusLabel = item.type === "PATH" ? `${syllabus.length} courses` : `${syllabus.length} modules`;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#1f1d19]/35 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="learning-detail-title">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="Close detail view" onClick={onClose} />
      <section className="editorial-panel relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#fffaf0] p-5 text-[#1f1d19] sm:p-8">
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--lace-hairline)] bg-[#fffdf7] text-xl leading-none text-[#62594b] transition hover:text-[#1f1d19] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
          type="button"
          onClick={onClose}
          aria-label="Close detail view"
        >
          x
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="pr-8">
            <TypeBadge type={item.type} />
            <h2 id="learning-detail-title" className="modal-title mt-5 max-w-2xl text-4xl text-[#181713] sm:text-5xl">
              {item.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--lace-muted-strong)]">{getSummary(item)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1f1d19] px-5 text-sm font-bold text-[#fffaf0] shadow-[0_14px_30px_rgba(31,29,25,0.18)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15"
                href={getBrightspaceUrl(item)}
                target="_blank"
                rel="noreferrer"
              >
                <BookIcon className="h-4 w-4" />
                Open in Brightspace
              </a>
              <button
                className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                  isSaved
                    ? "border-[#b88a2d]/45 bg-[#f5ead0] text-[#7d5919]"
                    : "border-[color:var(--lace-hairline)] bg-[#fffdf7] text-[#3a352d] hover:border-[#b88a2d]/45"
                }`}
                type="button"
                onClick={() => item && onToggleSaved?.(item)}
              >
                {isSaved ? "Saved to my list" : "Add to my list"}
              </button>
            </div>
          </div>

          <aside className="border-t border-[color:var(--lace-hairline)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-12">
            <dl className="grid gap-5 text-sm">
              <div>
                <dt className="editorial-eyebrow">Type</dt>
                <dd className="mt-1 font-bold text-[#25221d]">{item.type === "PATH" ? "Learning path" : item.type === "COURSE" ? "Course" : "Module"}</dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Duration</dt>
                <dd className="mt-1 font-bold text-[#25221d]">{getDuration(item)}</dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Level</dt>
                <dd className="mt-1 font-bold text-[#25221d]">{item.level}</dd>
              </div>
              <div>
                <dt className="editorial-eyebrow">Format</dt>
                <dd className="mt-1 font-bold text-[#25221d]">Self-paced reading</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-8 border-t border-[color:var(--lace-hairline)] pt-5">
          <div className="mb-3 flex items-center gap-2">
            <p className="editorial-eyebrow">Syllabus</p>
            <span className="metadata text-[#8f8676]">- {syllabusLabel}</span>
          </div>
          <div className="divide-y divide-[color:var(--lace-hairline)]">
            {syllabus.map((entry) => {
              const entryTheme = getCourseTheme(entry.themeId);
              return (
                <a
                  key={entry.id}
                  className={`group relative grid gap-3 py-4 pl-4 pr-2 transition hover:bg-[#fbf4e7] md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-start ${entryTheme.rail} before:absolute before:bottom-4 before:left-0 before:top-4 before:w-0.5`}
                  href={getLearningItemUrl(item)}
                  onClick={(event) => event.preventDefault()}
                >
                  <span className="metadata max-w-[8rem] break-words pt-1 leading-4 text-[#8d7b5f] md:max-w-[6.5rem]">
                    {entry.label}
                  </span>
                  <span className="min-w-0">
                    <span className="card-title block text-[1.02rem] leading-snug">{entry.title}</span>
                    <span className="mt-1 block max-w-2xl text-sm leading-6 text-[color:var(--lace-muted-strong)]">{entry.description}</span>
                  </span>
                  <span className="inline-flex items-center gap-3 justify-self-start whitespace-nowrap pt-1 text-sm font-semibold text-[color:var(--lace-muted-strong)] md:justify-self-end">
                    {entry.duration}
                    <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
