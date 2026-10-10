"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getBinder, getDefaultBinder, locateInBinder, type Binder } from "@/lib/binder";

const STORAGE_KEY = "lace-open-binder";
const TAB_KEY = "lace-open-tab";

/* The binder whose dividers the page shows. On a /binder route it is that
   binder and the open divider is known. Anywhere else (Home, My learning,
   Updates) the binder stays as the visitor last left it, like a binder left
   open on the desk: no divider is open, and `leftOffTabId` names the one they
   were last on so the dividers can mark it. Before any visit it is the pilot's
   binder with nothing marked.

   The remembered binder lives in localStorage and is read in an effect, so the
   first paint (and SSR) uses the default; see the set-state-in-effect note in
   eslint.config.mjs. */
export function useOpenBinder(): {
  binder: Binder;
  tabId: string | null;
  leftOffTabId: string | null;
} {
  const pathname = usePathname();
  const located = locateInBinder(pathname);
  const locatedId = located?.binder.id ?? null;
  const locatedTabId = located?.tabId ?? null;
  const [remembered, setRemembered] = useState<{ binder: Binder; tabId: string | null } | null>(
    null,
  );

  useEffect(() => {
    if (locatedId) {
      try {
        localStorage.setItem(STORAGE_KEY, locatedId);
        if (locatedTabId) localStorage.setItem(TAB_KEY, locatedTabId);
      } catch {
        // Storage can be unavailable (private mode); the binder still opens.
      }
      return;
    }
    try {
      const id = localStorage.getItem(STORAGE_KEY);
      const binder = id ? getBinder(id) : undefined;
      const tabId = localStorage.getItem(TAB_KEY);
      // A tab id only counts if it belongs to the remembered binder.
      if (binder) {
        setRemembered({
          binder,
          tabId: tabId && binder.tabs.some((tab) => tab.id === tabId) ? tabId : null,
        });
      }
    } catch {
      // Fall back to the default binder.
    }
  }, [locatedId, locatedTabId]);

  if (located) return { ...located, leftOffTabId: null };
  return {
    binder: remembered?.binder ?? getDefaultBinder(),
    tabId: null,
    leftOffTabId: remembered?.tabId ?? null,
  };
}
