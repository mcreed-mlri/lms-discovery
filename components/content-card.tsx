import { ArrowIcon } from "@/components/icons";
import { getItemAccent, type Accent } from "@/lib/course-theme";
import { getModuleMinutes, isPlanned, type LearningItem } from "@/lib/data";
import type { CSSProperties } from "react";

function accentVars(accent: Accent): CSSProperties {
  return {
    "--accent": accent.solid,
    "--accent-tint": accent.tint,
    "--accent-ink": accent.ink,
  } as CSSProperties;
}

function typeLabel(type: LearningItem["type"]) {
  if (type === "PATH") return "Path";
  if (type === "COURSE") return "Course";
  return "Module";
}

// Planned items have no real duration yet, so they say "Planned" instead of
// inventing one.
function getMeta(item: LearningItem) {
  if (item.type === "PATH") {
    const courses = `${item.courseIds.length} courses`;
    return isPlanned(item) ? `${courses} · Planned` : `${courses}, ${item.totalDuration}`;
  }
  if (isPlanned(item)) return "Planned";
  if (item.type === "MODULE") return `${getModuleMinutes(item.id)} min`;
  return `${item.practiceArea}, ${item.duration}`;
}

function CardFooter({ item }: { item: LearningItem }) {
  const status = item.type === "MODULE" ? item.contentStatus : undefined;
  return (
    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
      <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-[color:var(--ink-soft)]">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]"
          aria-hidden="true"
        />
        <span className="truncate">
          {typeLabel(item.type)} · {getMeta(item)}
          {status ? ` · ${status}` : ""}
        </span>
      </span>
      <ArrowIcon className="h-4 w-4 shrink-0 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5" />
    </div>
  );
}

// The accent rail (DESIGN.md) carries the topic colour; type lives in the footer text.
const tileClass =
  "interactive-tile group relative flex h-full cursor-pointer flex-col overflow-hidden p-4 pt-5 text-left focus-ring before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[color:var(--accent)] before:opacity-[0.85] hover:border-[color:var(--accent)] sm:min-h-[11rem] sm:p-5 sm:pt-6";

export function ContentCard({
  item,
  onOpen,
  variant = "standard",
}: {
  item: LearningItem;
  onOpen?: (item: LearningItem) => void;
  variant?: "standard" | "featured";
}) {
  const isFeatured = variant === "featured" && item.type === "COURSE";
  const accent = getItemAccent(item);

  return (
    <button
      type="button"
      style={accentVars(accent)}
      onClick={() => onOpen?.(item)}
      aria-label={`${item.title}. Open detail view.`}
      className={`${tileClass} ${isFeatured ? "sm:col-span-2" : ""}`}
    >
      {isFeatured ? (
        <p className="mb-2 text-[12px] font-bold text-[color:var(--brand-ink)]">Recommended next</p>
      ) : null}
      <h3 className="section-title text-[16px] leading-snug text-[color:var(--ink)] sm:text-[17px]">
        {item.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[color:var(--ink-muted)] sm:text-[14px]">
        {item.description}
      </p>
      <CardFooter item={item} />
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
  const accent = getItemAccent(item);

  return (
    <button
      type="button"
      style={accentVars(accent)}
      onClick={() => onOpen?.(item)}
      aria-label={`${item.title}. Open detail view.`}
      className="interactive-tile group relative flex w-full cursor-pointer items-start gap-3 overflow-hidden p-4 pl-5 text-left focus-ring before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-[color:var(--accent)] hover:border-[color:var(--accent)] sm:items-center sm:gap-4 sm:px-5 sm:pl-6"
    >
      <div className="min-w-0 flex-1">
        <h3 className="section-title line-clamp-2 text-[15px] leading-snug text-[color:var(--ink)] sm:line-clamp-none sm:text-[16px]">
          {item.title}
        </h3>
        <p className="mt-1 hidden line-clamp-1 text-[13px] leading-snug text-[color:var(--ink-muted)] sm:block">
          {item.description}
        </p>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--ink-soft)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" aria-hidden="true" />
          {typeLabel(item.type)} · {getMeta(item)}
        </p>
      </div>
      <ArrowIcon className="mt-1.5 h-4 w-4 shrink-0 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5 sm:mt-0" />
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
  return <ContentCard item={item} onOpen={onOpen} />;
}
