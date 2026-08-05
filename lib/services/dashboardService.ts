/**
 * Dashboard data layer — mock today, API tomorrow.
 * Replace mocks with fetch('/api/me/dashboard') in Phase 1 when the server route ships.
 */
import { emptyLearnerDashboardMock, learnerDashboardMock } from "@/mocks/dashboard";
import type { LearnerDashboardPayload } from "@/types/dashboard";

const MOCK_DELAY_MS = 400;

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

async function withMockLatency<T>(loader: () => T, options?: DashboardFetchOptions): Promise<T> {
  await delay(options?.delayMs ?? MOCK_DELAY_MS);
  if (options?.simulateError) {
    throw new Error("Dashboard unavailable. Try again in a moment.");
  }
  return loader();
}

export const dashboardService = {
  async getLearnerDashboard(options?: DashboardFetchOptions): Promise<LearnerDashboardPayload> {
    return withMockLatency(
      () => (options?.empty ? emptyLearnerDashboardMock : learnerDashboardMock),
      options,
    );
  },
};
