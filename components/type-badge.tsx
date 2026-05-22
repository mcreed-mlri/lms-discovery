import { BookIcon, FolderIcon, PathIcon } from "@/components/icons";
import type { LearningItem } from "@/lib/data";

const icons = {
  COURSE: BookIcon,
  MODULE: FolderIcon,
  PATH: PathIcon,
};

// Format label (Path / Course / Module). Deliberately neutral — it describes
// the *shape* of the content, not its topic or status, so it never competes
// with the topic and status colours on the same card.
export function TypeBadge({ type }: { type: LearningItem["type"] }) {
  const Icon = icons[type];
  const label = type === "PATH" ? "Path" : type === "COURSE" ? "Course" : "Module";

  return (
    <span className="metadata inline-flex w-fit items-center gap-1.5 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2.5 py-1 leading-none text-[color:var(--ink-soft)]">
      <Icon className="h-3 w-3 text-[color:var(--ink-soft)]" />
      {label}
    </span>
  );
}
