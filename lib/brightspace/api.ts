import { ACCESS_TOKEN_COOKIE } from "@/lib/brightspace/oauth";
import type { NextRequest } from "next/server";

export function getBrightspaceAccessToken(request: NextRequest) {
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value || process.env.BRIGHTSPACE_ACCESS_TOKEN;
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

export async function brightspaceApiFetch(
  request: NextRequest,
  path: string,
) {
  const baseUrl = getBrightspaceBaseUrl();
  const accessToken = getBrightspaceAccessToken(request);

  if (!baseUrl || !accessToken) {
    throw new Error("Missing Brightspace base URL or access token.");
  }

  return fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
}
