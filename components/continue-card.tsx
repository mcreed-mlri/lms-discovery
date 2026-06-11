import { ArrowIcon } from "@/components/icons";
import { TypeBadge } from "@/components/type-badge";
import { getCourseTheme, getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
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
    <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[color:var(--ink-soft)] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
      {comingSoonLabel}
    </span>
  );
}

function getThemeId(item: ContinueItem) {
  if (item.type === "COURSE") return item.id;
  if (item.type === "MODULE") return modules.find((entry) => entry.id === item.id)?.courseId;
  return undefined;
}

export function ContinueCard({
  item,
  priority = "standard",
}: {
  item: ContinueItem;
  priority?: "primary" | "standard";
}) {
  const themeId = getThemeId(item);
  const courseTheme = themeId ? getCourseTheme(themeId) : getCourseTheme("");
  const isPrimary = priority === "primary";

  return (
    <a
      href={comingSoonHref}
      onClick={preventPlaceholderNavigation}
      title={comingSoonLabel}
      aria-label={`${item.title}. ${comingSoonLabel}.`}
      className={`editorial-card group relative block cursor-pointer overflow-hidden transition duration-200 ease-out before:absolute before:inset-x-0 before:top-0 focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 ${courseTheme.hoverBorder} ${courseTheme.rail} ${
        isPrimary ? "p-4 pt-5 before:h-1 md:col-span-2" : "p-4 pt-5 before:h-0.5"
      }`}
    >
      <ComingSoonTooltip />
      <div className="flex items-center justify-between gap-3">
        <TypeBadge type={item.type} />
        <span
          className={`flex items-center justify-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-xs font-semibold text-[color:var(--ink-muted)] transition duration-200 ease-out group-hover:border-[color:var(--line-strong)] group-hover:text-[color:var(--ink)] ${
            isPrimary ? "h-9 px-3" : "h-8 w-8"
          }`}
        >
          {isPrimary && "Resume"}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
      {isPrimary && <p className="metadata mt-3 text-[color:var(--ink-soft)]">Resume course</p>}
      <h3
        className={`card-title ${isPrimary ? "mt-1 text-xl" : "mt-4 min-h-10 text-lg"} leading-snug`}
      >
        {item.title}
      </h3>
      <div className="mt-4">
        {item.type === "MODULE" ? (
          (() => {
            const status = getStatusTheme(resolveStatusKey(item.status));
            return (
              <div className={`rounded-lg border px-3 py-2.5 ${status.pill}`}>
                <p className="metadata text-[0.62rem] leading-none text-current opacity-80">
                  {item.detail}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-base font-bold text-current">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                  {item.status}
                </p>
              </div>
            );
          })()
        ) : (
          <>
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[color:var(--ink-muted)]">
              <span>{item.detail}</span>
              <span>{item.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-sunken)]">
              <div
                className={`h-full rounded-full ${courseTheme.progress}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </>
        )}
      </div>
    </a>
  );
}
