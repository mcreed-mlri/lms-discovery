"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { binders, comingBinders } from "@/lib/binder";
import { useOpenBinder } from "@/lib/hooks/use-open-binder";
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
 * "<Binder> ▾" beside the wordmark, naming the open binder. Opens the list of binders
 * (the three Legal Skills binders; substantive-law binders are named as coming)
 * and the whole-library routes that used to be their own tabs. An overlay, so it takes the focus trap
 * and scroll lock like the account menu.
 */
export function BinderSwitcher() {
  const pathname = usePathname();
  const { binder } = useOpenBinder();
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
        className={`flex h-11 items-center gap-2 rounded-[8px] px-2.5 text-[15px] text-[color:var(--ink)] transition hover:bg-[color:var(--hover-tint)] focus-ring ${
          current ? "font-bold" : "font-semibold"
        }`}
      >
        <span aria-hidden="true" className="binder-swatch" />
        {binder.name}
        <span className="sr-only">, switch binder</span>
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
          <ul>
            {binders.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={item.id === binder.id && current ? "page" : undefined}
                  className="flex min-h-11 items-start gap-2.5 rounded-[8px] px-2.5 py-2 text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                >
                  <span aria-hidden="true" data-binder={item.id} className="binder-swatch mt-1" />
                  <span>
                    <span
                      className={`block text-[15px] ${item.id === binder.id ? "font-extrabold" : "font-semibold"}`}
                    >
                      {item.name}
                    </span>
                    <span className="block text-[13px] leading-snug text-[color:var(--ink-muted)]">
                      {item.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="px-2.5 py-2 text-[14px] leading-snug text-[color:var(--ink-soft)]">
            Substantive law, coming: {comingBinders.join(", ")} and more.
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
