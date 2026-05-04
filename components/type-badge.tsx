import { BookIcon, FolderIcon, PathIcon } from "@/components/icons";
import type { LearningItem } from "@/lib/data";

const icons = {
  COURSE: BookIcon,
  MODULE: FolderIcon,
  PATH: PathIcon,
};

export function TypeBadge({ type }: { type: LearningItem["type"] }) {
  const Icon = icons[type];

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[0.68rem] font-black uppercase leading-none tracking-[0.08em] text-slate-600 ring-1 ring-slate-200">
      <Icon className="h-3 w-3 text-slate-500" />
      {type}
    </span>
  );
}
