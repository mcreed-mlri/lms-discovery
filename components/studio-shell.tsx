"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BellIcon, BookIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { SearchBox } from "@/components/search-box";
import { SiteFooter } from "@/components/site-footer";
import { StudioContentBar } from "@/components/studio-content-bar";
import { StudioRail } from "@/components/studio-rail";
import { useAuth } from "@/lib/auth";
import { getLearningItems } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";

const COLLAPSE_KEY = "lace-rail-collapsed";

export function StudioShell({
  children,
  padded = true,
  showRoleSwitcher = true,
}: {
  children: ReactNode;
  /** Wrap children in the centered 1120px content column. Home opts out to run
   *  full-bleed hero sections. */
  padded?: boolean;
  showRoleSwitcher?: boolean;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  const allItems = useMemo(() => getLearningItems(), []);
  const globalResults = useMemo(() => searchLearningItems(allItems, globalQuery).slice(0, 6), [allItems, globalQuery]);

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
      window.dispatchEvent(
        new CustomEvent("lace-open-learning-item", {
          detail: {
            id: `${result.item.type}-${result.item.id}`,
            query: result.item.title,
          },
        }),
      );
      setSearchOpen(false);
      setGlobalQuery("");
      router.push(`/?q=${encodeURIComponent(result.item.title)}&open=${encodeURIComponent(`${result.item.type}-${result.item.id}`)}#browse`);
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
        closeGlobalSearch();
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
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-[rgba(20,22,27,0.4)]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex max-h-screen overflow-y-auto shadow-[var(--shadow-lg)]">
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
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <StudioContentBar onMenu={() => setMobileOpen(true)} />
        <main id="main-content" className="flex-1">
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
        <div className="mx-auto grid max-w-md grid-cols-4">
          <BottomNavLink href="/" label="Home" active={pathname === "/"} icon={<HomeIcon className="h-5 w-5" />} />
          <BottomNavLink href="/#browse" label="Browse" active={false} icon={<SearchIcon className="h-5 w-5" />} />
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
        </div>
      </nav>

      {showRoleSwitcher ? <RoleSwitcher /> : null}

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
  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLInputElement>('[data-global-search="true"] input[type="search"]')?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-[rgba(20,22,27,0.34)] px-4 pt-20 backdrop-blur-sm sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label="Search learning library"
    >
      <button type="button" className="absolute inset-0" aria-label="Close search" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface)] p-3 shadow-[var(--shadow-lg)]"
        data-global-search="true"
      >
        <SearchBox value={query} onChange={onChange} suggestions={results} onSelect={onSelect} prominent />
        <div className="mt-3 flex items-center justify-between px-1 text-xs font-semibold text-[color:var(--ink-soft)]">
          <span>Search courses, modules, paths, and topics</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
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
      className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[color:var(--brand)]/15 ${
        active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-soft)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      {label}
    </Link>
  );
}
