import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  getBrightspaceRedirectUri,
  REFRESH_TOKEN_COOKIE,
  STATE_COOKIE,
} from "@/lib/brightspace/oauth";

type BrightspaceTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (error) {
    return NextResponse.json({
      ok: false,
      error,
      errorDescription: url.searchParams.get("error_description"),
    }, { status: 400 });
  }

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json(
      { ok: false, error: "Invalid Brightspace OAuth callback state." },
      { status: 400 },
    );
  }

  const clientId = process.env.BRIGHTSPACE_CLIENT_ID;
  const clientSecret = process.env.BRIGHTSPACE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: "Missing Brightspace OAuth client credentials." },
      { status: 500 },
    );
  }

  const tokenResponse = await fetch("https://auth.brightspace.com/core/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getBrightspaceRedirectUri(),
    }),
    cache: "no-store",
  });

  const tokenPayload = (await tokenResponse.json()) as BrightspaceTokenResponse;

  if (!tokenResponse.ok || tokenPayload.error || !tokenPayload.access_token) {
    return NextResponse.json(
      {
        ok: false,
        error: tokenPayload.error || "Brightspace token exchange failed.",
        errorDescription: tokenPayload.error_description,
      },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    tokenType: tokenPayload.token_type,
    expiresIn: tokenPayload.expires_in,
    scope: tokenPayload.scope,
    hasAccessToken: true,
    hasRefreshToken: Boolean(tokenPayload.refresh_token),
    nextStep: "Return to /my-learning/admin/ to verify the Brightspace token status, then test whoami.",
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokenPayload.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: tokenPayload.expires_in ?? 3600,
    path: "/",
  });

  if (tokenPayload.refresh_token) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokenPayload.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  response.cookies.delete(STATE_COOKIE);
  return response;
}
