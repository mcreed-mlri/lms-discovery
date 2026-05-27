"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BellIcon, BookIcon, FlameIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { isLibraryNavActive, libraryNavItems, type LibraryFilter } from "@/lib/library-nav";
import { useAuth } from "@/lib/auth";

const learnerStreak = 12;

function sidebarLinkClass(active: boolean) {
  return `group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
    active
      ? "nav-link-active"
      : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--ink)]"
  }`;
}

export function LibraryShell({
  children,
  onNavFilter,
}: {
  children: ReactNode;
  onNavFilter?: (filter: LibraryFilter) => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div className="hub-shell flex min-h-screen flex-col pb-24 md:pb-0">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--bg-surface-soft)] text-[color:var(--ink)] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-[3.25rem] max-w-7xl items-center gap-4 px-4 py-2 sm:min-h-[4.75rem] sm:px-6 sm:py-3 lg:px-8">
          <Link
            href="/"
            className="flex min-w-fit items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
            aria-label="MLRI Learning Hub home"
          >
            <span className="leading-none">
              <span className="block text-[1.45rem] font-normal tracking-[-0.055em] sm:text-[1.85rem]">LACE</span>
              <span className="editorial-eyebrow mt-0.5 hidden text-[color:var(--ink-soft)] sm:mt-1 sm:block">Learning Hub</span>
            </span>
          </Link>

          <nav className="site-nav ml-auto hidden items-center gap-5 text-[color:var(--ink-muted)] md:flex" aria-label="Account">
            <span
              className="nav-utility inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2.5 py-1 text-[color:var(--ink-muted)]"
              title={`${learnerStreak}-day learning streak`}
            >
              <FlameIcon className="h-3.5 w-3.5 text-[color:var(--brand)]" aria-hidden="true" />
              {learnerStreak}-day streak
            </span>
            <button
              className="relative text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
              type="button"
              aria-label="Notifications"
            >
              <BellIcon className="h-[1.15rem] w-[1.15rem]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[color:var(--status-changed)]" />
            </button>
            <div className="flex items-center gap-3 border-l border-[color:var(--line)] pl-5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--ink)] text-xs font-bold text-[color:var(--surface)]"
                aria-hidden="true"
              >
                {user.initials}
              </div>
              <span className="sr-only">{user.name}</span>
              <button
                onClick={logout}
                className="nav-utility text-[color:var(--ink-soft)] transition hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
                aria-label={`Sign out ${user.firstName}`}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[3.25rem] z-30 hidden w-44 border-r border-[color:var(--line)] bg-[color:var(--bg-surface-soft)] sm:top-[4.75rem] lg:block">
        <nav className="flex h-full flex-col gap-2 px-3 py-5" aria-label="Primary">
          {libraryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isLibraryNavActive(item, pathname);
            const className = sidebarLinkClass(active);

            if (item.href.startsWith("/") && !item.href.includes("#")) {
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className={className}
                onClick={() => item.filter && onNavFilter?.(item.filter)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
          <div className="mt-auto border-t border-[color:var(--line)] pt-4">
            <p className="text-sm font-bold text-[color:var(--ink)]">{user.name}</p>
            <p className="text-xs font-semibold text-[color:var(--ink-soft)]">{user.title}</p>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-44">
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--line)] bg-[color:var(--bg-surface-soft)] px-5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
              pathname === "/" ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
            }`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <HomeIcon className="h-5 w-5" />
            Home
          </Link>
          <Link
            href="/#browse"
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[color:var(--ink-soft)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
          >
            <SearchIcon className="h-5 w-5" />
            Browse
          </Link>
          <Link
            href="/my-learning"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
              pathname.startsWith("/my-learning") ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
            }`}
          >
            <BookIcon className="h-5 w-5" />
            Learning
          </Link>
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--ink-soft)] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
            aria-label={`Sign out ${user.firstName}`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--ink)] text-[10px] font-bold text-[color:var(--surface)]">
              {user.initials}
            </div>
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}
