"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BellIcon,
  BookIcon,
  ChevronLeftIcon,
  GridIcon,
  HomeIcon,
  SearchIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { skillAreas } from "@/lib/data";
import { getHue } from "@/lib/skill-hue";
import { useState, type ComponentType } from "react";

// How many skill areas to show in the rail before the "Show more" toggle.
const RAIL_AREA_LIMIT = 7;

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
};

const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: HomeIcon, match: (p) => p === "/" },
  { label: "Browse", href: "/browse", icon: GridIcon, match: (p) => p === "/browse" },
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

export function StudioRail({
  collapsed,
  onToggle,
  onSearch,
  onNavigate,
  showSkillAreas = true,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onSearch?: () => void;
  /** Fires when any link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
  /** Static skill-area links are mock/catalog-planning affordances. */
  showSkillAreas?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const effectiveRole = getEffectiveDashboardRole(user);
  const isAdmin = effectiveRole === "super_admin";

  // The full list is long; show a core set with a "Show more" toggle. When the
  // rail is collapsed to icons, the compact swatches all fit, so show them all.
  const [showAllAreas, setShowAllAreas] = useState(false);
  const visibleSkillAreas =
    collapsed || showAllAreas ? skillAreas : skillAreas.slice(0, RAIL_AREA_LIMIT);

  // The headless admin account is an ops/data login — hide learner surfaces.
  const visiblePrimaryNav = primaryNav.filter((item) => !item.learnerOnly || !isAdmin);
  const visibleRoleNav = roleNav.filter((item) => !item.adminOnly || isAdmin);

  function handleLogout() {
    logout();
    onNavigate?.();
    router.push("/login");
  }

  return (
    <div
      className={`flex h-full max-h-screen flex-col overflow-y-auto overflow-x-hidden border-r border-[color:var(--line)] bg-[color:var(--surface)] transition-[width,padding] duration-200 ease-[cubic-bezier(.4,0,.2,1)] ${
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

      {/* Search */}
      {collapsed ? (
        <button
          type="button"
          onClick={onSearch}
          title="Search - Ctrl K"
          className="mx-auto mb-4 flex h-10 w-11 items-center justify-center rounded-[9px] border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] transition hover:border-[color:var(--line-strong)] focus-ring"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSearch}
          className="mb-4 flex items-center gap-[9px] rounded-[9px] border border-[color:var(--line-soft)] bg-[color:var(--surface)] px-3 py-[9px] text-left shadow-[var(--shadow-xs)] transition hover:border-[color:var(--line-strong)] focus-ring"
        >
          <SearchIcon className="h-4 w-4 text-[color:var(--ink-soft)]" />
          <span className="flex-1 text-[13px] text-[color:var(--ink-soft)]">Search</span>
          <span className="rounded-[7px] bg-[color:var(--surface-sunken)] px-[7px] py-1 font-mono text-[11px] font-semibold text-[color:var(--ink-soft)]">
            Ctrl K
          </span>
        </button>
      )}

      {/* Primary nav */}
      <nav className="flex flex-col gap-[3px]" aria-label="Primary">
        {visiblePrimaryNav.map((item) => (
          <RailItem
            key={item.label}
            item={item}
            active={item.match ? item.match(pathname) : pathname === item.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
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
      {showSkillAreas ? (
        <div className="mt-[26px]">
          {collapsed ? (
            <div className="mx-1.5 mb-[14px] mt-1 h-px bg-[color:var(--line-soft)]" />
          ) : (
            <div className="mb-3 px-[11px] font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--ink-soft)]">
              Skill areas
            </div>
          )}
          <div className={`flex flex-col ${collapsed ? "gap-1.5" : "gap-0.5"}`}>
            {visibleSkillAreas.map((area) => {
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
            {!collapsed && skillAreas.length > RAIL_AREA_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllAreas((value) => !value)}
                aria-expanded={showAllAreas}
                className="mt-0.5 flex items-center gap-[11px] rounded-[8px] px-[11px] py-[7px] text-left text-[13px] font-semibold text-[color:var(--brand)] transition hover:bg-[color:var(--surface-sunken)] focus-ring"
              >
                {showAllAreas ? "Show fewer" : `Show ${skillAreas.length - RAIL_AREA_LIMIT} more`}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Footer: collapse toggle + user */}
      <div className="mt-auto border-t border-[color:var(--line-soft)] pt-4">
        <ThemeToggle collapsed={collapsed} className={collapsed ? "mx-auto mb-1.5" : "mb-1.5"} />
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={`mb-1.5 flex w-full items-center gap-[11px] rounded-[8px] text-[13px] font-medium text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] focus-ring ${
            collapsed ? "justify-center px-0 py-[9px]" : "px-[11px] py-[9px]"
          }`}
        >
          <ChevronLeftIcon
            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
        <div
          className={`flex items-center gap-2.5 ${collapsed ? "justify-center px-0 py-1" : "px-[7px] py-1"}`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-[12px] font-[650] text-[color:var(--brand-on)]">
            {user?.initials ?? "—"}
          </span>
          {!collapsed && user && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-semibold text-[color:var(--ink)]">
                {user.name}
              </div>
              <div className="truncate text-[11px] text-[color:var(--ink-soft)]">{user.title}</div>
            </div>
          )}
        </div>
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Log out / switch user" : undefined}
            className={`mt-2 flex w-full items-center rounded-[8px] text-[13px] font-semibold text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus-ring ${
              collapsed ? "justify-center px-0 py-2" : "px-[11px] py-2"
            }`}
          >
            {collapsed ? "Out" : "Log out / switch user"}
          </button>
        )}
      </div>
    </div>
  );
}
