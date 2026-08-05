import assert from "node:assert/strict";
import { test } from "vitest";

import { createSessionToken, verifySessionToken, type SessionUser } from "@/lib/session";
import { verifySessionTokenEdge } from "@/lib/session-edge";

/**
 * The Edge verifier exists because node:crypto is unavailable in middleware.
 * Two implementations of one security check is a drift risk, so these tests
 * assert both reach the SAME verdict on every case rather than testing the
 * Edge one in isolation. If someone changes the token format in lib/session.ts
 * and forgets lib/session-edge.ts, these fail.
 */

const SECRET = "test-secret-value-not-used-anywhere-real";
const OTHER_SECRET = "a-different-secret-of-the-same-sort";

const user: SessionUser = {
  brightspaceUserId: "12345",
  uniqueName: "advocate1",
  firstName: "Ada",
  lastName: "Advocate",
};

/** Assert both verifiers agree, and return the shared verdict. */
async function bothAgree(
  token: string | undefined,
  secret: string,
  nowSeconds?: number,
): Promise<SessionUser | null> {
  const nodeResult = verifySessionToken(token, secret, nowSeconds);
  const edgeResult = await verifySessionTokenEdge(token, secret, nowSeconds);
  assert.deepEqual(
    edgeResult,
    nodeResult,
    "Edge and Node session verifiers disagreed — the token format has drifted",
  );
  return nodeResult;
}

test("edge verifier accepts a token minted by the node signer", async () => {
  const token = createSessionToken(user, SECRET);
  const result = await bothAgree(token, SECRET);
  assert.deepEqual(result, user);
});

test("edge verifier rejects a token signed with a different secret", async () => {
  const token = createSessionToken(user, OTHER_SECRET);
  assert.equal(await bothAgree(token, SECRET), null);
});

test("edge verifier rejects a tampered payload", async () => {
  const token = createSessionToken(user, SECRET);
  const [encoded, signature] = token.split(".");
  const forged = JSON.stringify({
    user: { ...user, brightspaceUserId: "99999" },
    iat: 0,
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const tampered = `${Buffer.from(forged).toString("base64url")}.${signature}`;
  assert.notEqual(tampered, `${encoded}.${signature}`);
  assert.equal(await bothAgree(tampered, SECRET), null);
});

test("edge verifier rejects an expired token", async () => {
  const issuedAt = Math.floor(Date.now() / 1000) - 60 * 60 * 24;
  const token = createSessionToken(user, SECRET, issuedAt);
  assert.equal(await bothAgree(token, SECRET), null);
});

test("edge verifier accepts a token just before expiry", async () => {
  const now = Math.floor(Date.now() / 1000);
  const token = createSessionToken(user, SECRET, now);
  const justBefore = now + 12 * 60 * 60 - 1;
  assert.deepEqual(await bothAgree(token, SECRET, justBefore), user);
});

test("edge verifier rejects malformed and missing tokens", async () => {
  for (const bad of [undefined, "", "no-separator", ".leading-dot", "a.b.c"]) {
    assert.equal(await bothAgree(bad, SECRET), null, `expected rejection for ${String(bad)}`);
  }
});
