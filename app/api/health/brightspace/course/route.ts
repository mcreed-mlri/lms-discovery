import { NextRequest, NextResponse } from "next/server";

import {
  BrightspaceAuthError,
  brightspaceApiFetch,
  getBrightspaceLpVersion,
  type BrightspaceApiResult,
} from "@/lib/brightspace/api";
import { applyBrightspaceTokenCookies } from "@/lib/brightspace/tokens";
import { requireAdminSecret } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const denied = requireAdminSecret(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const orgUnitId = url.searchParams.get("orgUnitId");
  const version = url.searchParams.get("version") || getBrightspaceLpVersion();

  if (!orgUnitId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing orgUnitId query parameter.",
        example: "/api/health/brightspace/course?orgUnitId=12345",
      },
      { status: 400 },
    );
  }

  let result: BrightspaceApiResult;

  try {
    result = await brightspaceApiFetch(
      request,
      `/d2l/api/lp/${version}/courses/${encodeURIComponent(orgUnitId)}`,
    );
  } catch (error) {
    const isAuthError = error instanceof BrightspaceAuthError;
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Brightspace course metadata request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry this course metadata route in the same browser session.",
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
        nextStep:
          "Confirm this is a course offering org unit ID and that the authorized user can see course offerings.",
      },
      { status: response.status },
    );
  }

  const json = NextResponse.json({
    ok: true,
    orgUnitId,
    version,
    data: payload,
  });
  if (refreshedTokens) applyBrightspaceTokenCookies(json, refreshedTokens);
  return json;
}
