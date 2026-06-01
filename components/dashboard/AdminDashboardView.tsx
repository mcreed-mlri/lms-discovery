"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import type { ServiceHealth } from "@/types/dashboard";

type SupabaseHealthItem = {
  id: string;
  title: string;
  item_type: string;
  provider: string;
};

type SupabaseHealthPayload =
  | {
      ok: true;
      items: SupabaseHealthItem[];
    }
  | {
      ok: false;
      error: string;
    };

type BrightspaceHealthPayload = {
  ok: boolean;
  mode: "id-key" | "oauth" | "unconfigured";
  configured: {
    baseUrl: boolean;
    redirectUri: boolean;
    appId: boolean;
    appKey: boolean;
    userId: boolean;
    userKey: boolean;
    clientId: boolean;
    clientSecret: boolean;
    accessToken: boolean;
  };
  message: string;
  nextStep: string;
};

type BrightspaceSyncPayload =
  | {
      ok: true;
      item: {
        id: string;
        title: string;
        item_type: string;
        provider: string;
        provider_course_id: string;
        synced_at: string;
      };
    }
  | {
      ok: false;
      error: string;
      nextStep?: string;
    };

const healthBorder: Record<ServiceHealth, string> = {
  healthy: "border-t-[#6f927b]",
  degraded: "border-t-[#2a5bff]",
  down: "border-t-[#c8493b]",
};

const healthDot: Record<ServiceHealth, string> = {
  healthy: "bg-[#6f927b]",
  degraded: "bg-[#2a5bff]",
  down: "bg-[#c8493b]",
};

export function AdminDashboardView() {
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealthPayload | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);
  const [brightspaceHealth, setBrightspaceHealth] = useState<BrightspaceHealthPayload | null>(null);
  const [brightspaceLoading, setBrightspaceLoading] = useState(true);
  const [brightspaceSync, setBrightspaceSync] = useState<BrightspaceSyncPayload | null>(null);
  const [brightspaceSyncing, setBrightspaceSyncing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health/supabase/", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as SupabaseHealthPayload;
        if (!response.ok && payload.ok) {
          throw new Error("Supabase health check failed.");
        }
        return payload;
      })
      .catch((error) => ({
        ok: false as const,
        error: error instanceof Error ? error.message : "Supabase health check failed.",
      }))
      .then((payload) => {
        if (!cancelled) {
          setSupabaseHealth(payload);
          setSupabaseLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health/brightspace/", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as BrightspaceHealthPayload;
        if (!response.ok) {
          throw new Error(payload.message || "Brightspace health check failed.");
        }
        return payload;
      })
      .catch((error) => ({
        ok: false,
        mode: "unconfigured" as const,
        configured: {
          baseUrl: false,
          redirectUri: false,
          appId: false,
          appKey: false,
          userId: false,
          userKey: false,
          clientId: false,
          clientSecret: false,
          accessToken: false,
        },
        message: error instanceof Error ? error.message : "Brightspace health check failed.",
        nextStep: "Check the Brightspace health route.",
      }))
      .then((payload) => {
        if (!cancelled) {
          setBrightspaceHealth(payload);
          setBrightspaceLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const supabaseStatus: ServiceHealth = supabaseLoading
    ? "degraded"
    : supabaseHealth?.ok
      ? "healthy"
      : "down";
  const supabaseItems = supabaseHealth?.ok ? supabaseHealth.items : [];
  const brightspaceStatus: ServiceHealth = brightspaceLoading
    ? "degraded"
    : brightspaceHealth?.ok
      ? "healthy"
      : "degraded";

  async function syncBrightspaceTestCourse() {
    setBrightspaceSyncing(true);
    setBrightspaceSync(null);

    try {
      const response = await fetch("/api/admin/sync/brightspace-test-course", {
        method: "POST",
        cache: "no-store",
      });
      const payload = (await response.json()) as BrightspaceSyncPayload;
      setBrightspaceSync(payload);
    } catch (error) {
      setBrightspaceSync({
        ok: false,
        error: error instanceof Error ? error.message : "Brightspace sync failed.",
      });
    } finally {
      setBrightspaceSyncing(false);
    }
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Admin"
        title="Integration status"
        subtitle="Live backend checks for the Learning Hub spike."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className={`editorial-card border-t-4 p-5 ${healthBorder[supabaseStatus]}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${healthDot[supabaseStatus]}`} aria-hidden />
              <h2 className="card-title text-lg">Supabase live connection</h2>
            </div>
            <p className="stat-label text-[#8b909d]">
              {supabaseLoading ? "checking" : supabaseHealth?.ok ? "healthy" : "down"}
            </p>
          </div>

          {supabaseLoading ? (
            <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">
              Checking the Learning Hub server route.
            </p>
          ) : supabaseHealth?.ok ? (
            <div className="mt-4 grid gap-3">
              {supabaseItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-[color:var(--line)] bg-white/70 p-4"
                >
                  <p className="text-sm font-semibold text-[color:var(--ink)]">{item.title}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#8b909d]">
                    {item.provider} / {item.item_type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">
              {supabaseHealth?.error ?? "Supabase health check failed."}
            </p>
          )}
        </article>

        <article className={`editorial-card border-t-4 p-5 ${healthBorder[brightspaceStatus]}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${healthDot[brightspaceStatus]}`} aria-hidden />
              <h2 className="card-title text-lg">Brightspace connection</h2>
            </div>
            <p className="stat-label text-[#8b909d]">
              {brightspaceLoading
                ? "checking"
                : brightspaceHealth?.ok
                  ? "healthy"
                  : "needs auth"}
            </p>
          </div>

          {brightspaceLoading ? (
            <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">
              Checking Brightspace configuration.
            </p>
          ) : brightspaceHealth ? (
            <div className="mt-4 grid gap-4">
              <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                {brightspaceHealth.message}
              </p>
              <div className="grid gap-2 text-sm font-medium text-[color:var(--ink)]">
                <p>Mode: {brightspaceHealth.mode}</p>
                <p>Base URL: {brightspaceHealth.configured.baseUrl ? "configured" : "missing"}</p>
                <p>Redirect URI: {brightspaceHealth.configured.redirectUri ? "configured" : "using default"}</p>
                {brightspaceHealth.mode === "id-key" ? (
                  <>
                    <p>Application ID/Key: {brightspaceHealth.configured.appId && brightspaceHealth.configured.appKey ? "configured" : "missing"}</p>
                    <p>User ID/Key: {brightspaceHealth.configured.userId && brightspaceHealth.configured.userKey ? "configured" : "missing"}</p>
                  </>
                ) : (
                  <>
                    <p>OAuth client: {brightspaceHealth.configured.clientId && brightspaceHealth.configured.clientSecret ? "configured" : "missing"}</p>
                    <p>Access token: {brightspaceHealth.configured.accessToken ? "configured" : "missing"}</p>
                  </>
                )}
              </div>
              <p className="rounded-md border border-[color:var(--line)] bg-white/70 p-4 text-sm font-medium text-[color:var(--ink-muted)]">
                {brightspaceHealth.nextStep}
              </p>
              <button
                type="button"
                onClick={syncBrightspaceTestCourse}
                disabled={brightspaceSyncing || !brightspaceHealth.configured.accessToken}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] transition hover:bg-[#0f1115] disabled:cursor-not-allowed disabled:bg-[#d3d8e0] disabled:text-[#8b909d]"
              >
                {brightspaceSyncing ? "Syncing..." : "Sync test course"}
              </button>
              {brightspaceSync ? (
                <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                  {brightspaceSync.ok
                    ? `Synced ${brightspaceSync.item.title} (${brightspaceSync.item.provider_course_id})`
                    : brightspaceSync.nextStep || brightspaceSync.error}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm font-medium text-[color:var(--ink-muted)]">
              Brightspace health check failed.
            </p>
          )}
        </article>
      </section>

      <p className="mt-8 text-sm font-medium text-[color:var(--ink-muted)]">
        Supabase credentials stay server-side. This page reads through the Learning Hub API route only.
      </p>
    </>
  );
}
