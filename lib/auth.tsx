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

export const demoUsers = [demoUser, kevinSmithUser];

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
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore malformed storage
    } finally {
      setReady(true);
    }
  }, []);

  function login(userId = demoUser.id) {
    const nextUser = demoUsers.find((candidate) => candidate.id === userId) ?? demoUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
