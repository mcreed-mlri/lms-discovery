"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { comingBinders, legalSkillsBinder } from "@/lib/binder";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";

/** Routes that belong to the binder or its library, for the header's current state. */
export function isBinderRoute(pathname: string) {
  return (
    pathname.startsWith("/binder") ||
    pathname.startsWith("/browse") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/curriculum-map")
  );
}

/**
 * "Legal Skills binder ▾" in the header. Opens the list of binders (only Legal
 * Skills has content; the rest are named as coming) and the whole-library
 * routes that used to be their own tabs. An overlay, so it takes the focus trap
 * and scroll lock like the account menu.
 */
export function BinderSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const headingId = useId();
  const rootRef = useFocusTrap<HTMLDivElement>(open);
  useScrollLock(open);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    function onPointerDown(event: PointerEvent) {
      if (root && !root.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef]);

  const current = isBinderRoute(pathname);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className={`flex h-11 items-center gap-2 rounded-[10px] border-[1.5px] bg-[color:var(--surface)] px-3 text-[15px] text-[color:var(--ink)] transition focus-ring ${
          current
            ? "border-[color:var(--ink)] font-bold"
            : "border-[color:var(--line-strong)] font-semibold hover:border-[color:var(--line-control)]"
        }`}
      >
        <span aria-hidden="true" className="binder-swatch" />
        {legalSkillsBinder.name} binder
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-72 rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          <h2
            id={headingId}
            className="px-2.5 pb-1 pt-2 text-[13px] font-semibold text-[color:var(--ink-soft)]"
          >
            Binders
          </h2>
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2.5 rounded-[8px] px-2.5 text-[15px] font-bold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
          >
            <span aria-hidden="true" className="binder-swatch" />
            {legalSkillsBinder.name}
          </Link>
          <p className="px-2.5 py-2 text-[14px] leading-snug text-[color:var(--ink-soft)]">
            Coming: {comingBinders.join(", ")} and more substantive-law binders.
          </p>
          <div className="my-1 border-t border-[color:var(--line)]" />
          <Link
            href="/browse"
            className="flex min-h-11 items-center rounded-[8px] px-2.5 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
          >
            Browse the whole library
          </Link>
          <Link
            href="/browse/paths"
            className="flex min-h-11 items-center rounded-[8px] px-2.5 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
          >
            Learning paths
          </Link>
          <Link
            href="/curriculum-map"
            className="flex min-h-11 items-center rounded-[8px] px-2.5 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
          >
            Curriculum map
          </Link>
        </div>
      ) : null}
    </div>
  );
}
