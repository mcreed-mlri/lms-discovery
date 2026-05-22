"use client";

import { roleLabel, useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

const ROLES: LaceRole[] = ["learner", "manager", "program", "super_admin"];

export function RoleSwitcher() {
  const { role, setRole } = useLaceDevRole();

  return (
    <div
      className="fixed bottom-20 left-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-[var(--radius-card)] border border-[color:var(--border-subtle)] bg-[color:var(--lace-panel)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-md sm:bottom-4 sm:max-w-xs"
      role="region"
      aria-label="Development role switcher"
    >
      <label htmlFor="lace-dev-role" className="stat-label text-[#7d7467]">
        Dev role
      </label>
      <select
        id="lace-dev-role"
        value={role}
        onChange={(e) => setRole(e.target.value as LaceRole)}
        className="h-10 w-full rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-raised)] px-3 text-sm font-bold text-[color:var(--ink-muted)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[#b88a2d]/15"
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
