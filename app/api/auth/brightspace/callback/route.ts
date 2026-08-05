import { NextRequest, NextResponse } from "next/server";

import { getBrightspaceBaseUrl } from "@/lib/brightspace/api";
import { getBrightspaceRedirectUri, STATE_COOKIE } from "@/lib/brightspace/oauth";
import {
  applyBrightspaceTokenCookies,
  exchangeBrightspaceToken,
  type BrightspaceTokenResponse,
} from "@/lib/brightspace/tokens";
import { RETURN_TO_COOKIE } from "@/lib/return-to-cookie";
import { sanitizeReturnTo } from "@/lib/safe-return-to";
import {
  createSessionToken,
  getSessionSecret,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/session";

type BrightspaceWhoAmI = {
  Identifier?: string;
  FirstName?: string;
  LastName?: string;
  UniqueName?: string;
};

/** Sends the user back to the login page with a short, non-sensitive error code. */
function loginRedirect(request: NextRequest, errorCode: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", errorCode);
  const response = NextResponse.redirect(url);
  response.cookies.delete(STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (error) {
    console.error(
      "Brightspace OAuth returned an error:",
      error,
      url.searchParams.get("error_description"),
    );
    return loginRedirect(request, "brightspace_denied");
  }

  if (!code || !state || !storedState || state !== storedState) {
    return loginRedirect(request, "invalid_state");
  }

  const sessionSecret = getSessionSecret();
  const baseUrl = getBrightspaceBaseUrl();

  if (!sessionSecret || !baseUrl) {
    console.error(
      "Brightspace login is not fully configured:",
      !sessionSecret ? "SESSION_SECRET is unset." : "",
      !baseUrl ? "BRIGHTSPACE_BASE_URL is unset." : "",
    );
    return loginRedirect(request, "misconfigured");
  }

  let tokenPayload: BrightspaceTokenResponse;

  try {
    tokenPayload = await exchangeBrightspaceToken(
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getBrightspaceRedirectUri(),
      }),
    );
  } catch (tokenError) {
    console.error("Brightspace token exchange failed:", tokenError);
    return loginRedirect(request, "token_exchange_failed");
  }

  if (tokenPayload.error || !tokenPayload.access_token) {
    console.error(
      "Brightspace token exchange rejected:",
      tokenPayload.error,
      tokenPayload.error_description,
    );
    return loginRedirect(request, "token_exchange_failed");
  }

  let identity: BrightspaceWhoAmI;

  try {
    const whoamiResponse = await fetch(`${baseUrl}/d2l/api/lp/1.0/users/whoami`, {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!whoamiResponse.ok) {
      console.error("Brightspace whoami failed with status", whoamiResponse.status);
      return loginRedirect(request, "whoami_failed");
    }

    identity = (await whoamiResponse.json()) as BrightspaceWhoAmI;
  } catch (whoamiError) {
    console.error("Brightspace whoami request failed:", whoamiError);
    return loginRedirect(request, "whoami_failed");
  }

  if (!identity.Identifier) {
    console.error("Brightspace whoami returned no Identifier.");
    return loginRedirect(request, "whoami_failed");
  }

  const sessionToken = createSessionToken(
    {
      brightspaceUserId: identity.Identifier,
      uniqueName: identity.UniqueName ?? "",
      firstName: identity.FirstName ?? "",
      lastName: identity.LastName ?? "",
    },
    sessionSecret,
  );

  // Re-sanitize on the way out. The cookie was written by our own start route,
  // but validating again means a single missed check upstream cannot become an
  // open redirect here — and `new URL(path, origin)` keeps us same-origin
  // regardless.
  const returnTo = sanitizeReturnTo(request.cookies.get(RETURN_TO_COOKIE)?.value);
  const response = NextResponse.redirect(new URL(returnTo ?? "/", request.url));

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });

  applyBrightspaceTokenCookies(response, {
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token,
    expiresIn: tokenPayload.expires_in ?? 3600,
  });

  response.cookies.delete(STATE_COOKIE);
  // Consumed — drop it. The error path deliberately leaves it in place so a
  // retry still lands on the originally requested page; it expires in 10 min.
  response.cookies.delete(RETURN_TO_COOKIE);
  return response;
}
