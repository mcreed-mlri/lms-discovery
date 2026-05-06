import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseTheme } from "@/lib/course-theme";
import { continueLearning, modules } from "@/lib/data";
import type { MouseEvent } from "react";

type ContinueItem = (typeof continueLearning)[number];

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

function getThemeId(item: ContinueItem) {
  if (item.type === "COURSE") return item.id;
  if (item.type === "MODULE") return modules.find((entry) => entry.id === item.id)?.courseId;
  return undefined;
}

export function ContinueCard({ item, priority = "standard" }: { item: ContinueItem; priority?: "primary" | "standard" }) {
  const themeId = getThemeId(item);
  const courseTheme = themeId ? getCourseTheme(themeId) : null;
  const isPrimary = priority === "primary";

  return (
    <a
      href={comingSoonHref}
      onClick={preventPlaceholderNavigation}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`group relative block cursor-pointer overflow-hidden rounded-xl border bg-white transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 hover:-translate-y-0.5 hover:shadow-lift focus:outline-none focus:ring-4 focus:ring-sky-100 ${
        isPrimary ? "p-4 pt-5 shadow-soft before:h-1.5 md:col-span-2" : "p-4 pt-5 shadow-sm before:h-1"
      } ${
        courseTheme ? `${courseTheme.border} ${courseTheme.hoverBorder} ${courseTheme.rail}` : "border-slate-200 before:bg-slate-200 hover:border-sky-200"
      }`}
    >
      <ComingSoonTooltip />
      <div className="flex items-center justify-between gap-3">
        <TypeBadge type={item.type} />
        <span className={`${isPrimary ? "h-9 border-slate-200 px-3 text-slate-600" : "h-8 w-8 border-sky-100 text-slate-400"} flex items-center justify-center gap-1.5 rounded-full border bg-white text-xs font-semibold shadow-sm transition duration-200 ease-out group-hover:border-sky-200 group-hover:text-mlri-blue`}>
          {isPrimary && "Resume"}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
      {isPrimary && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Resume course</p>
      )}
      <h3 className={`${isPrimary ? "mt-1 text-xl" : "mt-4 min-h-10 text-lg"} font-bold leading-snug text-slate-800`}>{item.title}</h3>
      <div className={isPrimary ? "mt-4" : "mt-4"}>
        {item.type === "MODULE" ? (
          <div className={`rounded-lg border px-3 py-2.5 ${courseTheme?.chip}`}>
            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-current opacity-90">{item.detail}</p>
            <p className="mt-0.5 text-base font-bold text-slate-800">{item.status}</p>
          </div>
        ) : (
          <>
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{item.detail}</span>
              <span>{item.progress}%</span>
            </div>
            <div className={`${isPrimary ? "h-2" : "h-2"} overflow-hidden rounded-full bg-slate-200/80 ring-1 ring-slate-200`}>
              <div className={`h-full rounded-full ${courseTheme?.progress ?? "bg-mlri-blue"}`} style={{ width: `${item.progress}%` }} />
            </div>
          </>
        )}
      </div>
    </a>
  );
}
