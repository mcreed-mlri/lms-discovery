"use client";

import { useState } from "react";

import { DetailModal } from "@/components/detail-modal";
import { CatalogSection } from "@/components/home/catalog-section";
import { SearchBox } from "@/components/search-box";
import { StudioShell } from "@/components/studio-shell";
import { useAuth } from "@/lib/auth";
import type { LearningItem } from "@/lib/data";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";
import { useSavedLearning } from "@/lib/saved-learning";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { SearchResult } from "@/lib/search";

// Dedicated discovery surface: the full catalog (no homepage preview cap) with
// search + refine. StudioShell handles the auth gate and loading state.
export default function BrowsePage() {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const savedLearning = useSavedLearning();
  const catalog = useCatalogFilters(user);
  const { setQuery } = catalog;

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

  return (
    <StudioShell padded={false}>
      <div className="mx-auto max-w-[1120px] px-4 pt-6 sm:px-6 sm:pt-9 lg:px-10">
        <p className="section-kicker secondary">Discover</p>
        <h1 className="hero-title mt-1 text-3xl text-[color:var(--ink)] sm:text-4xl">
          Browse the catalog
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--ink-muted)]">
          Every course, module, and learning path across the LACE curriculum. Search or refine to
          find what fits the case in front of you.
        </p>
        <div className="mt-5">
          <SearchBox
            value={catalog.query}
            onChange={setQuery}
            suggestions={catalog.searchSuggestions}
            onSelect={openSearchResult}
            prominent
          />
        </div>
      </div>

      <CatalogSection catalog={catalog} onOpenItem={setSelectedItem} hideHeading />

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isSaved={selectedItem ? savedLearning.isSaved(selectedItem) : false}
        onToggleSaved={savedLearning.toggleSaved}
      />
    </StudioShell>
  );
}
