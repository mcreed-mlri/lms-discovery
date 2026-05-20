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
      <div className="lace-dash-card p-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--lace-dash-text)]">View not available for this role</h2>
        <p className="mt-2 text-sm text-[var(--lace-dash-muted)]">
          You are previewing as <strong className="text-[var(--lace-dash-teal)]">{roleLabel(role)}</strong>. Use the dev
          role switcher (bottom left) or open a view your role can access.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-[var(--lace-dash-teal)] px-5 py-2.5 text-sm font-semibold text-[var(--lace-dash-navy)]"
        >
          Back to My Learning
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
