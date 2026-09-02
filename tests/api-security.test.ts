import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, test } from "vitest";

import { POST as feedbackPost } from "@/app/api/feedback/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";
import { GET as brightspaceContentGet } from "@/app/api/health/brightspace/content/route";
import { GET as brightspaceCourseGet } from "@/app/api/health/brightspace/course/route";
import { GET as brightspaceWhoamiGet } from "@/app/api/health/brightspace/whoami/route";
import { resetRateLimitForTests } from "@/lib/rate-limit";

const ORIGINAL_ADMIN_SYNC_SECRET = process.env.ADMIN_SYNC_SECRET;

beforeEach(() => {
  delete process.env.ADMIN_SYNC_SECRET;
  resetRateLimitForTests();
});

afterEach(() => {
  if (ORIGINAL_ADMIN_SYNC_SECRET === undefined) {
    delete process.env.ADMIN_SYNC_SECRET;
  } else {
    process.env.ADMIN_SYNC_SECRET = ORIGINAL_ADMIN_SYNC_SECRET;
  }
});

test("Brightspace diagnostic health routes require operator authorization", async () => {
  for (const route of [brightspaceWhoamiGet, brightspaceCourseGet, brightspaceContentGet]) {
    const response = await route(
      new NextRequest("https://hub.example/api/health/brightspace/course?orgUnitId=6703"),
    );
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
  }
});

test("feedback rejects cross-origin posts before reading payload", async () => {
  const response = await feedbackPost(
    new Request("https://hub.example/api/feedback", {
      method: "POST",
      headers: { origin: "https://evil.example" },
      body: "{",
    }),
  );

  assert.equal(response.status, 403);
});

test("logout rejects cross-origin posts", async () => {
  const response = await logoutPost(
    new Request("https://hub.example/api/auth/logout", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    }),
  );

  assert.equal(response.status, 403);
});

test("admin guard rejects cross-site browser posts before privileged work", async () => {
  process.env.ADMIN_SYNC_SECRET = "operator-secret";

  const { POST } = await import("@/app/api/admin/sync/brightspace-test-course/route");
  const response = await POST(
    new NextRequest("https://hub.example/api/admin/sync/brightspace-test-course", {
      method: "POST",
      headers: {
        origin: "https://evil.example",
        "x-admin-secret": "operator-secret",
      },
    }),
  );

  assert.equal(response.status, 403);
});
