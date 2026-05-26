import { NextRequest, NextResponse } from "next/server";

import {
  brightspaceApiFetch,
  getBrightspaceLpVersion,
} from "@/lib/brightspace/api";

export async function GET(request: NextRequest) {
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

  const response = await brightspaceApiFetch(
    request,
    `/d2l/api/lp/${version}/courses/${encodeURIComponent(orgUnitId)}`,
  );

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
        nextStep: "Confirm this is a course offering org unit ID and that the authorized user can see course offerings.",
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    ok: true,
    orgUnitId,
    version,
    data: payload,
  });
}
