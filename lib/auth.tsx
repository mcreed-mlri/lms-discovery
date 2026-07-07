"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  title: string;
  organization: string;
  unit: string;
  initials: string;
  userType: "attorney" | "non_lawyer_advocate" | "paralegal" | "admin";
  accessStatus: "approved" | "pending" | "suspended" | "inactive";
  jurisdiction: string[];
  practiceArea: string[];
  uplAcknowledgedDate?: string;
  barNumber?: string;
  barJurisdiction?: string[];
};

export const demoUser: User = {
  id: "sarah-chen",
  name: "Sarah Chen",
  firstName: "Sarah",
  email: "s.chen@mlri.org",
  title: "Staff Attorney",
  organization: "MLRI",
  unit: "Housing Unit",
  initials: "SC",
  userType: "attorney",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["housing", "client-services", "ethics"],
  barNumber: "BBO-123456",
  barJurisdiction: ["MA"],
};

export const kevinSmithUser: User = {
  id: "kevin-smith",
  name: "Kevin Smith",
  firstName: "Kevin",
  email: "k.smith@partnerlegalaid.example",
  title: "Non-Practicing Advocate",
  organization: "Demo Legal Aid Partner",
  unit: "Client Services",
  initials: "KS",
  userType: "non_lawyer_advocate",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["client-services", "ethics", "practice-skills"],
  uplAcknowledgedDate: "2026-06-01",
};

export const mlriAdminUser: User = {
  id: "mlri-admin",
  name: "MLRI Admin",
  firstName: "MLRI",
  email: "admin@mlri.example",
  title: "Platform Administrator",
  organization: "MLRI",
  unit: "Learning Platform",
  initials: "MA",
  userType: "admin",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["all"],
};

export const demoUsers = [demoUser, kevinSmithUser, mlriAdminUser];

/**
 * Demo mode keeps the localStorage persona picker as the only login path.
 * Demo users can also be shown alongside Brightspace for stakeholder demos;
 * set NEXT_PUBLIC_SHOW_DEMO_USERS=false to hide them.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const showDemoUsers =
  isDemoMode || process.env.NEXT_PUBLIC_SHOW_DEMO_USERS !== "false";

type AuthState = {
  user: User | null;
  ready: boolean;
  login: (userId?: string) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const STORAGE_KEY = "mlri-demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (showDemoUsers) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
          setReady(true);
          return;
        }
      } catch {
        // ignore malformed storage
      }
    }

    if (isDemoMode) {
      setReady(true);
      return;
    }

    let cancelled = false;

    fetch("/api/me", { cache: "no-store" })
      .then(async (response) => {
        if (cancelled) return;
        if (response.ok) {
          const payload = (await response.json()) as { ok: boolean; user?: User };
          if (payload.ok && payload.user) setUser(payload.user);
        }
      })
      .catch(() => {
        // Signed-out state; login page handles the rest.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function login(userId?: string) {
    if (showDemoUsers && (isDemoMode || userId)) {
      const nextUser =
        demoUsers.find((candidate) => candidate.id === (userId ?? demoUser.id)) ?? demoUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return;
    }

    if (!isDemoMode) {
      window.location.assign("/api/auth/brightspace/start");
      return;
    }
  }

  function logout() {
    if (showDemoUsers) {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (!isDemoMode) {
      void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
        window.location.assign("/login");
      });
      setUser(null);
      return;
    }
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
