import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowIcon, BookIcon, CheckIcon, ClockIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import {
  courses,
  getLearningItemById,
  getLearningItemUrl,
  getModuleBrightspaceUrl,
  getModuleMinutes,
  getPathBrightspaceUrl,
  modules,
  paths,
  type LearningItem,
} from "@/lib/data";
import { getCourseLabel, getCourseTheme } from "@/lib/course-theme";

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
  if (item.type === "PATH") return item.totalDuration.replace(" total", "");
  if (item.type === "MODULE") return `${getModuleMinutes(item.id)} min`;
  return item.duration;
}

function getRelatedItems(item: LearningItem) {
  if (item.type === "PATH") return courses.filter((course) => item.courseIds.includes(course.id)).map((course) => ({ ...course, type: "COURSE" as const }));
  if (item.type === "COURSE") return modules.filter((module) => module.courseId === item.id).map((module) => ({ ...module, type: "MODULE" as const }));
  return modules.filter((module) => module.courseId === item.courseId && module.id !== item.id).map((module) => ({ ...module, type: "MODULE" as const }));
}

function getLessonSections(item: LearningItem) {
  if (item.type === "PATH") {
    return [
      {
        title: "Start with the first course",
        body: "This path is now represented as a Learning Hub route. As Brightspace sync comes online, this page can become the learner-facing path overview while Brightspace remains the source for enrollments and completion.",
      },
      {
        title: "Follow the sequence",
        body: "Each course below gets its own hub URL, so mobile learners can move through the curriculum without bouncing into Safari for every step.",
      },
    ];
  }

  if (item.type === "COURSE") {
    return [
      {
        title: "Course overview",
        body: item.description,
      },
      {
        title: "What happens next",
        body: "The modules below are the canonical Learning Hub destinations for this course. The Brightspace source link stays available as a fallback while the content sync matures.",
      },
    ];
  }

  return [
    {
      title: "Read",
      body: item.description,
    },
    {
      title: "Practice",
      body: "Use this space for the short, mobile-first practice activity that belongs with the Brightspace topic. In the full integration, this block can render synced HTML, checks, or locally authored interactive content.",
    },
    {
      title: "Complete",
      body: "Completion can be written back to the learning record once the Brightspace progress integration is connected.",
    },
  ];
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
  const theme = item.type === "PATH" ? getCourseTheme(relatedItems[0]?.id ?? "") : getCourseTheme(item.type === "MODULE" ? item.courseId : item.id);
  const sections = getLessonSections(item);

  return (
    <main className="hub-shell min-h-screen px-4 py-[calc(1.25rem+env(safe-area-inset-top,0px))] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="metadata inline-flex items-center gap-1.5 text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)]">
          <span aria-hidden="true">←</span> Back to library
        </Link>

        <section className={`mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] shadow-[var(--shadow-xs)] ${theme.rail}`}>
          <div className="h-1.5" />
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_16rem] lg:p-9">
            <div>
              <TypeBadge type={item.type} />
              <h1 className="hero-title mt-4 max-w-3xl text-3xl leading-tight text-[color:var(--ink)] sm:text-5xl">
                {item.title}
              </h1>
              <p className="readable-copy mt-4 max-w-3xl text-base leading-7 sm:text-lg">{item.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {relatedItems[0] ? (
                  <Link
                    href={getLearningItemUrl(relatedItems[0])}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                  >
                    {item.type === "MODULE" ? "Next related module" : "Start in Learning Hub"}
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                ) : null}
                <a
                  href={sourceUrl}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface)] px-5 text-sm font-bold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                >
                  Open source in Brightspace
                  <ArrowIcon className="h-4 w-4" />
                </a>
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
                <p className="section-kicker secondary">Source</p>
                <p className="mt-1 text-sm font-bold text-[color:var(--ink)]">Brightspace synced</p>
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="editorial-card p-5 sm:p-7">
            <p className="section-kicker primary">Learning Hub lesson</p>
            <div className="mt-5 grid gap-5">
              {sections.map((section, index) => (
                <article key={section.title} className="border-t border-[color:var(--line)] pt-5 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand-tint)] text-[color:var(--brand)]">
                      {index === sections.length - 1 ? <CheckIcon className="h-4 w-4" /> : <BookIcon className="h-4 w-4" />}
                    </span>
                    <h2 className="section-title text-xl text-[color:var(--ink)]">{section.title}</h2>
                  </div>
                  <p className="readable-copy mt-3 leading-7">{section.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="editorial-card p-5">
            <p className="section-kicker secondary">{item.type === "PATH" ? "Courses" : item.type === "COURSE" ? "Modules" : "More in this course"}</p>
            <div className="mt-4 grid gap-2">
              {relatedItems.length > 0 ? (
                relatedItems.map((related) => {
                  const relatedTheme = getCourseTheme(related.type === "MODULE" ? related.courseId : related.id);
                  return (
                    <Link
                      key={related.id}
                      href={getLearningItemUrl(related)}
                      className={`group relative block rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3 transition hover:border-[color:var(--line-strong)] hover:bg-[color:var(--hover-tint)] ${relatedTheme.rail}`}
                    >
                      <span className="metadata text-[color:var(--ink-soft)]">
                        {related.type === "COURSE" ? getCourseLabel(related) : `${getModuleMinutes(related.id)} min`}
                      </span>
                      <span className="card-title mt-1 block text-sm leading-snug">{related.title}</span>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm font-medium text-[color:var(--ink-muted)]">No related items yet.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
