import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The top of every skill-path page: a breadcrumb, the title, an optional
 * "Step 2 of 3" marker, an intro, and the binder's colour rule.
 */
export function SkillPageHeader({
  crumbs,
  title,
  marker,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  marker?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b-4 border-[color:var(--binder)] pb-6">
      <nav aria-label="Breadcrumb" className="text-sm font-semibold text-[color:var(--ink-muted)]">
        {crumbs.map((crumb, index) => (
          <span key={crumb.label}>
            {index > 0 ? " › " : null}
            {crumb.href ? (
              <Link href={crumb.href} className="underline-offset-[3px] hover:underline focus-ring">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[color:var(--ink)]">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-[clamp(2rem,4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-[color:var(--ink)]">
          {title}
        </h1>
        {marker ? (
          <p className="text-[14px] font-bold text-[color:var(--ink-muted)]">{marker}</p>
        ) : null}
      </div>
      {children ? (
        <div className="mt-2 max-w-[64ch] text-[16px] leading-relaxed text-[color:var(--ink-muted)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}
