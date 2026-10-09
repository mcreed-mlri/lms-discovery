"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { legalSkillsBinder, openTabId } from "@/lib/binder";

// Module state survives client-side navigation (each page mounts its own
// shell), so it remembers which divider was open on the page before. On a hard
// load or a deep link it is unset, and the open tab simply appears open.
let lastOpenId: string | null = null;

/**
 * The open binder's divider tabs. App navigation lives in the header; these are
 * the binder's own sections (Contents, then the Legal Skills areas).
 *
 * `rail` is the desktop column on the page's fore-edge: manila dividers, the
 * open one white and joined to the page with the binder colour on its edge.
 * `strip` is the phone version, a horizontal row of the same tabs at the top
 * of binder pages, because thirteen tabs do not fit a bottom bar.
 */
export function BinderTabs({ variant = "rail" }: { variant?: "rail" | "strip" }) {
  const pathname = usePathname();
  const openId = openTabId(pathname);
  // Changing section: the old divider slides shut and the new one draws out.
  const previous = lastOpenId !== null && lastOpenId !== openId ? lastOpenId : null;

  useEffect(() => {
    lastOpenId = openId;
  }, [openId]);

  const label = `${legalSkillsBinder.name} tabs`;

  if (variant === "strip") {
    return (
      <nav aria-label={label} className="binder-strip">
        <ul>
          {legalSkillsBinder.tabs.map((tab) => (
            <li key={tab.id}>
              <Link
                href={tab.href}
                aria-current={tab.id === openId ? "page" : undefined}
                className="binder-strip-tab focus-ring"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label={label} className="binder-tabs">
      {legalSkillsBinder.tabs.map((tab) => {
        const open = tab.id === openId;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={open ? "page" : undefined}
            className={`binder-tab focus-ring ${open && previous ? "binder-tab-opening" : ""} ${
              tab.id === previous ? "binder-tab-closing" : ""
            }`}
          >
            <span className="binder-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
