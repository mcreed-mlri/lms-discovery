import { NextRequest, NextResponse } from "next/server";
import { recordDemoLogin } from "@/lib/google/login-tracking";

import {
  getGoogleAllowedDomain,
  getGoogleAllowedEmails,
  isGoogleDemoExpiryActive,
  isPastGoogleDemoExpiry,
  secondsUntilGoogleDemoExpiry,
  STATE_COOKIE,
} from "@/lib/google/oauth";
import {
  exchangeGoogleToken,
  verifyGoogleIdToken,
  type GoogleTokenInfo,
} from "@/lib/google/tokens";
import { RETURN_TO_COOKIE } from "@/lib/return-to-cookie";
import { sanitizeReturnTo } from "@/lib/safe-return-to";
import {
  createSessionToken,
  getSessionSecret,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/session";

/** Sends the user back to the login page with a short, non-sensitive error code. */
function loginRedirect(request: NextRequest, errorCode: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", errorCode);
  const response = NextResponse.redirect(url);
  response.cookies.delete(STATE_COOKIE);
  return response;
}

function isAllowedDomain(info: GoogleTokenInfo, allowedDomain: string): boolean {
  if (info.hd) return info.hd.toLowerCase() === allowedDomain.toLowerCase();
  // Some Workspace accounts omit `hd`; fall back to a verified email's domain.
  return (
    info.email_verified === "true" &&
    !!info.email &&
    info.email.toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`)
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (error) {
    console.error(
      "Google OAuth returned an error:",
      error,
      url.searchParams.get("error_description"),
    );
    return loginRedirect(request, "google_denied");
  }

  if (!code || !state || !storedState || state !== storedState) {
    return loginRedirect(request, "invalid_state");
  }

  // Re-checked here (not just at /start) in case the window closed mid-flow.
  // Skipped once GOOGLE_ALLOWED_EMAILS narrows login to named staff — see
  // isGoogleDemoExpiryActive.
  const demoExpiryActive = isGoogleDemoExpiryActive();
  if (demoExpiryActive && isPastGoogleDemoExpiry()) {
    return loginRedirect(request, "demo_expired");
  }

  const sessionSecret = getSessionSecret();
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  if (!sessionSecret || !clientId) {
    console.error(
      "Google login is not fully configured:",
      !sessionSecret ? "SESSION_SECRET is unset." : "",
      !clientId ? "GOOGLE_OAUTH_CLIENT_ID is unset." : "",
    );
    return loginRedirect(request, "misconfigured");
  }

  let tokenPayload: Awaited<ReturnType<typeof exchangeGoogleToken>>;

  try {
    tokenPayload = await exchangeGoogleToken(code);
  } catch (tokenError) {
    console.error("Google token exchange failed:", tokenError);
    return loginRedirect(request, "token_exchange_failed");
  }

  if (tokenPayload.error || !tokenPayload.id_token) {
    console.error(
      "Google token exchange rejected:",
      tokenPayload.error,
      tokenPayload.error_description,
    );
    return loginRedirect(request, "token_exchange_failed");
  }

  const info = await verifyGoogleIdToken(tokenPayload.id_token);

  if (!info || !info.sub || !info.email) {
    console.error("Google ID token verification failed.");
    return loginRedirect(request, "whoami_failed");
  }

  if (info.aud !== clientId) {
    console.error("Google ID token audience mismatch.");
    return loginRedirect(request, "whoami_failed");
  }

  const allowedDomain = getGoogleAllowedDomain();
  if (!isAllowedDomain(info, allowedDomain)) {
    console.error("Google login rejected: account is not in", allowedDomain);
    return loginRedirect(request, "wrong_domain");
  }

  const allowedEmails = getGoogleAllowedEmails();
  if (allowedEmails && !allowedEmails.includes(info.email.toLowerCase())) {
    console.error("Google login rejected: account is not on the allowed list");
    return loginRedirect(request, "not_allowed");
  }

  // Named staff aren't subject to the demo cutoff (see above), so their
  // sessions get the normal TTL instead of being capped to it.
  const sessionTtl = demoExpiryActive
    ? secondsUntilGoogleDemoExpiry(SESSION_TTL_SECONDS)
    : SESSION_TTL_SECONDS;

  const sessionToken = createSessionToken(
    {
      brightspaceUserId: `google:${info.sub}`,
      uniqueName: info.email,
      firstName: info.given_name ?? info.name ?? "Learner",
      lastName: info.family_name ?? "",
      provider: "google",
      googleEmail: info.email,
    },
    sessionSecret,
    Math.floor(Date.now() / 1000),
    sessionTtl,
  );

  const returnTo = sanitizeReturnTo(request.cookies.get(RETURN_TO_COOKIE)?.value);
  const response = NextResponse.redirect(new URL(returnTo ?? "/", request.url));

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: sessionTtl,
    path: "/",
  });

  response.cookies.delete(STATE_COOKIE);
  response.cookies.delete(RETURN_TO_COOKIE);
  await recordDemoLogin(info.sub, info.email);
  return response;
}
