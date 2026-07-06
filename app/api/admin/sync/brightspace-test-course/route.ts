import { NextRequest, NextResponse } from "next/server";

import { requireAdminSecret } from "@/lib/admin-auth";
import {
  BrightspaceAuthError,
  brightspaceApiFetch,
  getBrightspaceLpVersion,
  type BrightspaceApiResult,
} from "@/lib/brightspace/api";
import {
  mapBrightspaceCourseToLearningItem,
  type BrightspaceCourseOffering,
} from "@/lib/brightspace/learning-items";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const DEFAULT_TEST_COURSE_ORG_UNIT_ID = "6703";

export async function POST(request: NextRequest) {
  const denied = requireAdminSecret(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const orgUnitId = url.searchParams.get("orgUnitId") || DEFAULT_TEST_COURSE_ORG_UNIT_ID;
  const version = url.searchParams.get("version") || getBrightspaceLpVersion();

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
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry this sync route in the same browser session.",
      },
      { status: isAuthError ? 401 : 500 },
    );
  }

  const { response } = result;
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || !contentType.includes("application/json")) {
    const errorPayload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    return NextResponse.json(
      {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        error: errorPayload,
      },
      { status: response.ok ? 502 : response.status },
    );
  }

  const course = (await response.json()) as BrightspaceCourseOffering;

  const learningItem = mapBrightspaceCourseToLearningItem(course);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("learning_items")
    .upsert(learningItem, { onConflict: "provider_course_id" })
    .select("id,title,item_type,provider,provider_course_id,synced_at")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    orgUnitId,
    version,
    item: data,
  });
}
