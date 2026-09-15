"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HeroSection } from "@/components/home/hero-section";
import { HomeOverview } from "@/components/home/home-overview";
import { StudioShell } from "@/components/studio-shell";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { browseHref } from "@/lib/home-helpers";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { SearchResult } from "@/lib/search";

export default function Home() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const catalog = useCatalogFilters(user);
  const { allItems, setQuery } = catalog;

  function openSearchResult(result: SearchResult) {
    recordSearchAnalytics({
      type: "search_result_selected",
      query: catalog.query,
      resultId: result.document.id,
      resultType: result.item.type,
      resultTitle: result.item.title,
    });
    router.push(
      browseHref({
        q: result.item.title,
        open: `${result.item.type}-${result.item.id}`,
      }),
    );
  }

  /**
   * Older links pointed at /?q=&open=#browse when the catalog lived on home.
   * The library is /browse now; send those params there so shared URLs still
   * open the same item.
   */
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!user) return;
    const q = searchParams.get("q");
    const open = searchParams.get("open");
    const skill = searchParams.get("skill");
    if (!q && !open && !skill) return;
    router.replace(browseHref({ q, open, skill }));
  }, [user, searchParams, router]);

  if (!ready) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[color:var(--ink)]">
            Preparing your library
          </h1>
          <p className="mt-2 text-sm font-semibold text-[color:var(--ink-muted)]">
            Loading your courses, modules, and reading list.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4 py-12">
        <div className="editorial-panel w-full max-w-md rounded-2xl p-7 text-center">
          <p className="editorial-eyebrow">LACE Learning Hub</p>
          <h1 className="hero-title mt-4 text-4xl text-[color:var(--ink)]">
            Start where the case is.
          </h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--ink-muted)]">
            Continue into focused training for Massachusetts legal aid practice.
          </p>
          {/*
            One destination. login() now resolves the provider via /login, so the
            button and the old "Use the full sign-in page" link below it went to
            the same place; the button also greeted people as the demo persona,
            which is wrong on a deployment where they sign in as themselves.
          */}
          <button
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
            type="button"
            onClick={() => login()}
          >
            Sign in to continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <StudioShell padded={false}>
      <div className="border-b border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-4 py-1.5 text-center sm:px-6 lg:px-10">
        <p className="text-[11px] font-medium leading-snug text-[color:var(--ink-muted)] sm:text-[12px]">
          Internal use only, for MLRI staff. This is a work-in-progress prototype, and nearly all
          course content is placeholder, not reviewed legal material.
        </p>
      </div>

      <HeroSection
        user={user}
        isAdmin={isAdmin}
        query={catalog.query}
        onQueryChange={setQuery}
        suggestions={catalog.searchSuggestions}
        onSelectResult={openSearchResult}
        onSearchLibrary={(term) => router.push(browseHref({ q: term }))}
        allItems={allItems}
      />

      <HomeOverview catalogTotal={catalog.catalogTotal} />
    </StudioShell>
  );
}
