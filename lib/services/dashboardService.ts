/**
 * Dashboard data adapter for the pre-pilot build.
 *
 * The production Brightspace content source is not available yet, so this
 * adapter serves representative pilot seed data. Swap the implementation to
 * fetch('/api/me/dashboard') once the live content source and server route are
 * ready.
 */
import { emptyLearnerDashboardMock, learnerDashboardMock } from "@/mocks/dashboard";
import type { DataModeConfig } from "@/lib/data-mode";
import type { LearnerDashboardPayload } from "@/types/dashboard";

const SEED_DATA_DELAY_MS = 400;

export type DashboardFetchOptions = {
  /** Simulate network failure for error-state testing */
  simulateError?: boolean;
  /** Return empty learner payload */
  empty?: boolean;
  delayMs?: number;
};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function getRuntimeDataMode(): Promise<DataModeConfig> {
  const response = await fetch("/api/app-config", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load app data mode.");
  const payload = (await response.json()) as { ok: boolean } & DataModeConfig;
  if (!payload.ok) throw new Error("Could not load app data mode.");
  return payload;
}

async function withSeedDataLatency<T>(
  loader: () => T,
  options?: DashboardFetchOptions,
): Promise<T> {
  await delay(options?.delayMs ?? SEED_DATA_DELAY_MS);
  if (options?.simulateError) {
    throw new Error("Dashboard unavailable. Try again in a moment.");
  }
  return loader();
}

export const dashboardService = {
  async getLearnerDashboard(options?: DashboardFetchOptions): Promise<LearnerDashboardPayload> {
    const mode = await getRuntimeDataMode();
    if (!mode.allowMockData) {
      const response = await fetch("/api/me/dashboard", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        dashboard?: LearnerDashboardPayload;
        error?: string;
      } | null;

      if (!response.ok || !payload?.ok || !payload.dashboard) {
        throw new Error(payload?.error ?? "Dashboard unavailable. Try again in a moment.");
      }

      return payload.dashboard;
    }

    return withSeedDataLatency(
      () => (options?.empty ? emptyLearnerDashboardMock : learnerDashboardMock),
      options,
    );
  },
};
