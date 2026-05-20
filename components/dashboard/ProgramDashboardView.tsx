"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardShell";
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
    return <div className="animate-pulse lace-dash-card h-64" aria-busy />;
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

      <div className="lace-dash-card overflow-hidden">
        <h2 className="lace-dash-mono border-b border-[rgba(45,212,191,0.12)] px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider text-[var(--lace-dash-muted)]">
          By training area
        </h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(45,212,191,0.08)] text-[var(--lace-dash-muted)]">
              <th className="lace-dash-mono px-4 py-2 text-[0.62rem] font-medium uppercase tracking-wider">Area</th>
              <th className="lace-dash-mono px-4 py-2 text-[0.62rem] font-medium uppercase tracking-wider">Enrolled</th>
              <th className="lace-dash-mono px-4 py-2 text-[0.62rem] font-medium uppercase tracking-wider">Completion</th>
            </tr>
          </thead>
          <tbody>
            {data.byArea.map((row) => (
              <tr key={row.trainingArea} className="border-b border-[rgba(96,165,250,0.06)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--lace-dash-text)]">{row.trainingArea}</td>
                <td className="px-4 py-3 text-[var(--lace-dash-muted)]">{row.enrolled}</td>
                <td className="px-4 py-3 text-[var(--lace-dash-teal)]">{row.completionRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
