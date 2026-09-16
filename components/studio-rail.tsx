"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  BookIcon,
  ChevronLeftIcon,
  GridIcon,
  HomeIcon,
  PathIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { skillAreas, subjectAreas, type SkillArea } from "@/lib/data";
import { getHue } from "@/lib/skill-hue";
import { useState, type ComponentType } from "react";

// How many skill areas to show in the rail before the "Show more" toggle.
const RAIL_AREA_LIMIT = 7;

type NavChild = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  match?: (pathname: string) => boolean;
};

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: boolean;
  /** Active when the pathname matches/starts with this. Defaults to exact href. */
  match?: (pathname: string) => boolean;
  adminOnly?: boolean;
  /** Hidden for the headless admin account — these are learner-only surfaces. */
  learnerOnly?: boolean;
  children?: NavChild[];
};

const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon, match: (p) => p === "/" },
  {
    label: "Browse",
    href: "/browse",
    icon: GridIcon,
    match: (p) => p === "/browse",
    children: [
      {
        label: "Learning paths",
        href: "/browse/paths",
        icon: PathIcon,
        match: (p) => p.startsWith("/browse/paths"),
      },
    ],
  },
  {
    label: "My Learning",
    href: "/my-learning",
    icon: BookIcon,
    learnerOnly: true,
    match: (p) =>
      p === "/my-learning" || (p.startsWith("/my-learning/") && p !== "/my-learning/admin"),
  },
  {
    label: "Updates",
    href: "/updates",
    icon: BellIcon,
    badge: true,
    learnerOnly: true,
    match: (p) => p.startsWith("/updates"),
  },
];

const roleNav: NavItem[] = [
  {
    label: "Brightspace Manager",
    href: getBrightspaceManagerUrl(),
    icon: GridIcon,
    adminOnly: true,
    match: () => false,
  },
];

function RailItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-[9px] text-sm transition focus-ring ${
        collapsed ? "justify-center px-0 py-2.5" : "px-[11px] py-[9px]"
      } ${
        active
          ? "nav-link-active font-[650] text-[color:var(--ink)]"
          : "font-medium text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-sunken)]"
      }`}
    >
      <span className="relative flex shrink-0">
        <Icon
          className={`h-[19px] w-[19px] ${active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-soft)]"}`}
        />
        {item.badge && (
          <span className="absolute -right-[3px] -top-[2px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[color:var(--status-changed)]" />
        )}
      </span>
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </Link>
  );
}

// One rail group ("Skills training", "Subject-area training"): a header that
// collapses the whole group, a capped list of coloured rows with its own
// "Show more" toggle, and — when the rail itself is collapsed to icons, where
// there's no header text left to click — a plain divider instead.
function AreaList({
  label,
  areas,
  collapsed,
  onNavigate,
}: {
  label: string;
  areas: SkillArea[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleAreas = collapsed || showAll ? areas : areas.slice(0, RAIL_AREA_LIMIT);

  if (areas.length === 0) return null;

  const rows = (
    <div className={`flex flex-col ${collapsed ? "gap-1.5" : "gap-0.5"}`}>
      {visibleAreas.map((area) => {
        const hue = getHue(area.hueIndex);
        return (
          <Link
            key={area.id}
            href={area.href}
            onClick={onNavigate}
            title={collapsed ? `${area.name} · ${area.count}` : undefined}
            className={`flex items-center gap-[11px] overflow-hidden whitespace-nowrap rounded-[8px] text-[13px] text-[color:var(--ink-muted)] transition hover:bg-[color:var(--surface-sunken)] focus-ring ${
              collapsed ? "justify-center px-0 py-[7px]" : "px-[11px] py-[7px]"
            }`}
          >
            <span
              className="h-[9px] w-[9px] shrink-0 rounded-[3px]"
              style={{ background: hue.solid }}
            />
            {!collapsed && (
              <>
                <span className="flex-1">{area.name}</span>
                <span className="text-[12px] font-medium text-[color:var(--ink-soft)]">
                  {area.count}
                </span>
              </>
            )}
          </Link>
        );
      })}
      {!collapsed && areas.length > RAIL_AREA_LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          aria-expanded={showAll}
          className="mt-0.5 flex items-center gap-[11px] rounded-[8px] px-[11px] py-[7px] text-left text-[13px] font-semibold text-[color:var(--brand)] transition hover:bg-[color:var(--surface-sunken)] focus-ring"
        >
          {showAll ? "Show fewer" : `Show ${areas.length - RAIL_AREA_LIMIT} more`}
        </button>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <div className="mt-[26px]">
        <div className="mx-1.5 mb-[14px] mt-1 h-px bg-[color:var(--line-soft)]" />
        {rows}
      </div>
    );
  }

  return (
    <details open className="group mt-[26px]">
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between rounded-[8px] px-[11px] py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] focus-ring marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <ChevronLeftIcon className="h-3 w-3 shrink-0 -rotate-90 text-[color:var(--ink-soft)] transition-transform duration-200 group-open:rotate-90" />
      </summary>
      {rows}
    </details>
  );
}

export function StudioRail({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  /** Fires when any link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const effectiveRole = getEffectiveDashboardRole(user);
  const isAdmin = effectiveRole === "super_admin";

  // The headless admin account is an ops/data login — hide learner surfaces.
  const visiblePrimaryNav = primaryNav.filter((item) => !item.learnerOnly || !isAdmin);
  const visibleRoleNav = roleNav.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div
      className={`studio-rail flex h-full max-h-[100dvh] flex-col overflow-y-auto overscroll-contain overflow-x-hidden border-r border-[color:var(--line)] bg-[color:var(--surface)] transition-[width,padding] duration-200 ease-[cubic-bezier(.4,0,.2,1)] ${
        collapsed ? "w-[68px] px-3 py-5" : "w-[240px] px-3.5 py-5"
      }`}
    >
      {/* Brand — the mark doubles as the expand/collapse toggle */}
      <div
        className={`mb-1 flex items-center gap-[9px] pb-[18px] ${
          collapsed ? "justify-center px-0" : "px-1.5"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--ink)] text-[color:var(--surface)] shadow-[var(--shadow-xs)] transition hover:opacity-90 focus-ring"
        >
          <span aria-hidden="true" className="text-[17px] font-bold leading-none">
            L
          </span>
        </button>
        {!collapsed && (
          <span className="text-[19px] font-bold tracking-[-0.02em] text-[color:var(--ink)]">
            LACE
          </span>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-[3px]" aria-label="Primary">
        {visiblePrimaryNav.map((item) => {
          const childActive = item.children?.some((child) =>
            child.match ? child.match(pathname) : pathname === child.href,
          );
          return (
            <div key={item.label}>
              <RailItem
                item={item}
                active={
                  (item.match ? item.match(pathname) : pathname === item.href) && !childActive
                }
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
              {item.children?.map((child) => {
                const active = child.match ? child.match(pathname) : pathname === child.href;
                const Icon = child.icon;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    title={collapsed ? child.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center overflow-hidden whitespace-nowrap rounded-[9px] text-[13px] transition focus-ring ${
                      collapsed
                        ? "mx-auto justify-center px-0 py-2"
                        : "mt-0.5 gap-3 px-[11px] py-[7px]"
                    } ${
                      active
                        ? "nav-link-active font-[650] text-[color:var(--ink)]"
                        : "font-medium text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-sunken)]"
                    }`}
                  >
                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-soft)]"}`}
                    />
                    {!collapsed && <span className="flex-1">{child.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
        {visibleRoleNav.map((item) => (
          <RailItem
            key={item.label}
            item={item}
            active={item.match ? item.match(pathname) : pathname === item.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Skill areas — the Legal Skills curriculum areas (each a course) */}
      <AreaList
        label="Skills training"
        areas={skillAreas}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {/* Subject areas — the Substantive Law curriculum areas beside them */}
      <AreaList
        label="Subject-area training"
        areas={subjectAreas}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {/* Footer: theme + collapse. Account lives in the top-right bubble. */}
      <div className="mt-auto border-t border-[color:var(--line-soft)] pt-4">
        <ThemeToggle collapsed={collapsed} className={collapsed ? "mx-auto mb-1.5" : "mb-1.5"} />
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={`flex w-full items-center gap-[11px] rounded-[8px] text-[13px] font-medium text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] focus-ring ${
            collapsed ? "justify-center px-0 py-[9px]" : "px-[11px] py-[9px]"
          }`}
        >
          <ChevronLeftIcon
            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}
