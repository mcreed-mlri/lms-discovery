"use client";

import { useEffect } from "react";

/* Body scroll lock for overlays, reference counted.

   The naive version — `document.body.style.overflow = "hidden"` on open and
   `= ""` on close — breaks as soon as two overlays can be open at once. The
   detail modal and the Ctrl-K search dialog can overlap: open a course, hit
   Ctrl-K, close the search, and the page behind is scrollable again while the
   modal is still up, because the search's cleanup cleared the modal's lock.

   Counting locks instead means the body only unlocks when the last overlay
   closes. The original value is captured once, when the count goes 0 -> 1, so
   we restore whatever the page actually had rather than assuming "".

   Only the vertical axis is touched. The `overflow` shorthand would set both,
   overwriting the `overflow-x: clip` globals.css puts on the body with
   `hidden` — and unlike `clip`, `hidden` makes the body a horizontal scroll
   container, so anything overhanging the viewport behind the overlay becomes
   scrollable instead of staying cut off. Locking the page was never meant to
   unlock an axis.

   Module scope is correct here: there is one <body>, so the count is global,
   not per-component. */

let lockCount = 0;
let previousOverflowY: string | null = null;

function acquire() {
  if (lockCount === 0) {
    previousOverflowY = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
  }
  lockCount += 1;
}

function release() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflowY = previousOverflowY ?? "";
    previousOverflowY = null;
  }
}

/** Locks body scroll while `active` is true. Safe to nest across overlays. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    acquire();
    return release;
  }, [active]);
}
