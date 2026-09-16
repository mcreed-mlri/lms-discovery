import Link from "next/link";
import { ArrowIcon, PathIcon } from "@/components/icons";
import { featuredLearningPath, featuredLearningPathUrl } from "@/lib/demo-discovery";

export function ExampleLearningPath() {
  return (
    <div
      className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-[color:var(--line)] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8"
      style={{ background: "color-mix(in srgb, var(--brand) 5%, var(--surface-raised))" }}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-semibold text-[color:var(--brand)]">
          <PathIcon className="h-4 w-4" aria-hidden="true" />
          Example learning path
        </p>
        <h2 className="section-title mt-3 text-xl text-[color:var(--ink)] sm:text-2xl">
          {featuredLearningPath.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--ink-muted)]">
          {featuredLearningPath.description}
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
