"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Which edge (if any) the track's content carries on past. */
export type ScrollContinues = "none" | "start" | "end" | "both";

/* Reports where a horizontal scroller has more content than it is showing, so
   the edge it continues past can be faded.

   The fade has to be told, not assumed. A fade parked permanently on the right
   is wrong the moment someone scrolls to the end — it then veils the last item
   for no reason — and one parked on both ends is wrong at rest, veiling a first
   item that nothing precedes. Both read as a rendering fault rather than an
   invitation, which is the whole problem with these tracks today.

   A ResizeObserver rather than a window resize listener: these tracks change
   width when a filter changes what is in them, not only when the window moves.
   The children are observed too, because a track whose own box never changes
   can still gain and lose overflow as its contents do. */
export function useScrollEdges<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [continues, setContinues] = useState<ScrollContinues>("none");

  const measure = useCallback(() => {
    const track = ref.current;
    if (!track) return;

    // A pixel of tolerance throughout: fractional layout widths and browser
    // zoom leave scrollLeft a hair short of the end it has plainly reached.
    const room = track.scrollWidth - track.clientWidth;
    if (room <= 1) {
      setContinues("none");
      return;
    }

    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= room - 1;
    setContinues(atStart ? "end" : atEnd ? "start" : "both");
  }, []);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    for (const child of track.children) observer.observe(child);
    return () => observer.disconnect();
  }, [measure]);

  return { ref, continues, onScroll: measure };
}
