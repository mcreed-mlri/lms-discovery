import type { LearningItem } from "@/lib/data";

const styles: Record<LearningItem["type"], string> = {
  COURSE: "bg-blue-50 text-blue-700 ring-blue-200",
  MODULE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PATH: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

export function TypeBadge({ type }: { type: LearningItem["type"] }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-extrabold ring-1 ${styles[type]}`}>
      {type}
    </span>
  );
}
