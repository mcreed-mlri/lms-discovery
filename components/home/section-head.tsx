import Link from "next/link";

import { ArrowIcon } from "@/components/icons";

// Section header: title plus an optional action link (Studio style).
export function SectionHead({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 sm:mb-[18px]">
      <h2 className="section-title text-[19px] text-[color:var(--ink)] sm:text-[22px]">{title}</h2>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[color:var(--brand)] focus-ring"
        >
          {actionLabel}
          <ArrowIcon className="h-[15px] w-[15px]" />
        </Link>
      )}
    </div>
  );
}
