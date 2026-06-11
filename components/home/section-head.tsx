import Link from "next/link";

import { ArrowIcon } from "@/components/icons";

// Section header — mono kicker, title, optional action link (Studio style).
export function SectionHead({
  kicker,
  title,
  actionHref,
  actionLabel,
}: {
  kicker: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 sm:mb-[18px]">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--ink-soft)] sm:text-[11px]">
          {kicker}
        </p>
        <h2 className="section-title mt-1 text-[1.2rem] text-[color:var(--ink)] sm:mt-2 sm:text-[1.5rem]">
          {title}
        </h2>
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[color:var(--brand)]"
        >
          {actionLabel}
          <ArrowIcon className="h-[15px] w-[15px]" />
        </Link>
      )}
    </div>
  );
}
