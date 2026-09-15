"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * The User type and the demo personas live in lib/auth-constants.ts, not here.
 * This module is "use client", and a server-layer importer (a route handler,
 * proxy.ts) gets client-reference stubs instead of the data — see the header
 * comment there. Re-exported so client call sites keep a single import site,
 * exactly as lib/session.ts:15 re-exports lib/session-constants.ts.
 *
 * Server code must import from "@/lib/auth-constants" directly.
 */
export type { User } from "@/lib/auth-constants";
export {
  demoUser,
  kevinSmithUser,
  mlriAdminUser,
  facultyUser,
  demoUsers,
} from "@/lib/auth-constants";

import { demoUser, demoUsers, type User } from "@/lib/auth-constants";

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
 *
 * NEXT_PUBLIC_* values are inlined into the client bundle only when written as
 * `process.env.NEXT_PUBLIC_*`. Copying `process.env` and reading a property off
 * the copy leaves the browser with `undefined`, so the login cards SSR as
 * buttons and hydrate as dead markup.
 */
export function resolveAuthFlags(
  env?: Partial<Record<"NEXT_PUBLIC_DEMO_MODE" | "NEXT_PUBLIC_SHOW_DEMO_USERS", string>>,
): AuthFlags {
  const isDemoMode =
    (env ? env.NEXT_PUBLIC_DEMO_MODE : process.env.NEXT_PUBLIC_DEMO_MODE) === "true";
  const showPreview =
    (env ? env.NEXT_PUBLIC_SHOW_DEMO_USERS : process.env.NEXT_PUBLIC_SHOW_DEMO_USERS) === "true";
  return {
    isDemoMode,
    showDemoUsers: isDemoMode || showPreview,
    canUseDemoLogin: isDemoMode,
  };
}

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const showDemoUsers = isDemoMode || process.env.NEXT_PUBLIC_SHOW_DEMO_USERS === "true";
export const canUseDemoLogin = isDemoMode;

type AuthState = {
  user: User | null;
  ready: boolean;
  login: (userId?: string) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const STORAGE_KEY = "mlri-demo-user";

/** True for `/login` and `/login/`. Used so demo auto-sign-in does not trap the persona picker. */
export function isLoginPathname(pathname: string) {
  return pathname.replace(/\/+$/, "") === "/login";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (canUseDemoLogin) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          const canonical = demoUsers.find((candidate) => candidate.id === parsed.id);
          const nextUser = canonical ?? parsed;
          if (canonical) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(canonical));
          }
          setUser(nextUser);
          setReady(true);
          return;
        }
      } catch {
        // ignore malformed storage
      }

      // Skip the login screen in local/demo: Google/Brightspace are not
      // required to view the hub. Leave /login alone so "switch user" still
      // works and the e2e login test can drive the persona cards.
      if (!isLoginPathname(window.location.pathname)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
      }
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

    // Hand off to /login rather than a provider start route: HUB_LOGIN_PROVIDER
    // is deliberately server-only (ADR 0012, app/login/page.tsx), so the client
    // cannot know whether Brightspace or Google is the active provider. /login
    // is the one place that already resolves it.
    if (!isDemoMode) {
      window.location.assign("/login");
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
