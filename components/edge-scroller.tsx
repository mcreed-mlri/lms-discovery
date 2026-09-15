"use client";

import type { ReactNode } from "react";
import { useScrollEdges } from "@/lib/hooks/use-scroll-edges";

/* A sideways scroller that says so.

   Two elements, not one. The fade is a mask, and a mask clips to the border
   box, which an outline is painted outside of — so a focus ring drawn on the
   masked element does not merely fade at the edges, it disappears entirely,
   trading a legibility fix for a 2.4.7 failure. Verified rather than assumed:
   a crop of the left edge of a masked, outlined box comes back byte-identical
   to the same box with no outline set. So the frame stays unmasked and draws
   the ring; the track inside it scrolls and carries the fade.

   Styles live in globals.css under `.edge-scroller`, including the scroll
   padding that keeps a focused child clear of the fade. */

type EdgeScrollerProps = {
  children: ReactNode;
  /** Classes for the scrolling track — the layout and gutters belong here. */
  className?: string;
  /** Classes for the frame: anything positional, and any `sm:hidden`. */
  frameClassName?: string;
};

/**
 * `focusable` is for a track whose children are not all focusable: a keyboard
 * user has no other way to scroll it (WCAG 2.1.1), which is what axe's
 * scrollable-region-focusable rule asks for. A track made only of buttons or
 * links already reachable by Tab does not need it.
 */
type FocusableProps = EdgeScrollerProps & { focusable?: boolean; label?: string };

export function EdgeScroller({
  children,
  className = "",
  frameClassName = "",
  focusable = false,
  label,
}: FocusableProps) {
  const { ref, continues, onScroll } = useScrollEdges<HTMLDivElement>();

  return (
    <div className={`edge-scroller ${frameClassName}`} data-continues={continues}>
      <div
        aria-label={focusable ? label : undefined}
        className={`edge-scroller-track ${className}`}
        onScroll={onScroll}
        ref={ref}
        role={focusable ? "group" : undefined}
        tabIndex={focusable ? 0 : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/** The same thing where the track is a list and its items carry the order. */
export function EdgeScrollerList({
  children,
  className = "",
  frameClassName = "",
}: EdgeScrollerProps) {
  const { ref, continues, onScroll } = useScrollEdges<HTMLOListElement>();

  return (
    <div className={`edge-scroller ${frameClassName}`} data-continues={continues}>
      <ol className={`edge-scroller-track ${className}`} onScroll={onScroll} ref={ref}>
        {children}
      </ol>
    </div>
  );
}
