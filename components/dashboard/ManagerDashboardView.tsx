"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardShell";
import { DashboardStat } from "@/components/dashboard/DashboardStat";
import { PreviewBadge } from "@/components/dashboard/PreviewBadge";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { dashboardService } from "@/lib/services/dashboardService";
import type { ManagerDashboardPayload } from "@/types/dashboard";

export function ManagerDashboardView() {
  const [data, setData] = useState<ManagerDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardService.getManagerDashboard().then((payload) => {
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
      <div className="animate-pulse space-y-4" aria-busy>
        <div className="h-8 w-48 rounded bg-[rgba(96,165,250,0.12)]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="lace-dash-card h-28" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, members } = data;

  return (
    <>
      <DashboardPageHeader
        eyebrow="Manager · Phase 3"
        title="Team learning"
        subtitle={`${summary.teamSize} advocates · ${summary.onTrackCount} on track · ${summary.gapCount} with training gaps`}
        badge={<PreviewBadge />}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <DashboardStat label="Team size" value={String(summary.teamSize)} />
        <DashboardStat label="On track" value={String(summary.onTrackCount)} detail="Meeting required training pace" />
        <DashboardStat label="Gaps" value={String(summary.gapCount)} detail="Incomplete required training" />
      </div>

      <div className="lace-dash-card overflow-hidden">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(45,212,191,0.12)] text-[var(--lace-dash-muted)]">
              <th className="lace-dash-mono px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider">Name</th>
              <th className="lace-dash-mono px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider">Course</th>
              <th className="lace-dash-mono px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider">Completion</th>
              <th className="lace-dash-mono px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider">Last active</th>
              <th className="lace-dash-mono px-4 py-3 text-[0.62rem] font-medium uppercase tracking-wider">Gap</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-[rgba(96,165,250,0.08)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--lace-dash-text)]">{member.name}</td>
                <td className="px-4 py-3 text-[var(--lace-dash-muted)]">{member.course}</td>
                <td className="px-4 py-3 text-[var(--lace-dash-cyan)]">{member.completionPct}%</td>
                <td className="px-4 py-3 text-[var(--lace-dash-muted)]">{formatRelativeDate(member.lastActiveAt)}</td>
                <td className="px-4 py-3">
                  {member.hasGap ? (
                    <span className="lace-dash-mono rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.62rem] font-medium uppercase text-amber-300">
                      Gap
                    </span>
                  ) : (
                    <span className="text-[var(--lace-dash-muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
