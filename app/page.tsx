"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DetailModal } from "@/components/detail-modal";
import { CatalogSection } from "@/components/home/catalog-section";
import { HeroSection } from "@/components/home/hero-section";
import { PathsSection } from "@/components/home/paths-section";
import { SkillsSection } from "@/components/home/skills-section";
import { StudioShell } from "@/components/studio-shell";
import { getEffectiveDashboardRole } from "@/lib/access";
import { demoUser, useAuth } from "@/lib/auth";
import type { LearningItem } from "@/lib/data";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { SearchResult } from "@/lib/search";
import { useSavedLearning } from "@/lib/saved-learning";

export default function Home() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const savedLearning = useSavedLearning();
  const catalog = useCatalogFilters(user);
  const { allItems, setQuery } = catalog;

  function openSearchResult(result: SearchResult) {
    setQuery(result.item.title);
    setSelectedItem(result.item);
    recordSearchAnalytics({
      type: "search_result_selected",
      query: catalog.query,
      resultId: result.document.id,
      resultType: result.item.type,
      resultTitle: result.item.title,
    });
  }

  // Practice-area rows in the rail link to /?q=<term>#browse. Seed the catalog
  // search from that param on mount so the lens works from any page. (⌘K focus
  // is handled once, app-wide, by StudioShell.)
  useEffect(() => {
    const openById = (id: string | null) => {
      if (!id) return;
      const match = allItems.find((item) => `${item.type}-${item.id}` === id);
      if (match) setSelectedItem(match);
    };

    const params = new URLSearchParams(window.location.search);
    const seeded = params.get("q");
    if (seeded) setQuery(seeded);
    openById(params.get("open"));

    function handleOpenLearningItem(event: Event) {
      const detail = (event as CustomEvent<{ id?: string; query?: string }>).detail;
      if (detail?.query) setQuery(detail.query);
      openById(detail?.id ?? null);
    }

    window.addEventListener("lace-open-learning-item", handleOpenLearningItem);
    return () => window.removeEventListener("lace-open-learning-item", handleOpenLearningItem);
  }, [allItems, setQuery]);

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
          <button
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
            type="button"
            onClick={() => login()}
          >
            Continue as {demoUser.firstName}
          </button>
          <a
            className="mt-4 block text-sm font-bold text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
            href="/login"
          >
            Use the full sign-in page
          </a>
        </div>
      </div>
    );
  }

  return (
    <StudioShell padded={false}>
      <HeroSection
        user={user}
        isAdmin={isAdmin}
        query={catalog.query}
        onQueryChange={setQuery}
        suggestions={catalog.searchSuggestions}
        onSelectResult={openSearchResult}
        allItems={allItems}
      />

      <SkillsSection tiles={catalog.skillTiles} onSelect={catalog.selectSkill} />

      {/* Library before guided paths on mobile for faster content access */}
      <div className="flex flex-col">
        <CatalogSection catalog={catalog} onOpenItem={setSelectedItem} />
        <PathsSection paths={catalog.eligiblePathItems} />
      </div>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
      />
    </StudioShell>
  );
}
