/**
 * Dashboard data adapter for the pre-pilot build.
 *
 * The production Brightspace content source is not available yet, so this
 * adapter serves representative pilot seed data. Swap the implementation to
 * fetch('/api/me/dashboard') once the live content source and server route are
 * ready.
 */
import { emptyLearnerDashboardMock, learnerDashboardMock } from "@/mocks/dashboard";
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
    return withSeedDataLatency(
      () => (options?.empty ? emptyLearnerDashboardMock : learnerDashboardMock),
      options,
    );
  },
};
