"use client";

import { BellIcon, MenuIcon } from "@/components/icons";

/* Slim sticky header inside the content column. On desktop it carries the
   "what is this product" eyebrow + a notifications bell; on mobile it also
   holds the hamburger that opens the rail drawer and the LACE wordmark. */
export function StudioContentBar({ onMenu }: { onMenu?: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-[color:var(--line)] bg-[rgba(255,255,255,0.85)] px-4 py-2.5 backdrop-blur-[10px] sm:px-6 sm:py-3 lg:px-10 lg:py-4">
      {/* Mobile: menu + wordmark */}
      <button
        type="button"
        onClick={onMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] lg:hidden"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <span className="font-mono text-[1.1rem] font-bold tracking-[-0.02em] text-[color:var(--ink)] lg:hidden">
        LACE
      </span>

      {/* Desktop eyebrow */}
      <p className="hidden font-mono text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)] lg:block">
        Mass. legal aid · continuing education
      </p>

      <div className="flex-1" />

      <button
        type="button"
        className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15"
        aria-label="Notifications"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        <span className="absolute right-[9px] top-[8px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[#c8493b]" />
      </button>
    </div>
  );
}
