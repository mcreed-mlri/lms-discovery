"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HeroSection } from "@/components/home/hero-section";
import { HomeOverview } from "@/components/home/home-overview";
import { StudioShell } from "@/components/studio-shell";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { browseHref } from "@/lib/home-helpers";
import { searchBinders } from "@/lib/binder-search";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";
import { openBinderHit } from "@/lib/open-binder-hit";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { SearchResult } from "@/lib/search";

/**
 * Home is one grid so each column flows on its own. Phones stack the cells in
 * source order: greeting, resume card, binders, side column. From lg the resume
 * card spans rows 1–2 on the right while "Your binders" spans rows 2–3 on the
 * left, so the binders start under search however tall the card is.
 */
const HOME_GRID =
  "mx-auto grid max-w-[1180px] gap-y-8 px-4 pb-12 pt-6 sm:px-6 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-x-11 lg:gap-y-10 lg:px-11 lg:pt-10";

export default function Home() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const catalog = useCatalogFilters(user);
  const { allItems, setQuery } = catalog;
  // References, drills, lessons and topics lead the dropdown; the library
  // follows, trimmed so the list stays short.
  const binderHits = useMemo(
    () => searchBinders(catalog.query, new Set(allItems.map((item) => item.id))),
    [catalog.query, allItems],
  );
  const suggestions =
    binderHits.length > 0 ? catalog.searchSuggestions.slice(0, 4) : catalog.searchSuggestions;

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
          <h1 className="hero-title text-3xl text-[color:var(--ink)]">Preparing your library</h1>
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
          <h1 className="hero-title text-4xl text-[color:var(--ink)]">
            Sign in to the Learning Hub
          </h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--ink-muted)]">
            Find MLRI training for Massachusetts legal aid practice, then open it in Brightspace.
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
      <div className={HOME_GRID}>
        <HeroSection
          user={user}
          isAdmin={isAdmin}
          query={catalog.query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          onSelectResult={openSearchResult}
          binderHits={binderHits}
          onSelectBinderHit={(hit) => openBinderHit(hit, catalog.query, router)}
          allItems={allItems}
        />

        <HomeOverview allItems={allItems} />
      </div>
    </StudioShell>
  );
}
