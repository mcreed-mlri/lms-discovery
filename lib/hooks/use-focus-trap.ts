"use client";

import { useEffect, useRef } from "react";

/* Keyboard containment for modal dialogs.

   A dialog that only listens for Escape leaves focus behind the overlay: the
   user keeps tabbing through the page under the scrim, where the content is
   visually hidden but still reachable. WCAG 2.4.3 (Focus Order) and 2.1.2 (No
   Keyboard Trap — which requires a *documented* way out, not the absence of
   containment) both want the focus ring inside the dialog while it is open.

   This hook:
     · moves focus to the dialog when it opens (preferring the first control),
     · cycles Tab / Shift+Tab within it,
     · restores focus to the element that opened it on close.

   Returns a ref to attach to the dialog container. */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T | null>(null);
  const restoreToRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    // Remember who opened us so focus can go home afterwards.
    restoreToRef.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        // Skip the full-bleed scrim button; it is a pointer affordance, and
        // landing on it first tells a keyboard user nothing.
        (el) => el.offsetParent !== null && el.dataset.focusSkip !== "true",
      );

    // Prefer a real control; fall back to the container itself.
    const initial = focusables()[0];
    if (initial) {
      initial.focus();
    } else {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }

    // An arrow, not a hoisted `function`: a function declaration is hoisted
    // above the null guard above, so TypeScript widens `container` back to
    // `T | null` inside it.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Wrap at both ends, and pull focus back in if it has escaped entirely.
      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (current === last || !container.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreToRef.current?.focus?.();
    };
  }, [active]);

  return containerRef;
}
