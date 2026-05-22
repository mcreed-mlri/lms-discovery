"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BookIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { useAuth } from "@/lib/auth";
import { useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

type RoleNavItem = {
  href: string;
  label: string;
  roles: LaceRole[];
  phase?: string;
};

const roleNavItems: RoleNavItem[] = [
  { href: "/my-learning/team", label: "Team", roles: ["manager", "super_admin"], phase: "3" },
  { href: "/my-learning/program", label: "Program", roles: ["program", "super_admin"], phase: "3" },
  { href: "/my-learning/admin", label: "Admin", roles: ["super_admin"] },
];

function navLinkClass(active: boolean) {
  return `group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
    active
      ? "nav-link-active"
      : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--ink)]"
  }`;
}

export function HubShell({
  children,
  showRoleSwitcher = true,
}: {
  children: ReactNode;
  showRoleSwitcher?: boolean;
}) {
  const { user, ready, logout } = useAuth();
  const { role } = useLaceDevRole();
  const pathname = usePathname();
  const router = useRouter();

  const visibleRoleNav = roleNavItems.filter((item) => item.roles.includes(role));
  const isMyLearning =
    pathname === "/my-learning" || pathname.startsWith("/my-learning/");

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[#1f1d19]">Loading</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-shell min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/92 text-[color:var(--ink)] shadow-[0_8px_26px_rgba(40,32,20,0.055)] backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-fit items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
            aria-label="LACE Learning Hub home"
          >
            <span className="leading-none">
              <span className="block text-[1.85rem] font-normal tracking-[-0.055em]">LACE</span>
              <span className="nav-label mt-1 block text-[#786f62]">Learning Hub</span>
            </span>
          </Link>

          <nav className="nav-label ml-auto hidden items-center gap-5 text-[#3a352d] md:flex" aria-label="Account">
            <Link
              className={`rounded-md transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                !isMyLearning ? "hover:text-[#9d7a35]" : "text-[#706a5f] hover:text-[#9d7a35]"
              }`}
              href="/"
            >
              Library
            </Link>
            <Link
              className={`rounded-md transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                isMyLearning ? "text-[#9d7a35]" : "hover:text-[#9d7a35]"
              }`}
              href="/my-learning"
              aria-current={isMyLearning ? "page" : undefined}
            >
              My Learning
            </Link>
            {visibleRoleNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md transition focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
                    active ? "text-[#9d7a35]" : "text-[#706a5f] hover:text-[#9d7a35]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 border-l border-[color:var(--lace-hairline)] pl-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d19] text-xs font-bold text-[#fffaf0]">
                {user.initials}
              </div>
              <button
                onClick={logout}
                className="text-[#706a5f] transition hover:text-[#1f1d19] focus:outline-none"
                aria-label={`Sign out ${user.firstName}`}
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-[4.75rem] z-30 hidden w-44 border-r border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-soft)]/88 shadow-[16px_0_34px_rgba(40,32,20,0.035)] backdrop-blur lg:block">
        <nav className="flex h-full flex-col gap-2 px-3 py-5" aria-label="Primary">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/#browse" className={navLinkClass(false)}>
            <SearchIcon className="h-5 w-5" />
            <span>Browse</span>
          </Link>
          <Link
            href="/my-learning"
            className={navLinkClass(pathname === "/my-learning")}
            aria-current={pathname === "/my-learning" ? "page" : undefined}
          >
            <BookIcon className="h-5 w-5" />
            <span>My Learning</span>
          </Link>
          {visibleRoleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(pathname === item.href)}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <span>
                {item.label}
                {item.phase ? (
                  <span className="ml-1 text-[10px] font-bold uppercase text-[#9d7a35]">· P{item.phase}</span>
                ) : null}
              </span>
            </Link>
          ))}
          <div className="mt-auto border-t border-[color:var(--lace-hairline)] pt-4">
            <p className="text-sm font-bold text-[#25221d]">{user.name}</p>
            <p className="text-xs font-semibold text-[#81786a]">{user.title}</p>
          </div>
        </nav>
      </aside>

      <main className="lg:pl-44">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--lace-hairline)] bg-[color:var(--bg-surface-soft)]/95 px-5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-md)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
              pathname === "/" ? "text-[#9d7a35]" : "text-[#706a5f]"
            }`}
          >
            <HomeIcon className="h-5 w-5" />
            Home
          </Link>
          <Link
            href="/#browse"
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold text-[#706a5f] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
          >
            <SearchIcon className="h-5 w-5" />
            Browse
          </Link>
          <Link
            href="/my-learning"
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15 ${
              isMyLearning ? "text-[#9d7a35]" : "text-[#706a5f]"
            }`}
            aria-current={isMyLearning ? "page" : undefined}
          >
            <BookIcon className="h-5 w-5" />
            Learning
          </Link>
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 rounded-xl py-2 text-sm font-semibold text-[#81786a] focus:outline-none focus:ring-4 focus:ring-[#b88a2d]/15"
            aria-label={`Sign out ${user.firstName}`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f1d19] text-[10px] font-bold text-[#fffaf0]">
              {user.initials}
            </div>
            Sign out
          </button>
        </div>
      </nav>

      {showRoleSwitcher ? <RoleSwitcher /> : null}
    </div>
  );
}
