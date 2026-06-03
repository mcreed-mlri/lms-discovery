"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { getAccessLabel, getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import type { LaceRole } from "@/types/dashboard";

export function RequireRole({
  allow,
  children,
}: {
  allow: LaceRole[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const effectiveRole = getEffectiveDashboardRole(user);

  if (!allow.includes(effectiveRole)) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-8 text-center">
        <h2 className="section-title text-lg text-[color:var(--ink)]">View not available for this role</h2>
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">
          You are signed in as <strong className="text-[color:var(--brand)]">{user ? getAccessLabel(user.userType) : "Learner"}</strong>.
          Admin tools are only available to the MLRI Admin demo login.
        </p>
        <Link
          href="/my-learning"
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
        >
          Back to My Learning
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
