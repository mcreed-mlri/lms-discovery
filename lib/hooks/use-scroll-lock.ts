"use client";

import { useEffect } from "react";

/* Body scroll lock for overlays, reference counted.

   The naive version — `document.body.style.overflow = "hidden"` on open and
   `= ""` on close — breaks as soon as two overlays can be open at once. The
   detail modal and the Ctrl-K search dialog can overlap: open a course, hit
   Ctrl-K, close the search, and the page behind is scrollable again while the
   modal is still up, because the search's cleanup cleared the modal's lock.

   Counting locks instead means the body only unlocks when the last overlay
   closes. The original overflow value is captured once, when the count goes
   0 -> 1, so we restore whatever the page actually had rather than assuming "".

   Module scope is correct here: there is one <body>, so the count is global,
   not per-component. */

let lockCount = 0;
let previousOverflow: string | null = null;

function acquire() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function release() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow ?? "";
    previousOverflow = null;
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
