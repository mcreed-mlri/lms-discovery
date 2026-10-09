"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useOpenBinder } from "@/lib/hooks/use-open-binder";

// Module state survives client-side navigation (each page mounts its own
// shell), so it remembers which divider was open on the page before. On a hard
// load or a deep link it is unset, and the open tab simply appears open.
let lastOpenHref: string | null = null;

/**
 * The open binder's divider tabs. App navigation lives in the header; these are
 * the binder's own sections (Contents, then its curriculum areas).
 *
 * `rail` is the desktop column on the page's fore-edge: manila dividers, the
 * open one white and joined to the page with the binder colour on its edge.
 * `strip` is the phone version, a horizontal row of the same tabs at the top
 * of binder pages.
 */
export function BinderTabs({ variant = "rail" }: { variant?: "rail" | "strip" }) {
  const { binder, tabId } = useOpenBinder();
  const openHref = binder.tabs.find((tab) => tab.id === tabId)?.href ?? null;
  // Changing section: the old divider slides shut and the new one draws out.
  const previous = lastOpenHref !== null && lastOpenHref !== openHref ? lastOpenHref : null;

  useEffect(() => {
    lastOpenHref = openHref;
  }, [openHref]);

  const label = `${binder.name} tabs`;

  if (variant === "strip") {
    return (
      <nav aria-label={label} className="binder-strip">
        <ul>
          {binder.tabs.map((tab) => (
            <li key={tab.id}>
              <Link
                href={tab.href}
                aria-current={tab.href === openHref ? "page" : undefined}
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
      {binder.tabs.map((tab) => {
        const open = tab.href === openHref;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={open ? "page" : undefined}
            className={`binder-tab focus-ring ${open && previous ? "binder-tab-opening" : ""} ${
              tab.href === previous ? "binder-tab-closing" : ""
            }`}
          >
            <span className="binder-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
