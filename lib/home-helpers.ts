export function scrollToBrowse() {
  document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function resumeMinutesLeftLabel(duration?: string) {
  if (!duration) return null;
  return `${duration.replace(/\s*min\s*$/i, "").trim()} min left`.toUpperCase();
}
