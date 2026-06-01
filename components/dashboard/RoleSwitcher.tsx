"use client";

import { useState } from "react";
import { roleLabel, useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

const ROLES: LaceRole[] = ["learner", "manager", "program", "super_admin"];

export function RoleSwitcher() {
  const { role, setRole } = useLaceDevRole();
  const [dismissed, setDismissed] = useState(false);

  // Developer-only affordance: never show it in a production build, and let it
  // be dismissed for the rest of the session during local dev.
  if (process.env.NODE_ENV === "production" || dismissed) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-[var(--radius-card)] border border-[color:var(--border-subtle)] bg-[color:var(--lace-panel)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-md sm:bottom-4 sm:max-w-xs"
      role="region"
      aria-label="Development role switcher"
    >
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="lace-dev-role" className="stat-label text-[#8b909d]">
          Dev role
        </label>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide dev role switcher"
          className="-mr-1 -mt-1 flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
        >
          ✕
        </button>
      </div>
      <select
        id="lace-dev-role"
        value={role}
        onChange={(e) => setRole(e.target.value as LaceRole)}
        className="h-10 w-full rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-raised)] px-3 text-sm font-bold text-[color:var(--ink-muted)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#2a5bff]/15"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {roleLabel(r)}
          </option>
        ))}
      </select>
      <p className="text-xs font-medium text-[color:var(--ink-muted)]">Persists in localStorage · toggles nav</p>
    </div>
  );
}
