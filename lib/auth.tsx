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
  userType: "attorney" | "non_lawyer_advocate" | "paralegal" | "admin" | "faculty";
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

export const facultyUser: User = {
  id: "faculty-demo",
  name: "Faculty",
  firstName: "Faculty",
  email: "faculty@mlri.example",
  title: "Content Creator",
  organization: "MLRI",
  unit: "Curriculum & Content",
  initials: "F",
  userType: "faculty",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["all"],
};

export const demoUsers = [demoUser, kevinSmithUser, mlriAdminUser, facultyUser];

export type AuthFlags = {
  isDemoMode: boolean;
  showDemoUsers: boolean;
  canUseDemoLogin: boolean;
};

/**
 * Demo mode is the only configuration that may trust the localStorage persona
 * picker as an authenticated session. Stakeholder preview cards can be shown
 * beside Brightspace, but they must not bypass /api/me unless the whole app is
 * explicitly running as a demo environment.
 */
export function resolveAuthFlags(
  env?: Partial<Record<"NEXT_PUBLIC_DEMO_MODE" | "NEXT_PUBLIC_SHOW_DEMO_USERS", string>>,
): AuthFlags {
  const source = env ?? process.env;
  const isDemoMode = source.NEXT_PUBLIC_DEMO_MODE === "true";
  return {
    isDemoMode,
    showDemoUsers: isDemoMode || source.NEXT_PUBLIC_SHOW_DEMO_USERS === "true",
    canUseDemoLogin: isDemoMode,
  };
}

export const { isDemoMode, showDemoUsers, canUseDemoLogin } = resolveAuthFlags();

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
    if (canUseDemoLogin) {
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
    if (canUseDemoLogin) {
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
    if (canUseDemoLogin || showDemoUsers) {
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
