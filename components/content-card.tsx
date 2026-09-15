import { ArrowIcon, BookIcon, FolderIcon, PathIcon } from "@/components/icons";
import { getItemAccent, type Accent } from "@/lib/course-theme";
import { getModuleMinutes, type LearningItem } from "@/lib/data";
import type { CSSProperties } from "react";

function accentVars(accent: Accent): CSSProperties {
  return {
    "--accent": accent.solid,
    "--accent-tint": accent.tint,
    "--accent-ink": accent.ink,
  } as CSSProperties;
}

const typeIcons = {
  COURSE: BookIcon,
  MODULE: FolderIcon,
  PATH: PathIcon,
};

function typeLabel(type: LearningItem["type"]) {
  if (type === "PATH") return "Path";
  if (type === "COURSE") return "Course";
  return "Module";
}

function getMeta(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses, ${item.totalDuration}`;
  if (item.type === "MODULE") return `${getModuleMinutes(item.id)} min`;
  return `${item.practiceArea}, ${item.duration}`;
}

function TypeWell({ type }: { type: LearningItem["type"] }) {
  const Icon = typeIcons[type];
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--accent-tint)] text-[color:var(--accent-ink)] sm:h-11 sm:w-11">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </span>
  );
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

const tileClass =
  "interactive-tile group relative flex h-full cursor-pointer flex-col p-4 text-left focus-ring sm:min-h-[13.5rem] sm:p-5";

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
      <TypeWell type={item.type} />
      <h3 className="section-title mt-3 text-[16px] leading-snug text-[color:var(--ink)] sm:text-[17px]">
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
      className="interactive-tile group flex w-full cursor-pointer items-start gap-3 p-4 text-left focus-ring sm:items-center sm:gap-4 sm:px-5"
    >
      <TypeWell type={item.type} />
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
