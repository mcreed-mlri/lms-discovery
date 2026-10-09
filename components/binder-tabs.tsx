"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties } from "react";

import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";

export type BinderTone = "home" | "browse" | "paths" | "learning" | "updates";

type BinderTab = {
  label: string;
  href: string;
  /** Token stem: `--tab-<tone>` is the fill, `--tab-<tone>-on` its measured text. */
  tone: BinderTone;
  match: (pathname: string) => boolean;
  learnerOnly?: boolean;
  adminOnly?: boolean;
};

// The five divider tabs on the page's fore-edge. Learn pages and the curriculum
// map live under Browse, because that is where a visitor reaches them from.
const tabs: BinderTab[] = [
  { label: "Home", href: "/", tone: "home", match: (p) => p === "/" },
  {
    label: "Browse",
    href: "/browse",
    tone: "browse",
    match: (p) =>
      (p.startsWith("/browse") && !p.startsWith("/browse/paths")) ||
      p.startsWith("/learn") ||
      p.startsWith("/curriculum-map"),
  },
  {
    label: "Learning paths",
    href: "/browse/paths",
    tone: "paths",
    match: (p) => p.startsWith("/browse/paths"),
  },
  {
    label: "My learning",
    href: "/my-learning",
    tone: "learning",
    learnerOnly: true,
    match: (p) => p.startsWith("/my-learning"),
  },
  {
    label: "Manager",
    href: getBrightspaceManagerUrl(),
    tone: "learning",
    adminOnly: true,
    match: () => false,
  },
  {
    label: "Updates",
    href: "/updates",
    tone: "updates",
    learnerOnly: true,
    match: (p) => p.startsWith("/updates"),
  },
];

/** The open section's tone, so the sheet can carry its colour. Home by default. */
export function activeBinderTone(pathname: string): BinderTone {
  return tabs.find((tab) => !tab.adminOnly && tab.match(pathname))?.tone ?? "home";
}

function tabStyle(tone: BinderTone): CSSProperties {
  return {
    "--tab": `var(--tab-${tone})`,
    "--tab-on": `var(--tab-${tone}-on)`,
  } as CSSProperties;
}

// Module state survives client-side navigation (each page mounts its own
// shell), so it remembers which divider was open on the page before. On a hard
// load or a deep link it is unset, and the open tab simply appears open.
let lastOpenHref: string | null = null;

/**
 * Desktop navigation: divider tabs that run under the page sheet and stick out
 * from its right edge. The current section's tab is pulled out further, like a
 * divider flipped open. Phones use the bottom bar in StudioShell instead.
 */
export function BinderTabs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";
  const visible = tabs.filter((tab) => (isAdmin ? !tab.learnerOnly : !tab.adminOnly));
  const openHref = visible.find((tab) => tab.match(pathname))?.href ?? null;
  // Changing section: the old divider slides shut and the new one draws out.
  const previous = lastOpenHref !== null && lastOpenHref !== openHref ? lastOpenHref : null;

  useEffect(() => {
    lastOpenHref = openHref;
  }, [openHref]);

  return (
    <nav aria-label="Sections" className="binder-tabs">
      {visible.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.label}
            href={tab.href}
            style={tabStyle(tab.tone)}
            aria-current={active ? "page" : undefined}
            className={`binder-tab focus-ring ${
              active && previous ? "binder-tab-opening" : ""
            } ${tab.href === previous ? "binder-tab-closing" : ""}`}
          >
            <span className="binder-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
