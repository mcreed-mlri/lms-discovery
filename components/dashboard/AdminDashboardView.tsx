"use client";

import { useEffect, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getAccessLabel } from "@/lib/access";
import { demoUsers } from "@/lib/auth";
import type { ServiceHealth } from "@/types/dashboard";

// The live API surface this account exists to operate and monitor.
const API_ENDPOINTS: {
  method: "GET" | "POST";
  path: string;
  label: string;
  description: string;
}[] = [
  {
    method: "GET",
    path: "/api/health/supabase",
    label: "Supabase health",
    description: "Live connection + sample catalog rows",
  },
  {
    method: "GET",
    path: "/api/health/brightspace",
    label: "Brightspace health",
    description: "Auth mode + credential configuration",
  },
  {
    method: "GET",
    path: "/api/health/brightspace/whoami",
    label: "Brightspace whoami",
    description: "Confirms the authenticated LMS identity",
  },
  {
    method: "GET",
    path: "/api/health/brightspace/course",
    label: "Brightspace course",
    description: "Reads a course offering by id",
  },
  {
    method: "GET",
    path: "/api/health/brightspace/content",
    label: "Brightspace content",
    description: "Reads course content topics",
  },
  {
    method: "POST",
    path: "/api/admin/sync/brightspace-test-course",
    label: "Sync test course",
    description: "Upserts a Brightspace course into Supabase",
  },
  {
    method: "GET",
    path: "/api/auth/brightspace/start",
    label: "Brightspace OAuth start",
    description: "Begins the LMS authorization flow",
  },
];

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
  healthy: "border-t-[color:var(--status-progress)]",
  degraded: "border-t-[color:var(--status-next)]",
  down: "border-t-[color:var(--status-changed)]",
};

const healthDot: Record<ServiceHealth, string> = {
  healthy: "bg-[color:var(--status-progress)]",
  degraded: "bg-[color:var(--status-next)]",
  down: "bg-[color:var(--status-changed)]",
};

export function AdminDashboardView() {
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealthPayload | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);
  const [brightspaceHealth, setBrightspaceHealth] = useState<BrightspaceHealthPayload | null>(null);
  const [brightspaceLoading, setBrightspaceLoading] = useState(true);
  const [brightspaceSync, setBrightspaceSync] = useState<BrightspaceSyncPayload | null>(null);
  const [brightspaceSyncing, setBrightspaceSyncing] = useState(false);

  const adminAccount = demoUsers.find((account) => account.userType === "admin");
  const learnerAccounts = demoUsers.filter((account) => account.userType !== "admin");

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
        eyebrow="Admin console"
        title="Headless data admin"
        subtitle="The service account behind the Learning Hub APIs, health checks, and sync."
      />

      {/* Account identity — what this login is and is not. */}
      <section
        className="editorial-card border-t-4 border-t-[color:var(--ink)] p-5"
        aria-label="Account identity"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[color:var(--ink)] text-base font-bold text-[color:var(--surface)]">
              {adminAccount?.initials ?? "MA"}
            </span>
            <div className="min-w-0">
              <h2 className="card-title text-lg">{adminAccount?.name ?? "MLRI Admin"}</h2>
              <p className="mt-0.5 text-sm font-medium text-[color:var(--ink-muted)]">
                {adminAccount?.title ?? "Platform Administrator"} ·{" "}
                {adminAccount?.email ?? "admin@mlri.example"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[color:var(--status-progress-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--status-progress-ink)]">
            Service account
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[color:var(--ink-muted)]">
          This is a headless operations login — not a learner. It carries no enrollments, progress,
          or personal dashboard. Use it to monitor integrations, exercise the API routes below, and
          manage access for the learner accounts.
        </p>
      </section>

      <h2 className="section-title mt-9 text-lg text-[color:var(--ink)]">
        Live integration status
      </h2>
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className={`editorial-card border-t-4 p-5 ${healthBorder[supabaseStatus]}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${healthDot[supabaseStatus]}`} aria-hidden />
              <h2 className="card-title text-lg">Supabase live connection</h2>
            </div>
            <p className="stat-label text-[color:var(--ink-soft)]">
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
                  className="rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4"
                >
                  <p className="text-sm font-semibold text-[color:var(--ink)]">{item.title}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--ink-soft)]">
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
              <span
                className={`h-2 w-2 rounded-full ${healthDot[brightspaceStatus]}`}
                aria-hidden
              />
              <h2 className="card-title text-lg">Brightspace connection</h2>
            </div>
            <p className="stat-label text-[color:var(--ink-soft)]">
              {brightspaceLoading ? "checking" : brightspaceHealth?.ok ? "healthy" : "needs auth"}
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
                <p>
                  Redirect URI:{" "}
                  {brightspaceHealth.configured.redirectUri ? "configured" : "using default"}
                </p>
                {brightspaceHealth.mode === "id-key" ? (
                  <>
                    <p>
                      Application ID/Key:{" "}
                      {brightspaceHealth.configured.appId && brightspaceHealth.configured.appKey
                        ? "configured"
                        : "missing"}
                    </p>
                    <p>
                      User ID/Key:{" "}
                      {brightspaceHealth.configured.userId && brightspaceHealth.configured.userKey
                        ? "configured"
                        : "missing"}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      OAuth client:{" "}
                      {brightspaceHealth.configured.clientId &&
                      brightspaceHealth.configured.clientSecret
                        ? "configured"
                        : "missing"}
                    </p>
                    <p>
                      Access token:{" "}
                      {brightspaceHealth.configured.accessToken ? "configured" : "missing"}
                    </p>
                  </>
                )}
              </div>
              <p className="rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4 text-sm font-medium text-[color:var(--ink-muted)]">
                {brightspaceHealth.nextStep}
              </p>
              <button
                type="button"
                onClick={syncBrightspaceTestCourse}
                disabled={brightspaceSyncing || !brightspaceHealth.configured.accessToken}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[color:var(--surface-sunken)] disabled:text-[color:var(--ink-soft)]"
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

      {/* API endpoint directory — the surface this account operates. */}
      <h2 className="section-title mt-10 text-lg text-[color:var(--ink)]">API endpoints</h2>
      <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
        Server-side routes for health, identity, and sync. Credentials stay on the server — these
        read through the Learning Hub API only.
      </p>
      <section
        className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--line)]"
        aria-label="API endpoints"
      >
        {API_ENDPOINTS.map((endpoint, index) => (
          <div
            key={endpoint.path}
            className={`flex flex-wrap items-center gap-3 bg-[color:var(--surface)] px-4 py-3 ${
              index > 0 ? "border-t border-[color:var(--line)]" : ""
            }`}
          >
            <span
              className={`inline-flex w-14 shrink-0 items-center justify-center rounded-[7px] px-2 py-1 font-mono text-[11px] font-bold ${
                endpoint.method === "POST"
                  ? "bg-[color:var(--status-changed-soft)] text-[color:var(--status-changed-ink)]"
                  : "bg-[color:var(--surface-sunken)] text-[color:var(--ink-muted)]"
              }`}
            >
              {endpoint.method}
            </span>
            <div className="min-w-[12rem] flex-1">
              <p className="font-mono text-[13px] font-semibold text-[color:var(--ink)]">
                {endpoint.path}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[color:var(--ink-soft)]">
                {endpoint.description}
              </p>
            </div>
            {endpoint.method === "GET" ? (
              <a
                href={endpoint.path}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-xs font-bold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus-ring"
              >
                Open
              </a>
            ) : (
              <span className="shrink-0 rounded-[8px] border border-dashed border-[color:var(--line)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-soft)]">
                POST only
              </span>
            )}
          </div>
        ))}
      </section>

      {/* Demo accounts — who this admin manages access for. */}
      <h2 className="section-title mt-10 text-lg text-[color:var(--ink)]">Demo accounts</h2>
      <p className="mt-1 text-sm font-medium text-[color:var(--ink-muted)]">
        The learner logins this environment ships with, and the access each one resolves to.
      </p>
      <section className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Demo accounts">
        {learnerAccounts.map((account) => (
          <article key={account.id} className="editorial-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] text-sm font-bold text-white">
                {account.initials}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-[color:var(--ink)]">{account.name}</p>
                <p className="truncate text-xs font-medium text-[color:var(--ink-soft)]">
                  {account.title} · {account.organization}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--ink-muted)]">
                {getAccessLabel(account.userType)}
              </span>
              <span className="rounded-full bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--ink-muted)]">
                Access: {account.accessStatus}
              </span>
              {account.jurisdiction.map((region) => (
                <span
                  key={region}
                  className="rounded-full bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--ink-muted)]"
                >
                  {region}
                </span>
              ))}
              {account.uplAcknowledgedDate ? (
                <span className="rounded-full bg-[color:var(--status-progress-soft)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--status-progress-ink)]">
                  UPL acknowledged
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
