import assert from "node:assert/strict";
import { test } from "vitest";

import { resolveDataMode } from "@/lib/data-mode";

test("defaults local development to mock data mode", () => {
  assert.deepEqual(resolveDataMode({}), {
    dataMode: "mock",
    allowMockData: true,
    allowDemoAccounts: false,
  });
});

test("mock mode allows demo accounts only when demo auth is explicit", () => {
  assert.deepEqual(
    resolveDataMode({
      LACE_DATA_MODE: "mock",
      NEXT_PUBLIC_DEMO_MODE: "true",
    }),
    {
      dataMode: "mock",
      allowMockData: true,
      allowDemoAccounts: true,
    },
  );
});

test("live mode disables mock data and demo accounts", () => {
  assert.deepEqual(
    resolveDataMode({
      LACE_DATA_MODE: "live",
      NEXT_PUBLIC_DEMO_MODE: "true",
      NEXT_PUBLIC_SHOW_DEMO_USERS: "true",
    }),
    {
      dataMode: "live",
      allowMockData: false,
      allowDemoAccounts: false,
    },
  );
});
