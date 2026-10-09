import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowIcon, ClockIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import {
  courses,
  getLearningItemById,
  getLearningItemUrl,
  getModuleBrightspaceUrl,
  getModuleMinutes,
  getPathBrightspaceUrl,
  isPlanned,
  modules,
  paths,
  type LearningItem,
} from "@/lib/data";
import { getCourseLabel, getItemAccent, type Accent } from "@/lib/course-theme";

function accentVars(accent: Accent): CSSProperties {
  return {
    "--accent": accent.solid,
    "--accent-tint": accent.tint,
    "--accent-ink": accent.ink,
  } as CSSProperties;
}

type LearnPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getBrightspaceSourceUrl(item: LearningItem) {
  if (item.type === "PATH") return getPathBrightspaceUrl(item);
  if (item.type === "MODULE") return getModuleBrightspaceUrl(item);
  return item.brightspaceUrl;
}

function getDuration(item: LearningItem) {
  if (isPlanned(item)) return "Not set yet";
  if (item.type === "PATH") return item.totalDuration.replace(" total", "");
  if (item.type === "MODULE") return `${getModuleMinutes(item.id)} min`;
  return item.duration;
}

function getRelatedItems(item: LearningItem) {
  if (item.type === "PATH")
    return courses
      .filter((course) => item.courseIds.includes(course.id))
      .map((course) => ({ ...course, type: "COURSE" as const }));
  if (item.type === "COURSE")
    return modules
      .filter((module) => module.courseId === item.id)
      .map((module) => ({ ...module, type: "MODULE" as const }));
  return modules
    .filter((module) => module.courseId === item.courseId && module.id !== item.id)
    .map((module) => ({ ...module, type: "MODULE" as const }));
}

export function generateStaticParams() {
  return [...paths, ...courses, ...modules].map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getLearningItemById(slug);
  if (!item) return { title: "Learning item not found | Learning Hub" };

  return {
    title: `${item.title} | Learning Hub`,
    description: item.description,
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { slug } = await params;
  const item = getLearningItemById(slug);
  if (!item) notFound();

  const relatedItems = getRelatedItems(item);
  const sourceUrl = getBrightspaceSourceUrl(item);
  const accent = getItemAccent(item);
  const planned = isPlanned(item);
  const lessons = item.type === "MODULE" ? (item.lessons ?? []) : [];
  const relatedHeading =
    item.type === "PATH" ? "Courses" : item.type === "COURSE" ? "Modules" : "More in this course";

  return (
    <main className="hub-shell min-h-screen px-4 pb-[calc(1.25rem+var(--safe-bottom))] pt-[calc(1.25rem+var(--safe-top))] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/browse"
          className="metadata inline-flex items-center gap-1.5 text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus-ring"
        >
          <span aria-hidden="true">←</span> Back to library
        </Link>

        <section
          style={accentVars(accent)}
          className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] shadow-[var(--shadow-xs)]"
        >
          <div className="h-1.5 bg-[color:var(--accent)]" />
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_16rem] lg:p-9">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={item.type} />
                {planned ? (
                  <span className="metadata rounded-[6px] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2.5 py-1 text-[color:var(--ink-soft)]">
                    Planned, not built yet
                  </span>
                ) : null}
              </div>
              <h1 className="hero-title mt-4 max-w-3xl text-3xl leading-tight text-[color:var(--ink)] sm:text-5xl">
                {item.title}
              </h1>
              <p className="readable-copy mt-4 max-w-3xl text-base leading-7 sm:text-lg">
                {item.description}
              </p>
              {planned ? (
                <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[color:var(--ink-muted)]">
                  This is part of the curriculum plan. There is nothing to open in Brightspace yet.
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                {planned ? (
                  <Link
                    href="/curriculum-map"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] transition hover:opacity-90 focus-ring"
                  >
                    See it on the curriculum map
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={sourceUrl}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] transition hover:opacity-90 focus-ring"
                  >
                    Open in Brightspace
                    <ArrowIcon className="h-4 w-4" />
                  </a>
                )}
                {!planned && relatedItems[0] ? (
                  <Link
                    href={getLearningItemUrl(relatedItems[0])}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface)] px-5 text-sm font-bold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
                  >
                    {item.type === "MODULE" ? "Next module" : `Start with ${relatedItems[0].title}`}
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>

            <aside className="grid gap-4 border-t border-[color:var(--line)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <p className="section-kicker secondary">Duration</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold text-[color:var(--ink)]">
                  <ClockIcon className="h-4 w-4 text-[color:var(--brand)]" />
                  {getDuration(item)}
                </p>
              </div>
              <div>
                <p className="section-kicker secondary">Level</p>
                <p className="mt-1 text-sm font-bold text-[color:var(--ink)]">{item.level}</p>
              </div>
              <div>
                <p className="section-kicker secondary">Status</p>
                <p className="mt-1 text-sm font-bold text-[color:var(--ink)]">
                  {planned ? "Planned" : "Available in Brightspace"}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <div
          className={`mt-6 grid gap-6 ${lessons.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_18rem]" : ""}`}
        >
          {lessons.length > 0 ? (
            <section className="editorial-card p-5 sm:p-7">
              <h2 className="section-title text-xl text-[color:var(--ink)]">
                Lessons in this module
              </h2>
              <ol className="mt-4 grid gap-2">
                {lessons.map((lesson, index) => (
                  <li
                    key={`${item.id}-lesson-${index}`}
                    className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2.5"
                  >
                    <span className="w-5 shrink-0 text-right text-[13px] font-semibold tabular-nums text-[color:var(--ink-soft)]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-[color:var(--ink)]">{lesson}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <aside className="editorial-card p-5">
            <h2 className="section-title text-[17px] text-[color:var(--ink)]">{relatedHeading}</h2>
            <div className="mt-4 grid gap-2">
              {relatedItems.length > 0 ? (
                relatedItems.map((related) => {
                  return (
                    <Link
                      key={related.id}
                      href={getLearningItemUrl(related)}
                      style={accentVars(getItemAccent(related))}
                      className="group relative block overflow-hidden rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3 pl-4 transition before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[color:var(--accent)] hover:border-[color:var(--line-strong)] hover:bg-[color:var(--hover-tint)]"
                    >
                      <span className="metadata text-[color:var(--ink-soft)]">
                        {related.type === "COURSE"
                          ? getCourseLabel(related)
                          : isPlanned(related)
                            ? "Planned"
                            : `${getModuleMinutes(related.id)} min`}
                      </span>
                      <span className="card-title mt-1 block text-sm leading-snug">
                        {related.title}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                  No related items yet.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
