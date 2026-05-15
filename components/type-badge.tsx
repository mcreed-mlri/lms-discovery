import { BookIcon, FolderIcon, PathIcon } from "@/components/icons";
import type { LearningItem } from "@/lib/data";

const icons = {
  COURSE: BookIcon,
  MODULE: FolderIcon,
  PATH: PathIcon,
};

export function TypeBadge({ type }: { type: LearningItem["type"] }) {
  const Icon = icons[type];
  const label = type === "PATH" ? "Path" : type === "COURSE" ? "Course" : "Module";

  return (
    <span className="metadata inline-flex w-fit items-center gap-1.5 rounded-md border border-[color:var(--lace-hairline)] bg-[#fbf6ea] px-2.5 py-1 leading-none text-[#6f6658]">
      <Icon className="h-3 w-3 text-[#9d7a35]" />
      {label}
    </span>
  );
}
