import { NextRequest, NextResponse } from "next/server";

import { brightspaceApiFetch, getBrightspaceLeVersion } from "@/lib/brightspace/api";
import {
  summarizeBrightspaceToc,
  type BrightspaceTableOfContents,
} from "@/lib/brightspace/content";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const orgUnitId = url.searchParams.get("orgUnitId") || "6703";
  const version = url.searchParams.get("version") || getBrightspaceLeVersion();
  const ignoreDateRestrictions = url.searchParams.get("ignoreDateRestrictions") || "true";

  let response: Response;

  try {
    response = await brightspaceApiFetch(
      request,
      `/d2l/api/le/${version}/${encodeURIComponent(orgUnitId)}/content/toc?ignoreDateRestrictions=${encodeURIComponent(ignoreDateRestrictions)}`,
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Brightspace content request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry this content route in the same browser session.",
      },
      { status: 500 },
    );
  }

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

  return NextResponse.json({
    ok: true,
    orgUnitId,
    version,
    summary: summarizeBrightspaceToc(payload as BrightspaceTableOfContents),
    data: payload,
  });
}
