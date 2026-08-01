import { ArrowIcon } from "@/components/icons";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { getModuleMinutes, type ContentUpdate } from "@/lib/data";

export function UpdateCard({
  update,
  lead,
  onOpen,
}: {
  update: ContentUpdate;
  lead?: boolean;
  onOpen: (moduleId: string) => void;
}) {
  const status = getStatusTheme(resolveStatusKey(update.tag));
  const isHigh = update.severity === "high";

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-[color:var(--surface-raised)] ${
        lead ? "surface-featured border-[color:var(--line-strong)]" : "border-[color:var(--line)]"
      } ${isHigh ? `before:absolute before:inset-y-0 before:left-0 before:w-0.5 ${status.rail}` : ""} ${
        lead ? "p-5 sm:p-6" : "p-4"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`metadata inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${status.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
          {update.tag}
        </span>
        <span className="metadata text-[color:var(--ink-soft)]">{update.when}</span>
      </div>
      <h3
        className={`section-title mt-3 text-[color:var(--ink)] ${lead ? "text-xl leading-snug" : "text-base leading-snug"}`}
      >
        {update.title}
      </h3>
      <p
        className={`mt-2 leading-relaxed text-[color:var(--ink-muted)] ${lead ? "text-sm" : "text-sm"}`}
      >
        {update.summary}
      </p>
      <button
        type="button"
        onClick={() => onOpen(update.moduleId)}
        className={`mt-4 inline-flex items-center gap-2 self-start rounded-[var(--radius-control)] text-sm font-bold transition focus-ring ${
          lead
            ? "h-10 bg-[color:var(--ink)] px-4 text-[color:var(--surface-raised)] hover:opacity-90"
            : "px-0 text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
        }`}
      >
        {lead ? `Open updated module, ${getModuleMinutes(update.moduleId)} min` : "View change"}
        <ArrowIcon className="h-4 w-4" />
      </button>
    </article>
  );
}
