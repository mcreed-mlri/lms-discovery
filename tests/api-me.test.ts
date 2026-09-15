import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, test } from "vitest";

import { GET } from "@/app/api/me/route";
import { demoUser, type User } from "@/lib/auth-constants";
import { createSessionToken, SESSION_COOKIE, type SessionUser } from "@/lib/session";

const ORIGINAL_ENV = { ...process.env };
const SECRET = "test-secret-not-for-production";

function requestWithSession(user: SessionUser | null) {
  const url = new URL("https://hub.example/api/me");
  if (!user) return new NextRequest(url);
  const token = createSessionToken(user, SECRET);
  return new NextRequest(url, { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
}

const googleSession: SessionUser = {
  brightspaceUserId: "google:test-sub",
  uniqueName: "staffer@mlri.org",
  firstName: "Staffer",
  lastName: "",
  provider: "google",
  googleEmail: "staffer@mlri.org",
};

/** `provider` omitted — the backward-compatible shape described in lib/session.ts. */
const brightspaceSession: SessionUser = {
  brightspaceUserId: "12345",
  uniqueName: "s.chen",
  firstName: "Sarah",
  lastName: "Chen",
};

beforeEach(() => {
  process.env.SESSION_SECRET = SECRET;
  delete process.env.HUB_DEFAULT_USER_TYPE;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

/**
 * The regression this pins: /api/me used to import demoUser from lib/auth.tsx,
 * a "use client" module. In the server layer that import resolves to a
 * client-reference stub, so the route answered 200 with the `user` key missing
 * entirely — no error anywhere, and the Google demo login bounced back to
 * /login. Deep-equality against the source object is what catches a stub.
 */
test("a Google-gated session resolves to the full shared demo identity", async () => {
  const response = await GET(requestWithSession(googleSession));
  assert.equal(response.status, 200);

  const payload = (await response.json()) as { ok: boolean; user?: User };
  assert.equal(payload.ok, true);
  assert.deepEqual(payload.user, demoUser);
});

test("a Brightspace session maps to the client User shape", async () => {
  const response = await GET(requestWithSession(brightspaceSession));
  assert.equal(response.status, 200);

  const payload = (await response.json()) as { ok: boolean; user?: User };
  assert.equal(payload.user?.id, "brightspace-12345");
  assert.equal(payload.user?.name, "Sarah Chen");
  assert.equal(payload.user?.initials, "SC");
  // Most-restricted type by default until the UPL access matrix drives mapping.
  assert.equal(payload.user?.userType, "non_lawyer_advocate");
});

test("HUB_DEFAULT_USER_TYPE assigns a type but can never assign admin", async () => {
  process.env.HUB_DEFAULT_USER_TYPE = "paralegal";
  const assigned = await GET(requestWithSession(brightspaceSession));
  assert.equal(((await assigned.json()) as { user: User }).user.userType, "paralegal");

  // Admin capability stays behind server-side secrets, never a login default.
  process.env.HUB_DEFAULT_USER_TYPE = "admin";
  const rejected = await GET(requestWithSession(brightspaceSession));
  assert.equal(((await rejected.json()) as { user: User }).user.userType, "non_lawyer_advocate");
});

test("rejects a request with no session cookie", async () => {
  const response = await GET(requestWithSession(null));
  assert.equal(response.status, 401);
  assert.equal(((await response.json()) as { ok: boolean }).ok, false);
});

test("reports 503 rather than a signed-out state when SESSION_SECRET is missing", async () => {
  const request = requestWithSession(googleSession);
  delete process.env.SESSION_SECRET;

  const response = await GET(request);
  assert.equal(response.status, 503);
});
