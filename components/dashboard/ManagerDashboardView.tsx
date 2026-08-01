"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
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
        <div className="h-8 w-48 rounded bg-[color:var(--surface-sunken)]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="editorial-panel h-28 rounded-[var(--radius-card)]" />
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
        <DashboardStat
          label="On track"
          value={String(summary.onTrackCount)}
          detail="Meeting required training pace"
        />
        <DashboardStat
          label="Gaps"
          value={String(summary.gapCount)}
          detail="Incomplete required training"
        />
      </div>

      <div className="editorial-panel overflow-hidden rounded-[var(--radius-card)]">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--line)] text-[color:var(--ink-muted)]">
              <th className="stat-label px-4 py-3">Name</th>
              <th className="stat-label px-4 py-3">Course</th>
              <th className="stat-label px-4 py-3">Completion</th>
              <th className="stat-label px-4 py-3">Last active</th>
              <th className="stat-label px-4 py-3">Gap</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-[color:var(--line)] last:border-0">
                <td className="px-4 py-3 font-bold text-[color:var(--ink-muted)]">{member.name}</td>
                <td className="px-4 py-3 font-medium text-[color:var(--ink-muted)]">
                  {member.course}
                </td>
                <td className="px-4 py-3 font-bold text-[color:var(--brand)]">
                  {member.completionPct}%
                </td>
                <td className="px-4 py-3 font-medium text-[color:var(--ink-muted)]">
                  {formatRelativeDate(member.lastActiveAt)}
                </td>
                <td className="px-4 py-3">
                  {member.hasGap ? (
                    <span className="metadata rounded-full border border-[color:var(--line)] bg-[color:var(--status-updated-soft)] px-2 py-0.5 text-[color:var(--status-updated-ink)]">
                      Gap
                    </span>
                  ) : (
                    <span className="text-[color:var(--ink-muted)]">—</span>
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
