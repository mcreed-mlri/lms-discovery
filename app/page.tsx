"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DetailModal } from "@/components/detail-modal";
import { CatalogSection } from "@/components/home/catalog-section";
import { HeroSection } from "@/components/home/hero-section";
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
  const catalog = useCatalogFilters(user, { previewLimit: 12 });
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

  /**
   * Practice-area rows in the rail and results from the global search dialog both
   * navigate to /?q=<term>&open=<id>#browse. Reading those params through
   * useSearchParams makes this react to the URL changing.
   *
   * It used to read window.location.search once in a mount effect, which meant a
   * push from an already-mounted page had no effect — the effect had already run.
   * StudioShell worked around that by *also* dispatching a
   * "lace-open-learning-item" CustomEvent, so the app carried a DOM event bus in
   * parallel with its own router, and neither half worked alone: the push was
   * needed to survive the navigation, the event to be heard after it. Making the
   * params reactive removes the need for the event entirely.
   */
  const searchParams = useSearchParams();
  const seededQuery = searchParams.get("q");
  const openId = searchParams.get("open");

  useEffect(() => {
    if (seededQuery) setQuery(seededQuery);
  }, [seededQuery, setQuery]);

  useEffect(() => {
    if (!openId) return;
    const match = allItems.find((item) => `${item.type}-${item.id}` === openId);
    if (match) setSelectedItem(match);
  }, [openId, allItems]);

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
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--ink)] px-6 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
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

      <CatalogSection catalog={catalog} onOpenItem={setSelectedItem} seeAllHref="/browse" />

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
      />
    </StudioShell>
  );
}
