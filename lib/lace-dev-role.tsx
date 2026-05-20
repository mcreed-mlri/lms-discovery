"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LaceRole } from "@/types/dashboard";

const STORAGE_KEY = "lace-dev-role";

const ALL_ROLES: LaceRole[] = ["learner", "manager", "program", "super_admin"];

type LaceDevRoleContextValue = {
  role: LaceRole;
  setRole: (role: LaceRole) => void;
};

const LaceDevRoleContext = createContext<LaceDevRoleContextValue | null>(null);

function readStoredRole(): LaceRole {
  if (typeof window === "undefined") return "learner";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && ALL_ROLES.includes(stored as LaceRole)) {
    return stored as LaceRole;
  }
  return "learner";
}

export function LaceDevRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<LaceRole>("learner");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRoleState(readStoredRole());
    setHydrated(true);
  }, []);

  const setRole = useCallback((next: LaceRole) => {
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  if (!hydrated) {
    return <LaceDevRoleContext.Provider value={{ role: "learner", setRole }}>{children}</LaceDevRoleContext.Provider>;
  }

  return <LaceDevRoleContext.Provider value={value}>{children}</LaceDevRoleContext.Provider>;
}

export function useLaceDevRole() {
  const ctx = useContext(LaceDevRoleContext);
  if (!ctx) {
    throw new Error("useLaceDevRole must be used within LaceDevRoleProvider");
  }
  return ctx;
}

export function roleLabel(role: LaceRole): string {
  const labels: Record<LaceRole, string> = {
    learner: "Learner",
    manager: "Manager",
    program: "Program",
    super_admin: "Super admin",
  };
  return labels[role];
}
