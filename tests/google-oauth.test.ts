import assert from "node:assert/strict";
import { afterEach, test } from "vitest";

import {
  getGoogleAllowedDomain,
  getGoogleAuthorizationUrl,
  isGoogleDemoExpiryActive,
  isPastGoogleDemoExpiry,
  secondsUntilGoogleDemoExpiry,
} from "@/lib/google/oauth";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test("defaults the allowed domain to mlri.org", () => {
  delete process.env.GOOGLE_ALLOWED_DOMAIN;
  assert.equal(getGoogleAllowedDomain(), "mlri.org");
});

test("builds an authorization URL scoped to the allowed domain", () => {
  process.env.GOOGLE_OAUTH_CLIENT_ID = "test-client-id";
  process.env.GOOGLE_ALLOWED_DOMAIN = "mlri.org";

  const url = new URL(getGoogleAuthorizationUrl("test-state"));

  assert.equal(url.origin + url.pathname, "https://accounts.google.com/o/oauth2/v2/auth");
  assert.equal(url.searchParams.get("client_id"), "test-client-id");
  assert.equal(url.searchParams.get("hd"), "mlri.org");
  assert.equal(url.searchParams.get("state"), "test-state");
});

test("throws without a configured client id", () => {
  delete process.env.GOOGLE_OAUTH_CLIENT_ID;
  assert.throws(() => getGoogleAuthorizationUrl("test-state"));
});

test("treats an unset cutoff as already expired — safe by default", () => {
  delete process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT;
  assert.equal(isPastGoogleDemoExpiry(), true);
});

test("treats an invalid cutoff as already expired", () => {
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "not-a-date";
  assert.equal(isPastGoogleDemoExpiry(), true);
});

test("is not expired before the cutoff, and is expired after it", () => {
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2026-09-23T00:00:00Z";
  assert.equal(isPastGoogleDemoExpiry(new Date("2026-09-22T23:59:59Z")), false);
  assert.equal(isPastGoogleDemoExpiry(new Date("2026-09-23T00:00:00Z")), true);
  assert.equal(isPastGoogleDemoExpiry(new Date("2026-09-24T00:00:00Z")), true);
});

test("caps the session TTL to the remaining time before cutoff", () => {
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2026-09-23T00:00:10Z";
  const now = new Date("2026-09-23T00:00:00Z");
  assert.equal(secondsUntilGoogleDemoExpiry(12 * 60 * 60, now), 10);
});

test("never returns a negative TTL for a cutoff already passed", () => {
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2026-09-22T00:00:00Z";
  const now = new Date("2026-09-23T00:00:00Z");
  assert.equal(secondsUntilGoogleDemoExpiry(12 * 60 * 60, now), 0);
});

test("the demo cutoff is active without an allowed-emails list", () => {
  delete process.env.GOOGLE_ALLOWED_EMAILS;
  assert.equal(isGoogleDemoExpiryActive(), true);
});

test("the demo cutoff stops applying once GOOGLE_ALLOWED_EMAILS is set", () => {
  process.env.GOOGLE_ALLOWED_EMAILS = "mcreed@mlri.org";
  assert.equal(isGoogleDemoExpiryActive(), false);
});
