import { NextRequest, NextResponse } from "next/server";

import {
  getBrightspaceAuthMode,
  getBrightspaceConfigHealth,
} from "@/lib/brightspace/config";
import { ACCESS_TOKEN_COOKIE } from "@/lib/brightspace/oauth";

export async function GET(request: NextRequest) {
  const configured = getBrightspaceConfigHealth();
  const hasCookieAccessToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);
  configured.accessToken = configured.accessToken || hasCookieAccessToken;
  const mode = getBrightspaceAuthMode(configured);
  const hasIdKeyApp = configured.baseUrl && configured.appId && configured.appKey;
  const hasIdKeyUser = configured.userId && configured.userKey;
  const hasOAuthToken = configured.baseUrl && configured.accessToken;

  if (mode === "id-key") {
    return NextResponse.json({
      ok: hasIdKeyApp && hasIdKeyUser,
      mode,
      configured,
      message: hasIdKeyUser
        ? "Brightspace ID-Key app and user credentials are configured."
        : "Brightspace ID-Key app credentials are configured. User ID/User Key are still needed before API calls can be signed.",
      nextStep: hasIdKeyUser
        ? "Add the Brightspace ID-Key signed request client and call a harmless endpoint."
        : "Generate or obtain Brightspace User ID/User Key, or register a LACE OAuth 2.0 app.",
    });
  }

  if (mode === "oauth") {
    return NextResponse.json({
      ok: hasOAuthToken,
      mode,
      configured,
      message: hasOAuthToken
        ? "Brightspace OAuth access token is configured."
        : "Brightspace OAuth client credentials are configured. Access token is still needed before API calls can be made.",
      nextStep: hasOAuthToken
        ? "Call a harmless Brightspace endpoint such as whoami."
        : "Complete the OAuth flow or obtain a temporary access token.",
    });
  }

  return NextResponse.json({
    ok: false,
    mode,
    configured,
    message: "Brightspace credentials are not configured yet.",
    nextStep: "Add Brightspace ID-Key credentials or OAuth credentials to .env.local.",
  });
}
