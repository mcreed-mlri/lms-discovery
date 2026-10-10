"use client";

import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { BinderHit } from "@/lib/binder-search";

type Router = { push: (href: string) => void };

/**
 * Opens a binder search hit and records the pick. Hub pages go through the
 * router; course package pages (/legal-skills-hearsay/….html, often with a
 * #panel anchor) are static files outside the app, so they need a real
 * document navigation.
 */
export function openBinderHit(hit: BinderHit, query: string, router: Router) {
  recordSearchAnalytics({
    type: "search_result_selected",
    query,
    resultId: hit.id,
    resultType: hit.kind,
    resultTitle: hit.title,
  });
  if (/\.html(#|$)/.test(hit.href)) window.location.assign(hit.href);
  else router.push(hit.href);
}
