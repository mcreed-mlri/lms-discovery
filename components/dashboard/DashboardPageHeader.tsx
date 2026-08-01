import type { ReactNode } from "react";

export function DashboardPageHeader({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}) {
  return (
    <header className="mb-8 border-b border-[color:var(--line)] pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="section-kicker primary">{eyebrow}</p> : null}
          <h1 className="hero-title mt-2 text-[34px] text-[color:var(--ink)] sm:text-[42px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base font-semibold text-[color:var(--ink-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {badge}
      </div>
    </header>
  );
}
