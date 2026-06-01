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
    <header className="mb-8 border-b border-[color:var(--border-subtle)] pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="section-kicker primary">{eyebrow}</p> : null}
          <h1 className="hero-title mt-2 text-[2.1rem] text-[color:var(--ink)] sm:text-[2.65rem]">{title}</h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base font-semibold text-[color:var(--lace-muted-strong)]">{subtitle}</p>
          ) : null}
        </div>
        {badge}
      </div>
    </header>
  );
}
