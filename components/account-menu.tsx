"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";

export function AccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const nameId = useId();
  const rootRef = useFocusTrap<HTMLDivElement>(open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;

    function onPointerDown(event: PointerEvent) {
      if (root && !root.contains(event.target as Node)) {
        setOpen(false);
      }
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

  if (!user) return null;

  function handleLogout() {
    setOpen(false);
    logout();
    router.push("/login");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((current) => !current)}
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-[12px] font-[650] text-[color:var(--brand-on)] transition hover:opacity-90 focus-ring"
      >
        {user.initials}
      </button>
      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-labelledby={nameId}
          aria-modal="true"
          className="absolute right-0 top-[calc(100%+8px)] z-30 w-64 overflow-hidden rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-[12px] font-[650] text-[color:var(--brand-on)]">
              {user.initials}
            </span>
            <div className="min-w-0 leading-tight">
              <p id={nameId} className="truncate text-[13px] font-semibold text-[color:var(--ink)]">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-[color:var(--ink-soft)]">{user.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-0.5 flex w-full items-center rounded-[8px] px-[11px] py-2 text-left text-[13px] font-semibold text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus-ring"
          >
            Log out / switch user
          </button>
        </div>
      ) : null}
    </div>
  );
}
