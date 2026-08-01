"use client";

import Link from "next/link";
import { BellIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

/* Slim sticky header inside the content column. On desktop it carries the
   "what is this product" eyebrow + a notifications bell; on mobile it also
   holds the hamburger that opens the rail drawer, search, and the LACE wordmark. */
export function StudioContentBar({
  onMenu,
  onSearch,
}: {
  onMenu?: () => void;
  onSearch?: () => void;
}) {
  return (
    <div className="sticky top-0 z-20 flex min-w-0 max-w-full items-center gap-3 border-b border-[color:var(--line)] bg-[color:var(--chrome-bg)] px-4 pb-2.5 pt-[calc(0.625rem+env(safe-area-inset-top,0px))] backdrop-blur-[10px] sm:px-6 sm:pb-3 sm:pt-[calc(0.75rem+env(safe-area-inset-top,0px))] lg:px-10 lg:py-4">
      {/* Mobile: menu + wordmark */}
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <span className="font-mono text-[17px] font-bold tracking-[-0.02em] text-[color:var(--ink)] lg:hidden">
        LACE
      </span>

      {/* Desktop eyebrow */}
      <p className="hidden font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)] lg:block">
        Mass. legal aid · continuing education
      </p>

      <div className="flex-1" />

      {onSearch ? (
        <button
          type="button"
          onClick={onSearch}
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring lg:hidden"
          aria-label="Search learning library"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </button>
      ) : null}

      <ThemeToggle collapsed />

      <Link
        href="/updates"
        className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
        aria-label="Updates and notifications"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        <span className="absolute right-[9px] top-[8px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[color:var(--status-changed)]" />
      </Link>
    </div>
  );
}
