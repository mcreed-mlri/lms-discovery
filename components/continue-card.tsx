import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { continueLearning, courses, modules, paths, getModuleBrightspaceUrl, getPathBrightspaceUrl } from "@/lib/data";

type ContinueItem = (typeof continueLearning)[number];

function getHref(item: ContinueItem) {
  if (item.type === "COURSE") return courses.find((course) => course.id === item.id)?.brightspaceUrl ?? "#";
  if (item.type === "MODULE") {
    const module = modules.find((entry) => entry.id === item.id);
    return module ? getModuleBrightspaceUrl(module) : "#";
  }
  const path = paths.find((entry) => entry.id === item.id);
  return path ? getPathBrightspaceUrl(path) : "#";
}

export function ContinueCard({ item }: { item: ContinueItem }) {
  return (
    <a
      href={getHref(item)}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-sky-100"
    >
      <div className="flex items-center justify-between gap-3">
        <TypeBadge type={item.type} />
        <ArrowIcon className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-mlri-blue" />
      </div>
      <h3 className="mt-5 min-h-12 text-xl font-extrabold leading-snug text-slate-950">{item.title}</h3>
      <div className="mt-5">
        {item.type === "MODULE" ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">{item.detail}</p>
            <p className="mt-1 text-lg font-extrabold text-slate-950">{item.status}</p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
              <span>{item.detail}</span>
              <span>{item.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-mlri-blue" style={{ width: `${item.progress}%` }} />
            </div>
          </>
        )}
      </div>
    </a>
  );
}
