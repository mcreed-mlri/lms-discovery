import { ACCESS_TOKEN_COOKIE } from "@/lib/brightspace/oauth";
import {
  getBrightspaceRefreshToken,
  refreshBrightspaceTokens,
  type RefreshedTokens,
} from "@/lib/brightspace/tokens";
import type { NextRequest } from "next/server";

export function getBrightspaceAccessToken(request: NextRequest) {
  // Only the caller's own OAuth cookie. Never fall back to a server-wide
  // token from env: that would let anonymous visitors drive Brightspace
  // API calls with the server's identity.
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
}

export function getBrightspaceBaseUrl() {
  return process.env.BRIGHTSPACE_BASE_URL;
}

export function getBrightspaceLpVersion() {
  return process.env.BRIGHTSPACE_LP_VERSION || "1.49";
}

export function getBrightspaceLeVersion() {
  return process.env.BRIGHTSPACE_LE_VERSION || "1.82";
}

/** Thrown when the caller has no usable Brightspace credentials — map to 401. */
export class BrightspaceAuthError extends Error {}

export type BrightspaceApiResult = {
  response: Response;
  /**
   * Present when the access token was refreshed during this call. Route
   * handlers must persist these via applyBrightspaceTokenCookies so the
   * rotated refresh token is not lost.
   */
  refreshedTokens?: RefreshedTokens;
};

function bearerFetch(baseUrl: string, path: string, accessToken: string) {
  return fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
}

/**
 * Calls the Brightspace API with the caller's own tokens. If the access
 * token is missing or rejected (401) and a refresh token cookie exists,
 * refreshes once and retries.
 */
export async function brightspaceApiFetch(
  request: NextRequest,
  path: string,
): Promise<BrightspaceApiResult> {
  const baseUrl = getBrightspaceBaseUrl();

  if (!baseUrl) {
    throw new Error("Missing Brightspace base URL.");
  }

  const accessToken = getBrightspaceAccessToken(request);

  if (accessToken) {
    const response = await bearerFetch(baseUrl, path, accessToken);
    if (response.status !== 401) return { response };
  }

  const refreshToken = getBrightspaceRefreshToken(request);

  if (!refreshToken) {
    throw new BrightspaceAuthError("Missing Brightspace access token. Sign in first.");
  }

  const refreshedTokens = await refreshBrightspaceTokens(refreshToken);

  if (!refreshedTokens) {
    throw new BrightspaceAuthError("Brightspace token refresh failed. Sign in again.");
  }

  const response = await bearerFetch(baseUrl, path, refreshedTokens.accessToken);
  return { response, refreshedTokens };
}
