import assert from "node:assert/strict";
import { test } from "vitest";

import {
  getSecurityEnvironmentIssues,
  isExplicitDemoDeployment,
  isProductionDeployment,
  requireSameOriginRequest,
} from "@/lib/security";
import { rateLimitRequest, resetRateLimitForTests } from "@/lib/rate-limit";

test("identifies production-like deployments", () => {
  assert.equal(isProductionDeployment({ VERCEL_ENV: "production" }), true);
  assert.equal(isProductionDeployment({ LACE_DEPLOYMENT_KIND: "pilot" }), true);
  assert.equal(isProductionDeployment({ LACE_DEPLOYMENT_KIND: "production" }), true);
  assert.equal(isProductionDeployment({ LACE_DEPLOYMENT_KIND: "demo" }), false);
});

test("requires explicit demo deployment marker before allowing demo auth", () => {
  assert.equal(isExplicitDemoDeployment({ LACE_DEPLOYMENT_KIND: "demo" }), true);
  assert.equal(isExplicitDemoDeployment({ LACE_ALLOW_DEMO_AUTH: "true" }), true);
  assert.equal(isExplicitDemoDeployment({ LACE_DEPLOYMENT_KIND: "pilot" }), false);
});

test("blocks demo auth and missing session secret in production", () => {
  const issues = getSecurityEnvironmentIssues({
    VERCEL_ENV: "production",
    NEXT_PUBLIC_DEMO_MODE: "true",
  });

  assert.deepEqual(
    issues.map((issue) => issue.code),
    ["demo_auth_in_production", "missing_session_secret", "missing_brightspace_scope"],
  );
});

test("allows demo auth only for explicitly marked demo deployments", () => {
  const issues = getSecurityEnvironmentIssues({
    VERCEL_ENV: "production",
    LACE_DEPLOYMENT_KIND: "demo",
    BRIGHTSPACE_OAUTH_SCOPE: "content:toc:read",
    NEXT_PUBLIC_DEMO_MODE: "true",
    SESSION_SECRET: "test-secret",
  });

  assert.deepEqual(issues, []);
});

test("rejects cross-origin state-changing requests", async () => {
  const request = new Request("https://hub.example/api/feedback", {
    method: "POST",
    headers: { origin: "https://evil.example" },
  });

  const response = requireSameOriginRequest(request);
  assert.equal(response?.status, 403);
  assert.deepEqual(await response?.json(), {
    ok: false,
    error: "Cross-origin request rejected.",
  });
});

test("allows same-origin and non-browser state-changing requests", () => {
  assert.equal(
    requireSameOriginRequest(
      new Request("https://hub.example/api/feedback", {
        method: "POST",
        headers: { origin: "https://hub.example" },
      }),
    ),
    null,
  );

  assert.equal(
    requireSameOriginRequest(new Request("https://hub.example/api/feedback", { method: "POST" })),
    null,
  );
});

test("rate limits repeated requests by client ip", async () => {
  resetRateLimitForTests();
  const options = { name: "test", limit: 2, windowMs: 60 * 1000 };

  assert.equal(rateLimitRequest(new Request("https://hub.example/api/feedback"), options), null);
  assert.equal(rateLimitRequest(new Request("https://hub.example/api/feedback"), options), null);

  const response = rateLimitRequest(new Request("https://hub.example/api/feedback"), options);
  assert.equal(response?.status, 429);
  assert.equal(response?.headers.get("Retry-After"), "60");
  assert.deepEqual(await response?.json(), {
    ok: false,
    error: "Too many requests. Try again later.",
  });
});
