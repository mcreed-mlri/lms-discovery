import assert from "node:assert/strict";
import { test } from "vitest";

import {
  createSessionToken,
  SESSION_TTL_SECONDS,
  verifySessionToken,
  type SessionUser,
} from "@/lib/session";

const secret = "test-secret-not-for-production";

const sessionUser: SessionUser = {
  brightspaceUserId: "12345",
  uniqueName: "s.chen",
  firstName: "Sarah",
  lastName: "Chen",
};

test("round-trips a session token", () => {
  const token = createSessionToken(sessionUser, secret);
  assert.deepEqual(verifySessionToken(token, secret), sessionUser);
});

test("rejects a missing or malformed token", () => {
  assert.equal(verifySessionToken(undefined, secret), null);
  assert.equal(verifySessionToken("", secret), null);
  assert.equal(verifySessionToken("not-a-token", secret), null);
  assert.equal(verifySessionToken("payload.signature", secret), null);
});

test("rejects a token signed with a different secret", () => {
  const token = createSessionToken(sessionUser, "some-other-secret");
  assert.equal(verifySessionToken(token, secret), null);
});

test("rejects a tampered payload", () => {
  const token = createSessionToken(sessionUser, secret);
  const [encoded, signature] = [
    token.slice(0, token.lastIndexOf(".")),
    token.slice(token.lastIndexOf(".") + 1),
  ];
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  payload.user.brightspaceUserId = "99999";
  const tampered = `${Buffer.from(JSON.stringify(payload)).toString("base64url")}.${signature}`;
  assert.equal(verifySessionToken(tampered, secret), null);
});

test("rejects an expired token", () => {
  const issuedAt = Math.floor(Date.now() / 1000) - SESSION_TTL_SECONDS - 1;
  const token = createSessionToken(sessionUser, secret, issuedAt);
  assert.equal(verifySessionToken(token, secret), null);
});

test("accepts a token just before expiry", () => {
  const now = Math.floor(Date.now() / 1000);
  const token = createSessionToken(sessionUser, secret, now);
  assert.deepEqual(verifySessionToken(token, secret, now + SESSION_TTL_SECONDS - 1), sessionUser);
});
