"use client";

import Link from "next/link";
import { useEffect } from "react";

import { BookmarkFilledIcon } from "@/components/icons";
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
 * Off the binder's pages (Home, My learning) nothing is open: the rail marks
 * the divider the visitor left off on with a bookmark, still manila, so it
 * never looks as if Home were a page inside the binder. The header's switcher
 * names the binder.
 * `strip` is the phone version, a horizontal row of the same tabs at the top
 * of binder pages.
 */
export function BinderTabs({ variant = "rail" }: { variant?: "rail" | "strip" }) {
  const { binder, tabId, leftOffTabId } = useOpenBinder();
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
        const leftOff = openHref === null && tab.id === leftOffTabId;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={open ? "page" : undefined}
            // The marker is an icon, so the left-off state is named here.
            aria-label={leftOff ? `${tab.label}, where you left off` : undefined}
            className={`binder-tab focus-ring ${open && previous ? "binder-tab-opening" : ""} ${
              tab.href === previous ? "binder-tab-closing" : ""
            } ${leftOff ? "binder-tab-left-off" : ""}`}
          >
            <span className="binder-tab-label">{tab.label}</span>
            {leftOff ? <BookmarkFilledIcon className="binder-tab-marker" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
