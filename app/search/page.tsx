"use client";

import { useSearchParams } from "next/navigation";

import { SearchResultsView } from "@/components/search-results-view";

/** /search?q=…&in=<binder>: the full results for a query. */
export default function SearchPage() {
  const searchParams = useSearchParams();
  return (
    <SearchResultsView
      // A new scope is a new search; a new query is handled inside the view.
      key={searchParams.get("in") ?? ""}
      initialQuery={searchParams.get("q") ?? ""}
      scopeBinderId={searchParams.get("in") ?? undefined}
    />
  );
}
