import type { ReactNode } from "react";

export function SectionBand({
  id,
  label,
  helper,
  children,
  className = "",
  tabIndex,
  showIntro = true,
}: {
  id?: string;
  label: string;
  helper: string;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  /** Browse supplies its own page heading, so the band label is redundant there. */
  showIntro?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))] ${className}`}
      aria-labelledby={id && showIntro ? `${id}-heading` : undefined}
      aria-label={!showIntro ? label : undefined}
      tabIndex={tabIndex}
    >
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        {showIntro ? (
          <div className="section-intro mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h2
              id={id ? `${id}-heading` : undefined}
              className="section-label shrink-0 text-[color:var(--ink)]"
            >
              {label}
            </h2>
            <p className="max-w-xl text-[13px] leading-6 text-[color:var(--ink-muted)] sm:text-right">
              {helper}
            </p>
          </div>
        ) : null}
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
