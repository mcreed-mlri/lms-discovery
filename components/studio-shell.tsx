"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BinderTabs } from "@/components/binder-tabs";
import { BellIcon, BookIcon, GridIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { SiteFooter } from "@/components/site-footer";
import { StudioContentBar } from "@/components/studio-content-bar";
import { StudioRail } from "@/components/studio-rail";
import { getEffectiveDashboardRole, getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";
import { locateInBinder } from "@/lib/binder";
import { useOpenBinder } from "@/lib/hooks/use-open-binder";
import { getLearningItems } from "@/lib/data";
import { browseHref } from "@/lib/home-helpers";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { searchLearningItems, type SearchResult } from "@/lib/search";
import { recordSearchAnalytics } from "@/lib/search-analytics";

export function StudioShell({
  children,
  padded = true,
}: {
  children: ReactNode;
  /** Wrap children in the centered content column. Home opts out and lays out
   *  its own sections inside the page sheet. */
  padded?: boolean;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";
  const { binder } = useOpenBinder();

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
      router.push(
        browseHref({
          q: result.item.title,
          open: `${result.item.type}-${result.item.id}`,
        }),
      );
    },
    [globalQuery, router],
  );

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
          <h1 className="hero-title text-3xl text-[color:var(--ink)]">Loading</h1>
        </div>
      </div>
    );
  }

  // The binder: on lg+ the page sheet runs to the top, left and bottom edges,
  // and the open binder's divider tabs (BinderTabs) sit in a chipboard strip on
  // its right. Below lg the sheet is the whole screen, the drawer holds the full
  // navigation, binder pages get the tabs as a strip, and the bottom bar takes
  // the header's job.
  const inBinder = locateInBinder(pathname) !== null;
  return (
    <div className="hub-shell binder-board min-h-screen" data-binder={binder.id}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

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
          <div className="absolute inset-y-0 left-0 flex max-h-[100dvh] overflow-y-auto overscroll-contain pt-[var(--safe-top)] shadow-[var(--shadow-lg)]">
            <StudioRail
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="pb-[calc(5rem+var(--safe-bottom))] lg:flex lg:min-h-screen lg:items-stretch lg:pb-0">
        {/* The page sheet */}
        <div className="binder-sheet flex min-w-0 flex-1 flex-col overflow-x-clip">
          <StudioContentBar onMenu={() => setMobileOpen(true)} onSearch={openGlobalSearch} />
          {inBinder ? (
            <div className="lg:hidden">
              <BinderTabs variant="strip" />
            </div>
          ) : null}
          <main id="main-content" className="min-w-0 flex-1 overflow-x-clip">
            {padded ? (
              <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-11">{children}</div>
            ) : (
              children
            )}
          </main>
          <SiteFooter />
        </div>

        <div className="hidden shrink-0 lg:block">
          <BinderTabs />
        </div>
      </div>

      {/* Mobile bottom bar: the header's job on phones. */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t-[1.5px] border-[color:var(--sheet-edge)] bg-[color:var(--surface)] px-1.5 pb-[calc(0.5rem+var(--safe-bottom))] pt-1.5 lg:hidden"
      >
        <div className={`mx-auto grid max-w-lg ${isAdmin ? "grid-cols-4" : "grid-cols-5"}`}>
          <BottomNavLink
            href="/"
            label="Home"
            active={pathname === "/"}
            icon={<HomeIcon className="h-5 w-5" />}
          />
          <BottomNavLink
            href="/browse"
            label="Library"
            active={
              pathname.startsWith("/browse") ||
              pathname.startsWith("/binder") ||
              pathname.startsWith("/curriculum-map")
            }
            icon={<GridIcon className="h-5 w-5" />}
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
                badge
                icon={<BellIcon className="h-5 w-5" />}
              />
            </>
          )}
          <BottomNavButton
            label="Search"
            icon={<SearchIcon className="h-5 w-5" />}
            onClick={openGlobalSearch}
          />
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

  // The top offset is the phone case, not a scaled-down desktop one: focusing
  // the input opens the software keyboard, which covers the bottom half of the
  // screen, so the panel sits just under the safe-area inset and leaves the
  // suggestions above it. The roomier drop is for pointer widths, where
  // nothing is covering anything.
  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-x-clip overscroll-contain bg-[rgba(20,22,27,0.34)] px-4 pt-[calc(1rem+var(--safe-top))] backdrop-blur-sm sm:pt-[calc(7rem+var(--safe-top))]"
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
  badge = false,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
  /** The unread dot, which followed the bell down from the header on phones. */
  badge?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center gap-1 rounded-xl pb-1.5 pt-2 text-[11px] font-bold focus-ring before:absolute before:inset-x-3 before:-top-1.5 before:h-[3px] before:rounded-b-[2px] ${
        active
          ? "text-[color:var(--ink)] before:bg-[color:var(--ink)]"
          : "text-[color:var(--ink-soft)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span className="relative">
        {icon}
        {badge ? (
          <span
            aria-hidden="true"
            className="absolute -right-[3px] -top-[2px] h-[7px] w-[7px] rounded-full border-2 border-[color:var(--surface)] bg-[color:var(--status-changed)]"
          />
        ) : null}
      </span>
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
      className="flex flex-col items-center gap-1 rounded-xl pb-1.5 pt-2 text-[11px] font-bold text-[color:var(--ink-soft)] focus-ring"
    >
      {icon}
      {label}
    </button>
  );
}
