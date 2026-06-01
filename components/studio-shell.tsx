"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BellIcon, BookIcon, HomeIcon, SearchIcon } from "@/components/icons";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { SiteFooter } from "@/components/site-footer";
import { StudioContentBar } from "@/components/studio-content-bar";
import { StudioRail } from "@/components/studio-rail";
import { useAuth } from "@/lib/auth";

const COLLAPSE_KEY = "lace-rail-collapsed";

function focusSearch() {
  const input = document.querySelector<HTMLInputElement>('input[type="search"]');
  if (input) {
    input.focus();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  } else if (typeof window !== "undefined") {
    // No search on this page — send the user to the catalog.
    window.location.href = "/#browse";
  }
}

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
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // ⌘K / Ctrl-K focuses the command bar.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
        <StudioRail collapsed={collapsed} onToggle={toggleCollapsed} onSearch={focusSearch} />
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
              onSearch={() => {
                setMobileOpen(false);
                focusSearch();
              }}
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
