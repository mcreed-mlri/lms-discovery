import Link from "next/link";

const footerLinks = [
  { label: "Library", href: "/#browse" },
  { label: "My Learning", href: "/my-learning" },
  { label: "Updates", href: "/updates" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-12 border-t border-[color:var(--line)] bg-[color:var(--paper)]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="section-kicker secondary">LACE Learning Hub</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
              Focused training for Massachusetts legal aid advocates.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link rounded-md text-[color:var(--ink-muted)] transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-[color:var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="metadata text-[color:var(--ink-soft)]">
            &copy; {year} Massachusetts Law Reform Institute
          </p>
          <p className="metadata text-[color:var(--ink-soft)]">Demo environment - for training purposes only</p>
        </div>
      </div>
    </footer>
  );
}
