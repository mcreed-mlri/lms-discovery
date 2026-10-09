"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getBinder, getDefaultBinder, locateInBinder, type Binder } from "@/lib/binder";

const STORAGE_KEY = "lace-open-binder";

/* The binder whose dividers the page shows. On a /binder route it is that
   binder and the open divider is known. Anywhere else (Home, My learning,
   Updates) the binder stays as the visitor last left it, like a binder left
   open on the desk, and no divider is open. Before any visit it is the pilot's
   binder.

   The remembered binder lives in localStorage and is read in an effect, so the
   first paint (and SSR) uses the default; see the set-state-in-effect note in
   eslint.config.mjs. */
export function useOpenBinder(): { binder: Binder; tabId: string | null } {
  const pathname = usePathname();
  const located = locateInBinder(pathname);
  const locatedId = located?.binder.id ?? null;
  const [remembered, setRemembered] = useState<Binder | null>(null);

  useEffect(() => {
    if (locatedId) {
      try {
        localStorage.setItem(STORAGE_KEY, locatedId);
      } catch {
        // Storage can be unavailable (private mode); the binder still opens.
      }
      return;
    }
    try {
      const id = localStorage.getItem(STORAGE_KEY);
      const binder = id ? getBinder(id) : undefined;
      if (binder) setRemembered(binder);
    } catch {
      // Fall back to the default binder.
    }
  }, [locatedId]);

  if (located) return located;
  return { binder: remembered ?? getDefaultBinder(), tabId: null };
}
