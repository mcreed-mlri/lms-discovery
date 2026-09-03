import assert from "node:assert/strict";
import { afterEach, test, vi } from "vitest";

import { dashboardService } from "@/lib/services/dashboardService";
import { learnerDashboardMock } from "@/mocks/dashboard";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("returns seeded dashboard data in mock mode", async () => {
  const fetch = vi.fn(async () =>
    Response.json({
      ok: true,
      dataMode: "mock",
      allowMockData: true,
      allowDemoAccounts: true,
    }),
  );
  vi.stubGlobal("fetch", fetch);

  const result = await dashboardService.getLearnerDashboard({ delayMs: 0 });
  const calls = fetch.mock.calls as unknown[][];

  assert.equal(result.user.displayName, learnerDashboardMock.user.displayName);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.[0], "/api/app-config");
});

test("fetches live dashboard without falling back to mocks", async () => {
  const liveDashboard = {
    ...learnerDashboardMock,
    courses: [],
    summary: { enrolledCount: 0, inProgressCount: 0, completedCount: 0 },
  };
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        ok: true,
        dataMode: "live",
        allowMockData: false,
        allowDemoAccounts: false,
      }),
    )
    .mockResolvedValueOnce(Response.json({ ok: true, dashboard: liveDashboard }));
  vi.stubGlobal("fetch", fetch);

  const result = await dashboardService.getLearnerDashboard({ delayMs: 0 });
  const calls = fetch.mock.calls as unknown[][];

  assert.deepEqual(result.courses, []);
  assert.equal(calls[1]?.[0], "/api/me/dashboard");
});

test("surfaces live dashboard errors instead of returning mocks", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        ok: true,
        dataMode: "live",
        allowMockData: false,
        allowDemoAccounts: false,
      }),
    )
    .mockResolvedValueOnce(
      Response.json({ ok: false, error: "Dashboard source unavailable." }, { status: 503 }),
    );
  vi.stubGlobal("fetch", fetch);

  await assert.rejects(
    () => dashboardService.getLearnerDashboard({ delayMs: 0 }),
    /Dashboard source unavailable/,
  );
});
