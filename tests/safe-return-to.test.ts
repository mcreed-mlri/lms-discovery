import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeReturnTo } from "@/lib/safe-return-to";

/**
 * `returnTo` reaches us from a URL anyone can craft and ends up in a redirect
 * after login, so these cases are the open-redirect boundary. Each rejection
 * below is a real attack shape, not a hypothetical.
 */

// Built by code point rather than written as escapes so the bytes under test are
// unambiguous in source.
const LF = String.fromCharCode(0x0a);
const CR = String.fromCharCode(0x0d);
const TAB = String.fromCharCode(0x09);
const NUL = String.fromCharCode(0x00);
const DEL = String.fromCharCode(0x7f);

test("accepts ordinary in-app destinations", () => {
  for (const value of [
    "/browse/",
    "/my-learning/",
    "/learn/path-trial-readiness/",
    "/browse/?q=housing",
    "/browse/?q=housing#results",
    "/",
  ]) {
    assert.equal(sanitizeReturnTo(value), value, `expected ${value} to be allowed`);
  }
});

test("rejects absolute URLs to another origin", () => {
  for (const value of [
    "https://evil.example/",
    "http://evil.example/",
    "//evil.example/",
    "/\\evil.example",
    "\\\\evil.example",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
  ]) {
    assert.equal(sanitizeReturnTo(value), null, `expected ${value} to be rejected`);
  }
});

test("rejects backslashes anywhere, which some browsers fold into slashes", () => {
  assert.equal(sanitizeReturnTo("/browse\\@evil.example"), null);
  assert.equal(sanitizeReturnTo("/a\\b"), null);
});

test("rejects control characters used for header injection", () => {
  assert.equal(sanitizeReturnTo(`/browse${LF}Location: https://evil.example`), null);
  assert.equal(sanitizeReturnTo(`/browse${CR}${LF}Set-Cookie: a=b`), null);
  assert.equal(sanitizeReturnTo(`/browse${TAB}`), null);
  assert.equal(sanitizeReturnTo(`/browse${NUL}`), null);
  assert.equal(sanitizeReturnTo(`/browse${DEL}`), null);
});

test("rejects API and internal paths as landing destinations", () => {
  assert.equal(sanitizeReturnTo("/api/me"), null);
  assert.equal(sanitizeReturnTo("/api/auth/logout"), null);
  assert.equal(sanitizeReturnTo("/_next/static/chunk.js"), null);
});

test("rejects empty, missing, and oversized values", () => {
  assert.equal(sanitizeReturnTo(null), null);
  assert.equal(sanitizeReturnTo(undefined), null);
  assert.equal(sanitizeReturnTo(""), null);
  assert.equal(sanitizeReturnTo("relative-without-slash"), null);
  assert.equal(sanitizeReturnTo(`/${"a".repeat(600)}`), null);
});

test("normalizes traversal rather than trusting it", () => {
  // ".." is resolved by the URL parser, so the result can never climb above the
  // origin root and cannot be used to reach a disallowed prefix.
  assert.equal(sanitizeReturnTo("/browse/../../etc/passwd"), "/etc/passwd");
  assert.equal(sanitizeReturnTo("/../../.."), "/");
  // A traversal that lands on /api/ is still caught by the prefix check.
  assert.equal(sanitizeReturnTo("/browse/../api/me"), null);
});
