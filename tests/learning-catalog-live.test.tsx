// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import assert from "node:assert/strict";
import { afterEach, test, vi } from "vitest";

import { useLearningCatalog } from "@/lib/hooks/use-learning-catalog";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("live catalog returns only /api/catalog rows, not static learning items", async () => {
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
      Response.json({
        ok: true,
        count: 1,
        items: [
          {
            id: "live-course",
            item_type: "course",
            title: "Live Course",
            description: "Synced from Supabase",
            practice_area: "Housing",
            level: "Foundations",
            duration_label: "20 min",
            brightspace_url: "https://brightspace.example/d2l/home/1",
          },
        ],
      }),
    );
  vi.stubGlobal("fetch", fetch);

  const { result } = renderHook(() =>
    useLearningCatalog({
      userType: "attorney",
      accessStatus: "approved",
      jurisdiction: ["MA"],
    }),
  );

  await waitFor(() => assert.equal(result.current.allItems.length, 1));

  assert.equal(result.current.allItems[0].title, "Live Course");
  assert.equal(result.current.allowMockData, false);
  assert.equal(
    result.current.allItems.some((item) => item.id === "welcome-to-lace"),
    false,
  );
  assert.equal(fetch.mock.calls[1]?.[0], "/api/catalog");
});
