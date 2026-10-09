import Link from "next/link";
import { ArrowIcon, PathIcon } from "@/components/icons";
import { featuredLearningPath, featuredLearningPathUrl } from "@/lib/demo-discovery";

export function ExampleLearningPath() {
  return (
    <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 shadow-[var(--shadow-xs)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div className="min-w-0">
        <h2 className="section-title flex items-center gap-2 text-[22px] text-[color:var(--ink)]">
          <PathIcon className="h-5 w-5 shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
          {featuredLearningPath.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--ink-muted)]">
          An example path. {featuredLearningPath.description}
        </p>
      </div>
      <Link
        href={featuredLearningPathUrl}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-[var(--radius-control)] bg-[color:var(--solid-bg)] px-5 py-3 text-sm font-bold text-[color:var(--solid-ink)] focus-ring hover:opacity-90 sm:self-center"
      >
        Explore the path
        <ArrowIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
