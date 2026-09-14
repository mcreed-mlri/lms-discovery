import assert from "node:assert/strict";
import { test } from "vitest";

import nextConfig from "@/next.config.mjs";

type Header = {
  key: string;
  value: string;
};

test("applies baseline browser security headers to every route", async () => {
  assert.equal(typeof nextConfig.headers, "function");
  const headersFactory = nextConfig.headers;
  assert.ok(headersFactory);
  const rules = await headersFactory();
  const headers = Object.fromEntries(
    rules[0].headers.map((header: Header) => [header.key, header.value]),
  );

  assert.equal(rules[0].source, "/(.*)");
  assert.match(headers["Content-Security-Policy"], /default-src 'self'/);
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(headers["Permissions-Policy"], /camera=\(\)/);
});
