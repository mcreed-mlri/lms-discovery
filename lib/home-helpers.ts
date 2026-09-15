export function scrollToBrowse() {
  document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Catalog lives on /browse. Home search, skill tiles, and Ctrl-K all land here. */
export function browseHref({
  q,
  open,
  skill,
}: {
  q?: string | null;
  open?: string | null;
  skill?: string | null;
} = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (open) params.set("open", open);
  if (skill) params.set("skill", skill);
  const query = params.toString();
  return query ? `/browse?${query}` : "/browse";
}

export function resumeMinutesLeftLabel(duration?: string) {
  if (!duration) return null;
  return `${duration.replace(/\s*min\s*$/i, "").trim()} min left`.toUpperCase();
}
