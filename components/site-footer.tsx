import Link from "next/link";

const footerLinks = [
  { label: "Library", href: "/#browse" },
  { label: "My Learning", href: "/my-learning" },
  { label: "Updates", href: "/updates" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-8 border-t border-[color:var(--line)] bg-[color:var(--paper)] sm:mt-10">
      <div className="mx-auto max-w-[1120px] px-4 py-4 sm:px-6 sm:py-3 lg:px-10">
        <p className="text-center text-[11px] leading-relaxed text-[color:var(--ink-soft)] sm:hidden">
          &copy; {year} MLRI · Demo environment
        </p>

        <div className="hidden items-center justify-between gap-6 sm:flex">
          <p className="min-w-0 text-[12px] leading-snug text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink-muted)]">LACE Learning Hub</span>
            <span className="mx-1.5 text-[color:var(--ink-soft)]/40" aria-hidden="true">
              ·
            </span>
            &copy; {year} MLRI · Demo environment
          </p>

          <nav aria-label="Footer" className="flex shrink-0 items-center gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold text-[color:var(--ink-muted)] transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
