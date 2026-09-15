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
 * Fields that grant something. Every one must come from the persona, never from
 * the Google account, or the demo would be handing out access based on who
 * signed in. `lib/access.ts` reads the first four.
 */
const PERSONA_FIELDS = [
  "userType",
  "accessStatus",
  "jurisdiction",
  "uplAcknowledgedDate",
  "id",
  "organization",
  "practiceArea",
  "barNumber",
  "barJurisdiction",
] as const;

/**
 * The regression this pins: /api/me used to import demoUser from lib/auth.tsx,
 * a "use client" module. In the server layer that import resolves to a
 * client-reference stub, so the route answered 200 with the `user` key missing
 * entirely — no error anywhere, and the Google demo login bounced back to
 * /login.
 *
 * The key-set assertion is what catches a stub now that the response is no
 * longer demoUser verbatim: a stub spreads to the override keys alone. Do not
 * relax it to a spot-check. It also forces any field added to demoUser to be
 * classified as identity or entitlement rather than silently inherited.
 */
test("a Google session keeps the staffer's own name and the persona's entitlements", async () => {
  const response = await GET(requestWithSession(googleSession));
  assert.equal(response.status, 200);

  const payload = (await response.json()) as { ok: boolean; user?: User };
  assert.equal(payload.ok, true);
  assert.deepEqual(
    Object.keys(payload.user ?? {}).sort(),
    [...Object.keys(demoUser), "accessLabel"].sort(),
  );

  assert.equal(payload.user?.name, "Staffer");
  assert.equal(payload.user?.firstName, "Staffer");
  assert.equal(payload.user?.initials, "ST");
  assert.equal(payload.user?.title, "MLRI Staff");
  assert.equal(payload.user?.unit, "");
  assert.equal(payload.user?.accessLabel, "Demo access: full catalog");

  // uniqueName is the email on a Google session; it must never become the name.
  assert.notEqual(payload.user?.name, googleSession.uniqueName);
  assert.equal(payload.user?.email, "");

  for (const field of PERSONA_FIELDS) {
    assert.deepEqual(payload.user?.[field], demoUser[field], field);
  }
});

test("two staffers get their own names and identical access", async () => {
  const other: SessionUser = {
    ...googleSession,
    brightspaceUserId: "google:other-sub",
    uniqueName: "other@mlri.org",
    firstName: "Dana",
    lastName: "Reyes",
    googleEmail: "other@mlri.org",
  };

  const [first, second] = await Promise.all([
    GET(requestWithSession(googleSession)).then((r) => r.json() as Promise<{ user: User }>),
    GET(requestWithSession(other)).then((r) => r.json() as Promise<{ user: User }>),
  ]);

  assert.equal(first.user.name, "Staffer");
  assert.equal(second.user.name, "Dana Reyes");
  assert.equal(second.user.initials, "DR");

  for (const field of PERSONA_FIELDS) {
    assert.deepEqual(first.user[field], second.user[field], field);
  }
});

test("a Google session with no given_name falls back to Learner, never the email", async () => {
  // Google's tokeninfo omits given_name for some Workspace accounts; the
  // callback then stores "Learner". A hand-built session can still be empty.
  const nameless: SessionUser = { ...googleSession, firstName: "", lastName: "" };

  const response = await GET(requestWithSession(nameless));
  const payload = (await response.json()) as { user: User };

  assert.equal(payload.user.name, "Learner");
  assert.equal(payload.user.initials, "LE");
  assert.ok(!payload.user.name.includes("@"), "must not fall back to the email address");
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
  // The demo label must never leak onto a real login.
  assert.equal(payload.user?.accessLabel, undefined);
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
