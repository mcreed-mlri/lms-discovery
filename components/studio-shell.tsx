"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BellIcon, BookIcon, GridIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { SiteFooter } from "@/components/site-footer";
import { StudioContentBar } from "@/components/studio-content-bar";
import { StudioRail } from "@/components/studio-rail";
import { getEffectiveDashboardRole, getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { getLearningItems } from "@/lib/data";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { searchLearningItems, type SearchResult } from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";

const COLLAPSE_KEY = "lace-rail-collapsed";

export function StudioShell({
  children,
  padded = true,
}: {
  children: ReactNode;
  /** Wrap children in the centered 1120px content column. Home opts out to run
   *  full-bleed hero sections. */
  padded?: boolean;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  // The drawer is a modal overlay, so it gets the same containment as the two
  // dialogs: focus stays inside it and the page behind cannot scroll.
  const drawerRef = useFocusTrap<HTMLDivElement>(mobileOpen);
  useScrollLock(mobileOpen || searchOpen);

  const allItems = useMemo(() => getEligibleLearningItems(getLearningItems(), user), [user]);
  const globalResults = useMemo(
    () => searchLearningItems(allItems, globalQuery).slice(0, 6),
    [allItems, globalQuery],
  );

  const openGlobalSearch = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(true);
  }, []);

  const closeGlobalSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const openGlobalSearchResult = useCallback(
    (result: SearchResult) => {
      recordSearchAnalytics({
        type: "search_result_selected",
        query: globalQuery,
        resultId: `${result.item.type}-${result.item.id}`,
        resultType: result.item.type,
        resultTitle: result.item.title,
      });
      setSearchOpen(false);
      setGlobalQuery("");
      // The home page reads q/open via useSearchParams, so this push is the whole
      // mechanism. It used to be accompanied by a CustomEvent because the home
      // page only read the URL once on mount.
      router.push(
        `/?q=${encodeURIComponent(result.item.title)}&open=${encodeURIComponent(`${result.item.type}-${result.item.id}`)}#browse`,
      );
    },
    [globalQuery, router],
  );

  // Restore the per-user rail preference.
  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  // Ctrl/Cmd-K opens the global search dialog.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openGlobalSearch();
        return;
      }
      if (event.key === "Escape") {
        // Both overlays need a keyboard exit (WCAG 2.1.2). The drawer used to
        // have none: Escape only reached the search dialog.
        closeGlobalSearch();
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeGlobalSearch, openGlobalSearch]);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!ready || !user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[color:var(--ink)]">Loading</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-shell flex min-h-screen items-stretch">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Desktop rail */}
      <div className="sticky top-0 hidden h-screen shrink-0 lg:flex">
        <StudioRail collapsed={collapsed} onToggle={toggleCollapsed} onSearch={openGlobalSearch} />
      </div>

      {/* Mobile rail drawer */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-[rgba(20,22,27,0.4)]"
            data-focus-skip="true"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex max-h-screen overflow-y-auto pt-[env(safe-area-inset-top,0px)] shadow-[var(--shadow-lg)]">
            <StudioRail
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onSearch={openGlobalSearch}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip pb-20 lg:pb-0">
        <StudioContentBar onMenu={() => setMobileOpen(true)} onSearch={openGlobalSearch} />
        <main id="main-content" className="min-w-0 flex-1 overflow-x-clip">
          {padded ? (
            <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-10">{children}</div>
          ) : (
            children
          )}
        </main>
        <SiteFooter />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--line)] bg-[color:var(--surface)] px-5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className={`mx-auto grid max-w-md ${isAdmin ? "grid-cols-3" : "grid-cols-4"}`}>
          <BottomNavLink
            href="/"
            label="Home"
            active={pathname === "/"}
            icon={<HomeIcon className="h-5 w-5" />}
          />
          <BottomNavButton
            label="Search"
            icon={<SearchIcon className="h-5 w-5" />}
            onClick={openGlobalSearch}
          />
          {isAdmin ? (
            <BottomNavLink
              href={getBrightspaceManagerUrl()}
              label="Manager"
              active={false}
              icon={<GridIcon className="h-5 w-5" />}
            />
          ) : (
            <>
              <BottomNavLink
                href="/my-learning"
                label="Learning"
                active={pathname.startsWith("/my-learning")}
                icon={<BookIcon className="h-5 w-5" />}
              />
              <BottomNavLink
                href="/updates"
                label="Updates"
                active={pathname.startsWith("/updates")}
                icon={<BellIcon className="h-5 w-5" />}
              />
            </>
          )}
        </div>
      </nav>

      {searchOpen ? (
        <GlobalSearchDialog
          query={globalQuery}
          results={globalResults}
          onChange={setGlobalQuery}
          onClose={closeGlobalSearch}
          onSelect={openGlobalSearchResult}
        />
      ) : null}
    </div>
  );
}

function GlobalSearchDialog({
  query,
  results,
  onChange,
  onClose,
  onSelect,
}: {
  query: string;
  results: SearchResult[];
  onChange: (value: string) => void;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}) {
  // The trap moves focus to the first control, which is the search input.
  const dialogRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-start justify-center bg-[rgba(20,22,27,0.34)] px-4 pt-[calc(5rem+env(safe-area-inset-top,0px))] backdrop-blur-sm sm:pt-[calc(7rem+env(safe-area-inset-top,0px))]"
      role="dialog"
      aria-modal="true"
      aria-label="Search learning library"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close search"
        data-focus-skip="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3 shadow-[var(--shadow-lg)]">
        <SearchBox
          value={query}
          onChange={onChange}
          suggestions={results}
          onSelect={onSelect}
          prominent
        />
        <div className="mt-3 flex items-center justify-between px-1 text-xs font-semibold text-[color:var(--ink-soft)]">
          <span>Search courses, modules, paths, and topics</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus-ring"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomNavLink({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-bold focus-ring ${
        active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-soft)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      {label}
    </Link>
  );
}

function BottomNavButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-bold text-[color:var(--ink-soft)] focus-ring"
    >
      {icon}
      {label}
    </button>
  );
}
