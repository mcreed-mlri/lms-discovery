"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStat } from "@/components/dashboard/DashboardStat";
import { PreviewBadge } from "@/components/dashboard/PreviewBadge";
import { dashboardService } from "@/lib/services/dashboardService";
import type { ProgramDashboardPayload } from "@/types/dashboard";

export function ProgramDashboardView() {
  const [data, setData] = useState<ProgramDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardService.getProgramDashboard().then((payload) => {
      if (!cancelled) {
        setData(payload);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="animate-pulse editorial-panel h-64 rounded-[var(--radius-card)]" aria-busy />
    );
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Program · Phase 3"
        title="Program overview"
        subtitle="Cohort completion and content-gap signals (mock)."
        badge={<PreviewBadge />}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <DashboardStat key={stat.id} label={stat.label} value={stat.value} detail={stat.detail} />
        ))}
      </div>

      <div className="editorial-panel overflow-hidden rounded-[var(--radius-card)]">
        <h2 className="section-kicker secondary border-b border-[color:var(--border-subtle)] px-4 py-3">
          By training area
        </h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--lace-hairline)] text-[color:var(--ink-muted)]">
              <th className="stat-label px-4 py-2">Area</th>
              <th className="stat-label px-4 py-2">Enrolled</th>
              <th className="stat-label px-4 py-2">Completion</th>
            </tr>
          </thead>
          <tbody>
            {data.byArea.map((row) => (
              <tr
                key={row.trainingArea}
                className="border-b border-[color:var(--lace-hairline)] last:border-0"
              >
                <td className="px-4 py-3 font-bold text-[color:var(--ink-muted)]">
                  {row.trainingArea}
                </td>
                <td className="px-4 py-3 font-medium text-[color:var(--ink-muted)]">
                  {row.enrolled}
                </td>
                <td className="px-4 py-3 font-bold text-[color:var(--brand)]">
                  {row.completionRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
