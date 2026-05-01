import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { courses, getModuleBrightspaceUrl, getPathBrightspaceUrl, type LearningItem } from "@/lib/data";

function getHref(item: LearningItem) {
  if (item.type === "PATH") return getPathBrightspaceUrl(item);
  if (item.type === "MODULE") return getModuleBrightspaceUrl(item);
  return item.brightspaceUrl;
}

function getMeta(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses - ${item.totalDuration}`;
  if (item.type === "MODULE") return `Inside: ${item.parentCourseTitle}`;
  return `${item.practiceArea} - ${item.duration}`;
}

function getLevelLabel(item: LearningItem) {
  return item.level;
}

export function ContentCard({ item }: { item: LearningItem }) {
  const isModule = item.type === "MODULE";

  return (
    <a
      href={getHref(item)}
      className="group flex h-full min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <TypeBadge type={item.type} />
        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
          {getLevelLabel(item)}
        </span>
      </div>
      <h3 className="text-xl font-extrabold leading-snug text-slate-950">{item.title}</h3>
      {isModule && (
        <p className="mt-2 text-sm font-extrabold uppercase tracking-wide text-mlri-blue">
          Inside: {item.parentCourseTitle}
        </p>
      )}
      <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-700">{item.description}</p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <span className="text-base font-bold text-slate-700">{isModule ? item.practiceArea : getMeta(item)}</span>
        <span className="inline-flex h-9 items-center gap-2 rounded-full bg-mlri-mist px-4 text-sm font-extrabold text-mlri-blue transition group-hover:bg-mlri-blue group-hover:text-white">
          Open <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export function ContentListRow({ item }: { item: LearningItem }) {
  const isModule = item.type === "MODULE";

  return (
    <a
      href={getHref(item)}
      className="group grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-sky-100 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
    >
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
            {getLevelLabel(item)}
          </span>
          <span className="text-base font-bold text-slate-700">{getMeta(item)}</span>
        </div>
        <h3 className="text-xl font-extrabold leading-snug text-slate-950">{item.title}</h3>
        {isModule && (
          <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-mlri-blue">
            Inside: {item.parentCourseTitle}
          </p>
        )}
        <p className="mt-2 max-w-4xl text-base leading-7 text-slate-700">{item.description}</p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-mlri-mist px-4 py-2 text-base font-extrabold text-mlri-blue transition group-hover:bg-mlri-blue group-hover:text-white">
        Open <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </a>
  );
}

export function PathCard({ item }: { item: Extract<LearningItem, { type: "PATH" }> }) {
  const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));

  return (
    <a
      href={getPathBrightspaceUrl(item)}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100"
    >
      <div className="flex items-start justify-between gap-4">
        <TypeBadge type="PATH" />
        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
          {item.level}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-extrabold leading-tight text-slate-950">{item.title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-700">{item.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {relatedCourses.slice(0, 3).map((course) => (
          <span key={course.id} className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">
            {course.practiceArea}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-base font-bold text-slate-700">
          {item.courseIds.length} courses - {item.totalDuration}
        </span>
        <span className="inline-flex items-center gap-2 text-base font-extrabold text-mlri-blue">
          Open <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}
