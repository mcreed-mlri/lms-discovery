import type { LearningItem } from "@/lib/data";

const styles: Record<LearningItem["type"], string> = {
  COURSE: "bg-blue-100 text-blue-800 ring-blue-300",
  MODULE: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  PATH: "bg-violet-100 text-violet-800 ring-violet-300",
};

export function TypeBadge({ type }: { type: LearningItem["type"] }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-md px-3 py-1.5 text-[0.72rem] font-black uppercase leading-none tracking-[0.08em] ring-1 ${styles[type]}`}>
      {type}
    </span>
  );
}
