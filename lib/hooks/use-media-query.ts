"use client";

import { useEffect, useState } from "react";

/* Reads a media query in JS so a component can render ONE tree instead of
   rendering both and hiding one with `sm:hidden` / `hidden sm:grid`.

   The catalog has ~100 items and grows with the curriculum, so the CSS-duplicate
   approach put roughly twice the necessary card instances in the DOM, half of
   them permanently invisible.

   Starts `false` on the server and on first paint, then corrects in an effect,
   so SSR output stays deterministic. Callers should pick the mobile-first
   branch as their `false` case where it matters. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True at Tailwind's `sm` breakpoint and up (640px). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 640px)");
}
