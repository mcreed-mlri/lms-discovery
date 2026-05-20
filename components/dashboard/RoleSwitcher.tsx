"use client";

import { roleLabel, useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

const ROLES: LaceRole[] = ["learner", "manager", "program", "super_admin"];

export function RoleSwitcher() {
  const { role, setRole } = useLaceDevRole();

  return (
    <div
      className="fixed bottom-4 left-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-xl border border-[rgba(45,212,191,0.25)] bg-[rgba(10,22,40,0.94)] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:max-w-xs"
      role="region"
      aria-label="Development role switcher"
    >
      <label htmlFor="lace-dev-role" className="lace-dash-mono text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
        Dev role
      </label>
      <select
        id="lace-dev-role"
        value={role}
        onChange={(e) => setRole(e.target.value as LaceRole)}
        className="h-10 w-full rounded-lg border border-[rgba(96,165,250,0.3)] bg-[rgba(10,22,40,0.8)] px-3 text-sm font-medium text-[var(--lace-dash-text)] outline-none focus:border-[var(--lace-dash-teal)] focus:ring-2 focus:ring-[var(--lace-dash-teal)]/30"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {roleLabel(r)}
          </option>
        ))}
      </select>
      <p className="text-[0.7rem] text-[var(--lace-dash-muted)]">Persists in localStorage · toggles nav</p>
    </div>
  );
}
