"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardShell";
import { PreviewBadge } from "@/components/dashboard/PreviewBadge";
import { formatRelativeDate } from "@/lib/dashboard-utils";
import { dashboardService } from "@/lib/services/dashboardService";
import type { AdminDashboardPayload, ServiceHealth } from "@/types/dashboard";

const healthStyles: Record<ServiceHealth, string> = {
  healthy: "border-[rgba(45,212,191,0.4)] text-[var(--lace-dash-teal)]",
  degraded: "border-amber-400/50 text-amber-300",
  down: "border-red-400/50 text-red-300",
};

const healthDot: Record<ServiceHealth, string> = {
  healthy: "bg-[var(--lace-dash-teal)]",
  degraded: "bg-amber-400",
  down: "bg-red-400",
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
          <article key={service.id} className={`lace-dash-card border-t-2 p-5 ${healthStyles[service.status]}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${healthDot[service.status]}`} aria-hidden />
              <h2 className="font-semibold text-[var(--lace-dash-text)]">{service.name}</h2>
            </div>
            <p className="lace-dash-mono mt-2 text-[0.62rem] font-medium uppercase tracking-wider opacity-80">
              {service.status}
            </p>
            <p className="mt-3 text-sm text-[var(--lace-dash-muted)]">{service.message}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--lace-dash-muted)]">
        Brightspace and Supabase credentials are never exposed in the browser. Production sync runs server-side only.
      </p>
    </>
  );
}
