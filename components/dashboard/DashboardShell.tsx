"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BookIcon, HomeIcon } from "@/components/icons";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { useLaceDevRole } from "@/lib/lace-dev-role";

type NavItem = {
  href: string;
  label: string;
  roles: ("learner" | "manager" | "program" | "super_admin")[];
  phase?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "My Learning", roles: ["learner", "manager", "program", "super_admin"] },
  { href: "/dashboard/team", label: "Team", roles: ["manager", "super_admin"], phase: "Phase 3" },
  { href: "/dashboard/program", label: "Program", roles: ["program", "super_admin"], phase: "Phase 3" },
  { href: "/dashboard/admin", label: "Admin", roles: ["super_admin"] },
];

export function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const { role } = useLaceDevRole();

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="lace-dashboard min-h-screen pb-28">
      <header className="sticky top-0 z-40 border-b border-[rgba(45,212,191,0.12)] bg-[rgba(10,22,40,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.25rem] max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/dashboard"
            className="flex min-w-fit flex-col leading-none focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-teal)] focus:ring-offset-2 focus:ring-offset-[var(--lace-dash-navy)]"
            aria-label="LACE Hub dashboard home"
          >
            <span className="text-xl font-semibold tracking-tight text-[var(--lace-dash-text)]">LACE</span>
            <span className="lace-dash-mono mt-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
              Learning Hub
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Dashboard">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`lace-dash-mono rounded-lg px-3 py-2 text-[0.7rem] font-medium uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-teal)] ${
                    active
                      ? "bg-[rgba(45,212,191,0.15)] text-[var(--lace-dash-teal)]"
                      : "text-[var(--lace-dash-muted)] hover:text-[var(--lace-dash-text)]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {item.phase ? (
                    <span className="ml-1.5 text-[0.58rem] text-[var(--lace-dash-cyan)] opacity-80">{item.phase}</span>
                  ) : null}
                </Link>
              );
            })}
            <Link
              href="/"
              className="lace-dash-mono ml-2 rounded-lg border border-[rgba(96,165,250,0.25)] px-3 py-2 text-[0.7rem] font-medium uppercase tracking-wider text-[var(--lace-dash-cyan)] transition hover:bg-[rgba(96,165,250,0.08)] focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-cyan)]"
            >
              Library
            </Link>
          </nav>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-[rgba(45,212,191,0.08)] px-4 py-2 md:hidden" aria-label="Dashboard mobile">
          {visibleNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`lace-dash-mono shrink-0 rounded-lg px-3 py-2 text-[0.65rem] font-medium uppercase tracking-wider ${
                  active ? "bg-[rgba(45,212,191,0.15)] text-[var(--lace-dash-teal)]" : "text-[var(--lace-dash-muted)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/" className="lace-dash-mono shrink-0 rounded-lg px-3 py-2 text-[0.65rem] text-[var(--lace-dash-cyan)]">
            Library
          </Link>
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl gap-0 px-4 py-6 sm:px-6 lg:gap-8">
        <aside className="hidden w-44 shrink-0 lg:block">
          <nav className="sticky top-24 flex flex-col gap-1" aria-label="Dashboard sections">
            {visibleNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--lace-dash-teal)] ${
                    active
                      ? "bg-[rgba(45,212,191,0.12)] text-[var(--lace-dash-teal)]"
                      : "text-[var(--lace-dash-muted)] hover:bg-[rgba(96,165,250,0.06)] hover:text-[var(--lace-dash-text)]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label === "My Learning" ? <BookIcon className="h-4 w-4" /> : null}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/"
              className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[var(--lace-dash-muted)] hover:text-[var(--lace-dash-cyan)]"
            >
              <HomeIcon className="h-4 w-4" />
              Discovery library
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {title ? (
            <p className="lace-dash-mono mb-4 text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)] sr-only">
              {title}
            </p>
          ) : null}
          {children}
        </main>
      </div>

      <RoleSwitcher />
    </div>
  );
}

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
    <header className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <p className="lace-dash-mono text-[0.65rem] font-medium uppercase tracking-wider text-[var(--lace-dash-teal)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--lace-dash-text)] sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[var(--lace-dash-muted)]">{subtitle}</p> : null}
        </div>
        {badge}
      </div>
    </header>
  );
}
