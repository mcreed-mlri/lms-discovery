import { NextResponse, type NextRequest } from "next/server";

import {
  createBrightspaceOAuthState,
  getBrightspaceAuthorizationUrl,
  STATE_COOKIE,
} from "@/lib/brightspace/oauth";
import { rateLimitRequest } from "@/lib/rate-limit";
import { RETURN_TO_COOKIE } from "@/lib/return-to-cookie";
import { sanitizeReturnTo } from "@/lib/safe-return-to";

export async function GET(request: NextRequest) {
  const limited = rateLimitRequest(request, {
    name: "brightspace-oauth-start",
    limit: 10,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  try {
    const state = createBrightspaceOAuthState();
    const response = NextResponse.redirect(getBrightspaceAuthorizationUrl(state));

    response.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 10 * 60,
      path: "/",
    });

    // Carry the post-login destination through the OAuth round trip in a cookie
    // rather than the state parameter: Brightspace echoes `state` back verbatim
    // and it is compared for equality, so packing data into it would break that
    // check. Sanitized here and again on the way out — the value originates in a
    // query string, so it is never trusted.
    const returnTo = sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
    if (returnTo) {
      response.cookies.set(RETURN_TO_COOKIE, returnTo, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 10 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Brightspace OAuth.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
