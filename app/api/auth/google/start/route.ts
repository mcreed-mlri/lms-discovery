import { NextResponse, type NextRequest } from "next/server";

import {
  createGoogleOAuthState,
  getGoogleAuthorizationUrl,
  isGoogleDemoExpiryActive,
  isPastGoogleDemoExpiry,
  STATE_COOKIE,
} from "@/lib/google/oauth";
import { rateLimitRequest } from "@/lib/rate-limit";
import { RETURN_TO_COOKIE } from "@/lib/return-to-cookie";
import { sanitizeReturnTo } from "@/lib/safe-return-to";

export async function GET(request: NextRequest) {
  const limited = rateLimitRequest(request, {
    name: "google-oauth-start",
    limit: 10,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  // Checked before redirecting to Google at all, so a link kept around past
  // the demo window visibly stops working instead of failing later at the
  // callback. Skipped once GOOGLE_ALLOWED_EMAILS narrows login to named
  // staff — see isGoogleDemoExpiryActive.
  if (isGoogleDemoExpiryActive() && isPastGoogleDemoExpiry()) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "demo_expired");
    return NextResponse.redirect(url);
  }

  try {
    const state = createGoogleOAuthState();
    const response = NextResponse.redirect(getGoogleAuthorizationUrl(state));

    response.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 10 * 60,
      path: "/",
    });

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
    const message = error instanceof Error ? error.message : "Could not start Google OAuth.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
