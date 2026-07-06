import type { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/brightspace/oauth";

export type BrightspaceTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

export type RefreshedTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

const TOKEN_ENDPOINT = "https://auth.brightspace.com/core/connect/token";

export async function exchangeBrightspaceToken(
  body: URLSearchParams,
): Promise<BrightspaceTokenResponse> {
  const clientId = process.env.BRIGHTSPACE_CLIENT_ID;
  const clientSecret = process.env.BRIGHTSPACE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Brightspace OAuth client credentials.");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Brightspace token endpoint returned ${response.status} with a non-JSON body.`);
  }

  return (await response.json()) as BrightspaceTokenResponse;
}

/**
 * Trades a refresh token for new tokens. Brightspace rotates refresh tokens:
 * the old one is consumed, so callers must persist the returned refresh token
 * or the session dies at the next access-token expiry.
 */
export async function refreshBrightspaceTokens(
  refreshToken: string,
): Promise<RefreshedTokens | null> {
  let payload: BrightspaceTokenResponse;

  try {
    payload = await exchangeBrightspaceToken(
      new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    );
  } catch {
    return null;
  }

  if (payload.error || !payload.access_token) return null;

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresIn: payload.expires_in ?? 3600,
  };
}

export function getBrightspaceRefreshToken(request: NextRequest) {
  return request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
}

export function applyBrightspaceTokenCookies(response: NextResponse, tokens: RefreshedTokens) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: tokens.expiresIn,
    path: "/",
  });

  if (tokens.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
}
