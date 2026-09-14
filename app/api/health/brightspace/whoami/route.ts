import { NextRequest, NextResponse } from "next/server";

import {
  BrightspaceAuthError,
  brightspaceApiFetch,
  type BrightspaceApiResult,
} from "@/lib/brightspace/api";
import { applyBrightspaceTokenCookies } from "@/lib/brightspace/tokens";
import { requireAdminSecret } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const denied = requireAdminSecret(request);
  if (denied) return denied;

  let result: BrightspaceApiResult;

  try {
    result = await brightspaceApiFetch(request, "/d2l/api/lp/1.0/users/whoami");
  } catch (error) {
    const isAuthError = error instanceof BrightspaceAuthError;
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Brightspace whoami request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry whoami in the same browser session.",
      },
      { status: isAuthError ? 401 : 500 },
    );
  }

  const { response, refreshedTokens } = result;
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        error: payload,
      },
      { status: response.status },
    );
  }

  const json = NextResponse.json({ ok: true, data: payload });
  if (refreshedTokens) applyBrightspaceTokenCookies(json, refreshedTokens);
  return json;
}
