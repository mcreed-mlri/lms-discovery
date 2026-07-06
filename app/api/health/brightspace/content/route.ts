import { NextRequest, NextResponse } from "next/server";

import {
  BrightspaceAuthError,
  brightspaceApiFetch,
  getBrightspaceLeVersion,
  type BrightspaceApiResult,
} from "@/lib/brightspace/api";
import {
  summarizeBrightspaceToc,
  type BrightspaceTableOfContents,
} from "@/lib/brightspace/content";
import { applyBrightspaceTokenCookies } from "@/lib/brightspace/tokens";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const orgUnitId = url.searchParams.get("orgUnitId") || "6703";
  const version = url.searchParams.get("version") || getBrightspaceLeVersion();
  const ignoreDateRestrictions = url.searchParams.get("ignoreDateRestrictions") || "true";

  let result: BrightspaceApiResult;

  try {
    result = await brightspaceApiFetch(
      request,
      `/d2l/api/le/${version}/${encodeURIComponent(orgUnitId)}/content/toc?ignoreDateRestrictions=${encodeURIComponent(ignoreDateRestrictions)}`,
    );
  } catch (error) {
    const isAuthError = error instanceof BrightspaceAuthError;
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Brightspace content request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry this content route in the same browser session.",
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
          "Confirm the LE API version, content:toc:read scope, and that the authorized user can view course content.",
      },
      { status: response.status },
    );
  }

  const json = NextResponse.json({
    ok: true,
    orgUnitId,
    version,
    summary: summarizeBrightspaceToc(payload as BrightspaceTableOfContents),
    data: payload,
  });
  if (refreshedTokens) applyBrightspaceTokenCookies(json, refreshedTokens);
  return json;
}
