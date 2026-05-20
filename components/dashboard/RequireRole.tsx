"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { roleLabel, useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

export function RequireRole({
  allow,
  children,
}: {
  allow: LaceRole[];
  children: ReactNode;
}) {
  const { role } = useLaceDevRole();

  if (!allow.includes(role)) {
    return (
      <div className="editorial-panel rounded-[var(--radius-card)] p-8 text-center">
        <h2 className="section-title text-lg text-[#171713]">View not available for this role</h2>
        <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">
          You are previewing as <strong className="text-[#9d7a35]">{roleLabel(role)}</strong>. Use the dev role
          switcher (bottom left) or open a view your role can access.
        </p>
        <Link
          href="/my-learning"
          className="mt-6 inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[#171713] px-5 text-sm font-bold text-[#fffaf0] focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15"
        >
          Back to My Learning
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
