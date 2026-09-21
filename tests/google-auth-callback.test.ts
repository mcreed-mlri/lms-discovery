import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, test, vi } from "vitest";

import { GET } from "@/app/api/auth/google/callback/route";
import { resetRateLimitForTests } from "@/lib/rate-limit";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

const ORIGINAL_ENV = { ...process.env };
const STATE = "matching-state-value";
const { rpc, abortSignal } = vi.hoisted(() => ({ rpc: vi.fn(), abortSignal: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient: () => ({ rpc }),
}));

function buildRequest(
  searchParams: Record<string, string>,
  cookie = `google_oauth_state=${STATE}`,
) {
  const url = new URL("https://hub.example/api/auth/google/callback");
  for (const [key, value] of Object.entries(searchParams)) url.searchParams.set(key, value);
  return new NextRequest(url, { headers: cookie ? { cookie } : {} });
}

beforeEach(() => {
  rpc.mockReset().mockReturnValue({ abortSignal });
  abortSignal.mockReset().mockResolvedValue({ error: null });
  resetRateLimitForTests();
  process.env.SESSION_SECRET = "test-secret-not-for-production";
  process.env.GOOGLE_OAUTH_CLIENT_ID = "test-client-id";
  process.env.GOOGLE_OAUTH_CLIENT_SECRET = "test-client-secret";
  process.env.GOOGLE_ALLOWED_DOMAIN = "mlri.org";
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2099-01-01T00:00:00Z";
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllGlobals();
});

test("rejects when the state cookie is missing or mismatched", async () => {
  const response = await GET(buildRequest({ code: "abc", state: "does-not-match" }));
  assert.equal(response.status, 307);
  assert.equal(rpc.mock.calls.length, 0);
  assert.equal(
    new URL(response.headers.get("location")!).searchParams.get("error"),
    "invalid_state",
  );
});

test("rejects once past the demo cutoff, without calling Google", async () => {
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2020-01-01T00:00:00Z";
  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  const response = await GET(buildRequest({ code: "abc", state: STATE }));

  assert.equal(
    new URL(response.headers.get("location")!).searchParams.get("error"),
    "demo_expired",
  );
  assert.equal(fetchSpy.mock.calls.length, 0);
});

test("rejects a Google account outside the allowed domain", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      if (input.includes("tokeninfo")) {
        return new Response(
          JSON.stringify({
            aud: "test-client-id",
            sub: "12345",
            email: "someone@othercompany.example",
            email_verified: "true",
          }),
          { headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ id_token: "fake-id-token" }), {
        headers: { "content-type": "application/json" },
      });
    }),
  );

  const response = await GET(buildRequest({ code: "abc", state: STATE }));
  assert.equal(
    new URL(response.headers.get("location")!).searchParams.get("error"),
    "wrong_domain",
  );
  assert.equal(rpc.mock.calls.length, 0);
});

test("rejects an in-domain account that isn't on the allowed email list", async () => {
  process.env.GOOGLE_ALLOWED_EMAILS =
    "csilva@mlri.org, mcreed@mlri.org, ocarini@mlri.org, anyce@mlri.org";
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      if (input.includes("tokeninfo")) {
        return new Response(
          JSON.stringify({
            aud: "test-client-id",
            sub: "12345",
            email: "someoneelse@mlri.org",
            email_verified: "true",
            hd: "mlri.org",
          }),
          { headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ id_token: "fake-id-token" }), {
        headers: { "content-type": "application/json" },
      });
    }),
  );

  const response = await GET(buildRequest({ code: "abc", state: STATE }));
  assert.equal(new URL(response.headers.get("location")!).searchParams.get("error"), "not_allowed");
  assert.equal(rpc.mock.calls.length, 0);
});

test("allows a listed email through even when GOOGLE_ALLOWED_EMAILS is set", async () => {
  process.env.GOOGLE_ALLOWED_EMAILS =
    "csilva@mlri.org, mcreed@mlri.org, ocarini@mlri.org, anyce@mlri.org";
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      if (input.includes("tokeninfo")) {
        return new Response(
          JSON.stringify({
            aud: "test-client-id",
            sub: "listed-sub",
            email: "mcreed@mlri.org",
            email_verified: "true",
            hd: "mlri.org",
            given_name: "M",
          }),
          { headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ id_token: "fake-id-token" }), {
        headers: { "content-type": "application/json" },
      });
    }),
  );

  const response = await GET(buildRequest({ code: "abc", state: STATE }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://hub.example/");
});

test("a listed email still signs in past the demo cutoff, with the normal session TTL", async () => {
  process.env.GOOGLE_ALLOWED_EMAILS =
    "csilva@mlri.org, mcreed@mlri.org, ocarini@mlri.org, anyce@mlri.org";
  process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT = "2020-01-01T00:00:00Z";
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      if (input.includes("tokeninfo")) {
        return new Response(
          JSON.stringify({
            aud: "test-client-id",
            sub: "listed-sub",
            email: "mcreed@mlri.org",
            email_verified: "true",
            hd: "mlri.org",
            given_name: "M",
          }),
          { headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ id_token: "fake-id-token" }), {
        headers: { "content-type": "application/json" },
      });
    }),
  );

  const response = await GET(buildRequest({ code: "abc", state: STATE }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://hub.example/");

  const sessionCookie = response.cookies.get(SESSION_COOKIE)!;
  assert.ok(sessionCookie.value);
  assert.equal(sessionCookie.maxAge, 60 * 60 * 12);
});

test.each(["success", "database error", "network error"])(
  "signs in and tracks the verified identity: %s",
  async (outcome) => {
    if (outcome === "database error")
      abortSignal.mockResolvedValue({ error: { message: "unavailable" } });
    if (outcome === "network error") abortSignal.mockRejectedValue(new Error("unavailable"));
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        if (input.includes("tokeninfo")) {
          return new Response(
            JSON.stringify({
              aud: "test-client-id",
              sub: "google-sub-1",
              email: "staffer@mlri.org",
              email_verified: "true",
              hd: "mlri.org",
              given_name: "Staffer",
            }),
            { headers: { "content-type": "application/json" } },
          );
        }
        return new Response(JSON.stringify({ id_token: "fake-id-token" }), {
          headers: { "content-type": "application/json" },
        });
      }),
    );

    const response = await GET(buildRequest({ code: "abc", state: STATE }));

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://hub.example/");

    const sessionCookie = response.cookies.get(SESSION_COOKIE)?.value;
    assert.ok(sessionCookie);
    const user = verifySessionToken(sessionCookie, process.env.SESSION_SECRET!);
    assert.equal(user?.provider, "google");
    assert.equal(user?.googleEmail, "staffer@mlri.org");
    assert.equal(user?.brightspaceUserId, "google:google-sub-1");
    assert.equal(rpc.mock.calls.length, 1);
    assert.deepEqual(rpc.mock.calls[0], [
      "record_demo_login",
      {
        p_google_sub: "google-sub-1",
        p_email: "staffer@mlri.org",
      },
    ]);
  },
);
