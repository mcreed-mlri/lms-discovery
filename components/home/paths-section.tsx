"use client";

import { SectionHead } from "@/components/home/section-head";
import { PathIcon } from "@/components/icons";
import { getHue } from "@/lib/skill-hue";
import type { LearningItem } from "@/lib/data";

// Guided-path card with a hue top-accent bar.
function StudioPathCard({
  path,
  index,
}: {
  path: Extract<LearningItem, { type: "PATH" }>;
  index: number;
}) {
  const hue = getHue(index + 2);
  return (
    <div className="overflow-hidden rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)] transition hover:shadow-[var(--shadow-card)] sm:rounded-[14px]">
      <div className="h-1 sm:h-1.5" style={{ background: hue.solid }} />
      <div className="p-3.5 sm:p-5">
        <div className="mb-2 flex items-center gap-1.5 sm:mb-3">
          <span style={{ color: hue.ink }}>
            <PathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-[color:var(--ink-soft)] sm:text-[11px]">
            Guided path
          </span>
        </div>
        <h3 className="text-[15px] font-bold leading-snug tracking-[-0.01em] text-[color:var(--ink)] sm:mb-3.5 sm:text-[17px]">
          {path.title}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-[color:var(--ink-muted)] sm:gap-x-4 sm:text-[13px]">
          <span>
            {path.courseIds.length} course{path.courseIds.length === 1 ? "" : "s"}
          </span>
          <span>{path.totalDuration.replace(" total", "")}</span>
          <span className="hidden sm:inline">{path.level}</span>
        </div>
      </div>
    </div>
  );
}

// GUIDED PATHS — deprioritized on mobile so the library sits higher.
export function PathsSection({ paths }: { paths: Extract<LearningItem, { type: "PATH" }>[] }) {
  return (
    <section className="order-3 mx-auto max-w-[1120px] px-4 pb-4 pt-2 sm:px-6 sm:pb-2 lg:order-2 lg:px-10">
      <SectionHead kicker="Guided learning" title="Follow a clear path" />
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {paths.map((p, i) => (
          <StudioPathCard key={p.id} path={p} index={i} />
        ))}
      </div>
    </section>
  );
}
