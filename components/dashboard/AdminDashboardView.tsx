"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { PreviewBadge } from "@/components/dashboard/PreviewBadge";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { dashboardService } from "@/lib/services/dashboardService";
import type { AdminDashboardPayload, ServiceHealth } from "@/types/dashboard";

const healthBorder: Record<ServiceHealth, string> = {
  healthy: "border-t-[#6f927b]",
  degraded: "border-t-[#b88a2d]",
  down: "border-t-[#b76545]",
};

const healthDot: Record<ServiceHealth, string> = {
  healthy: "bg-[#6f927b]",
  degraded: "bg-[#b88a2d]",
  down: "bg-[#b76545]",
};

export function AdminDashboardView() {
  const [data, setData] = useState<AdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardService.getAdminDashboard().then((payload) => {
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
    return <div className="animate-pulse grid gap-4 sm:grid-cols-3" aria-busy />;
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Admin"
        title="Integration status"
        subtitle={`Last sync ${formatRelativeDate(data.lastSyncAt)} · ${data.note}`}
        badge={<PreviewBadge />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.services.map((service) => (
          <article
            key={service.id}
            className={`editorial-card border-t-4 p-5 ${healthBorder[service.status]}`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${healthDot[service.status]}`} aria-hidden />
              <h2 className="card-title text-lg">{service.name}</h2>
            </div>
            <p className="stat-label mt-2 text-[#7d7467]">{service.status}</p>
            <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">{service.message}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-[color:var(--ink-muted)]">
        Brightspace and Supabase credentials are never exposed in the browser. Production sync runs server-side only.
      </p>
    </>
  );
}
