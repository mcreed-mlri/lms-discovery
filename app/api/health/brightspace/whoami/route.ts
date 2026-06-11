import { NextRequest, NextResponse } from "next/server";

import {
  brightspaceApiFetch,
  getBrightspaceAccessToken,
  getBrightspaceBaseUrl,
} from "@/lib/brightspace/api";

export async function GET(request: NextRequest) {
  const baseUrl = getBrightspaceBaseUrl();
  const accessToken = getBrightspaceAccessToken(request);

  if (!baseUrl || !accessToken) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Brightspace base URL or access token.",
        nextStep: "Complete the Brightspace OAuth flow from /api/auth/brightspace/start.",
      },
      { status: 500 },
    );
  }

  let response: Response;

  try {
    response = await brightspaceApiFetch(request, "/d2l/api/lp/1.0/users/whoami");
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Brightspace whoami request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry whoami in the same browser session.",
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
      },
      { status: response.status },
    );
  }

  return NextResponse.json({ ok: true, data: payload });
}
