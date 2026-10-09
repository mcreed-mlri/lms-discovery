"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BellIcon,
  BookIcon,
  ChevronDownIcon,
  CloseIcon,
  GridIcon,
  HomeIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { binders, comingBinders, locateInBinder } from "@/lib/binder";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { useOpenBinder } from "@/lib/hooks/use-open-binder";

const rowClass =
  "flex min-h-11 items-center gap-3 rounded-[9px] px-3 text-[15px] transition hover:bg-[color:var(--surface-sunken)] focus-ring";

function rowState(current: boolean) {
  return current
    ? "font-bold text-[color:var(--ink)] bg-[color:var(--surface-sunken)]"
    : "font-medium text-[color:var(--ink-muted)]";
}

/**
 * The phone navigation drawer, opened from the header's menu button. It mirrors
 * the desktop header in the same order: the app's own sections, then the
 * binders with their dividers, then the whole-library routes. StudioShell owns
 * the dialog, its focus trap and scroll lock; this is the panel inside it.
 */
export function SiteDrawer({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";
  const { binder: openBinder } = useOpenBinder();
  const located = locateInBinder(pathname);

  return (
    <div className="studio-rail flex h-full max-h-[100dvh] w-[288px] flex-col overflow-y-auto overflow-x-hidden overscroll-contain border-r border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-4">
      <div className="mb-3 flex items-center justify-between px-1.5">
        <span className="text-[19px] font-extrabold tracking-[-0.02em] text-[color:var(--ink)]">
          Learning Hub
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="touch-target flex h-9 w-9 items-center justify-center rounded-[9px] border border-[color:var(--line)] text-[color:var(--ink-muted)] focus-ring"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Site" className="flex flex-col gap-0.5">
        <Link
          href="/"
          onClick={onClose}
          aria-current={pathname === "/" ? "page" : undefined}
          className={`${rowClass} ${rowState(pathname === "/")}`}
        >
          <HomeIcon className="h-[19px] w-[19px] shrink-0" />
          Home
        </Link>
        {isAdmin ? (
          <Link
            href={getBrightspaceManagerUrl()}
            onClick={onClose}
            className={`${rowClass} ${rowState(false)}`}
          >
            <GridIcon className="h-[19px] w-[19px] shrink-0" />
            Manager
          </Link>
        ) : (
          <>
            <Link
              href="/my-learning"
              onClick={onClose}
              aria-current={pathname.startsWith("/my-learning") ? "page" : undefined}
              className={`${rowClass} ${rowState(pathname.startsWith("/my-learning"))}`}
            >
              <BookIcon className="h-[19px] w-[19px] shrink-0" />
              My learning
            </Link>
            <Link
              href="/updates"
              onClick={onClose}
              aria-current={pathname.startsWith("/updates") ? "page" : undefined}
              className={`${rowClass} ${rowState(pathname.startsWith("/updates"))}`}
            >
              <span className="relative flex shrink-0">
                <BellIcon className="h-[19px] w-[19px]" />
                <span
                  aria-hidden="true"
                  className="absolute -right-[3px] -top-[2px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[color:var(--status-changed)]"
                />
              </span>
              Updates
              <span className="sr-only">, new law changes</span>
            </Link>
          </>
        )}
      </nav>

      <nav aria-label="Binders" className="mt-6">
        <h2 className="px-3 pb-1.5 text-[13px] font-semibold text-[color:var(--ink-soft)]">
          Binders
        </h2>
        {binders.map((binder) => (
          <details key={binder.id} open={binder.id === openBinder.id} className="group">
            <summary
              className={`${rowClass} cursor-pointer list-none font-bold text-[color:var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden`}
            >
              <span aria-hidden="true" data-binder={binder.id} className="binder-swatch" />
              <span className="flex-1">{binder.name}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-[color:var(--ink-soft)] transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mb-2 ml-[29px] flex flex-col border-l border-[color:var(--line)] pl-2">
              {binder.tabs.map((tab) => {
                const current = located?.binder.id === binder.id && located.tabId === tab.id;
                return (
                  <li key={tab.id}>
                    <Link
                      href={tab.href}
                      onClick={onClose}
                      aria-current={current ? "page" : undefined}
                      className={`${rowClass} min-h-10 text-[14px] ${rowState(current)}`}
                    >
                      {tab.id === "contents" ? "Contents" : tab.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
        <p className="px-3 pt-1 text-[13px] leading-snug text-[color:var(--ink-soft)]">
          Substantive law, coming: {comingBinders.join(", ")} and more.
        </p>
      </nav>

      <nav aria-label="Library" className="mt-6 flex flex-col gap-0.5">
        <Link href="/browse" onClick={onClose} className={`${rowClass} ${rowState(false)}`}>
          Browse the whole library
        </Link>
        <Link href="/browse/paths" onClick={onClose} className={`${rowClass} ${rowState(false)}`}>
          Learning paths
        </Link>
        <Link href="/curriculum-map" onClick={onClose} className={`${rowClass} ${rowState(false)}`}>
          Curriculum map
        </Link>
      </nav>

      <div className="mt-auto border-t border-[color:var(--line-soft)] pt-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
