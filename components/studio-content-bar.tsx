"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/account-menu";
import { BinderSwitcher } from "@/components/binder-switcher";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";

/* Slim sticky header at the top of the page sheet. It carries the app's own
   navigation: Home, the binder switcher, My learning and Updates, plus search,
   the theme toggle and the account bubble. The divider tabs on the page's
   fore-edge are the open binder's sections, not app navigation.
   Height is `--studio-chrome` in globals.css.

   A phone gets only the hamburger, the wordmark and the account bubble here.
   Search, Updates and My learning each have a home in the bottom bar, and the
   top-right corner is the hardest place to reach one-handed on a tall phone. */
export function StudioContentBar({
  onMenu,
  onSearch,
}: {
  onMenu?: () => void;
  onSearch?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  return (
    <div className="sticky top-0 z-20 flex min-w-0 max-w-full items-center gap-3 border-b border-[color:var(--line)] bg-[color:var(--chrome-bg)] px-4 pb-2.5 pt-[calc(0.625rem+var(--safe-top))] sm:px-6 sm:pb-3 sm:pt-[calc(0.75rem+var(--safe-top))] lg:gap-6 lg:px-11 lg:py-3">
      {/* Mobile: menu + wordmark */}
      <button
        type="button"
        onClick={onMenu}
        className="touch-target flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <Link
        href="/"
        className="shrink-0 rounded-[6px] text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)] focus-ring"
      >
        Learning Hub
      </Link>

      <nav aria-label="Main" className="hidden min-w-0 lg:block">
        <ul className="flex items-center gap-1">
          <li>
            <HeaderLink href="/" current={pathname === "/"}>
              Home
            </HeaderLink>
          </li>
          <li className="px-1">
            <BinderSwitcher />
          </li>
          {isAdmin ? (
            <li>
              <HeaderLink href={getBrightspaceManagerUrl()} current={false}>
                Manager
              </HeaderLink>
            </li>
          ) : (
            <>
              <li>
                <HeaderLink href="/my-learning" current={pathname.startsWith("/my-learning")}>
                  My learning
                </HeaderLink>
              </li>
              <li>
                <HeaderLink href="/updates" current={pathname.startsWith("/updates")} unread>
                  Updates
                </HeaderLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onSearch}
        className="hidden h-11 shrink-0 items-center gap-2.5 rounded-[10px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 text-[14px] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-control)] hover:text-[color:var(--ink)] focus-ring lg:flex"
      >
        <SearchIcon className="h-4 w-4" />
        Search
        <kbd className="rounded-[5px] bg-[color:var(--surface-sunken)] px-1.5 py-0.5 font-sans text-[12px] text-[color:var(--ink-soft)]">
          Ctrl K
        </kbd>
      </button>

      <div className="hidden shrink-0 lg:block">
        <ThemeToggle collapsed />
      </div>

      <AccountMenu />
    </div>
  );
}

function HeaderLink({
  href,
  current,
  unread = false,
  children,
}: {
  href: string;
  current: boolean;
  /** The law-changed unread dot that leads to Updates. */
  unread?: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`relative flex h-11 items-center gap-1.5 rounded-[6px] px-3 text-[15px] transition focus-ring after:absolute after:inset-x-3 after:-bottom-3 after:h-[3px] ${
        current
          ? "font-bold text-[color:var(--ink)] after:bg-[color:var(--ink)]"
          : "font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
      }`}
    >
      {children}
      {unread ? (
        <>
          <span
            aria-hidden="true"
            className="h-[7px] w-[7px] rounded-full bg-[color:var(--status-changed)]"
          />
          <span className="sr-only">, new law changes</span>
        </>
      ) : null}
    </Link>
  );
}
