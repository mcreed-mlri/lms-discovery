"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { AccountMenu } from "@/components/account-menu";
import { activeBinderTone } from "@/components/binder-tabs";
import { BellIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

/* Slim sticky header at the top of the page sheet. On desktop it carries the
   wordmark, notifications, the theme toggle and the account bubble; on a
   phone it narrows to the hamburger, the wordmark and the account bubble.
   Height is `--studio-chrome` in globals.css.

   What a phone does NOT get here is deliberate. Search, notifications and the
   theme toggle all had a second home already — the first two in the bottom
   nav, the third at the foot of the rail the hamburger opens — so five
   controls were competing for the width of a 375px header to reach things
   that were one thumb-length away at the bottom of the screen. The top-right
   corner is the hardest place to reach one-handed on a tall phone, and it was
   carrying the duplicates. The unread dot moved to the bottom nav's Updates
   item with the bell, since that is now where a phone user meets it. */
export function StudioContentBar({ onMenu }: { onMenu?: () => void }) {
  // On desktop the open section's tab colour runs along the sheet's header rule,
  // the one place it reaches into the page.
  const section = { "--section": `var(--tab-${activeBinderTone(usePathname())})` } as CSSProperties;
  return (
    <div
      style={section}
      className="sticky top-0 z-20 flex min-w-0 max-w-full items-center gap-3 border-b border-[color:var(--line)] lg:border-b-[3px] lg:border-b-[color:var(--section)] bg-[color:var(--chrome-bg)] px-4 pb-2.5 pt-[calc(0.625rem+var(--safe-top))] sm:px-6 lg:rounded-tr-[14px] lg:rounded-tl-[6px] sm:pb-3 sm:pt-[calc(0.75rem+var(--safe-top))] lg:px-10 lg:py-4"
    >
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
        className="rounded-[6px] text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)] focus-ring"
      >
        Learning Hub
      </Link>

      <div className="flex-1" />

      <div className="hidden shrink-0 lg:block">
        <ThemeToggle collapsed />
      </div>

      <Link
        href="/updates"
        className="touch-target relative hidden h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring lg:flex"
        aria-label="Updates and notifications"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        <span
          aria-hidden="true"
          className="absolute right-[9px] top-[8px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[color:var(--status-changed)]"
        />
      </Link>

      <AccountMenu />
    </div>
  );
}
