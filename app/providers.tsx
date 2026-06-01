"use client";

import { AuthProvider } from "@/lib/auth";
import { LaceDevRoleProvider } from "@/lib/lace-dev-role";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("[PWA] Service Worker registered with scope:", reg.scope))
          .catch((err) => console.error("[PWA] Service Worker registration failed:", err));
      });
    }
  }, []);

  return (
    <AuthProvider>
      <LaceDevRoleProvider>{children}</LaceDevRoleProvider>
    </AuthProvider>
  );
}

