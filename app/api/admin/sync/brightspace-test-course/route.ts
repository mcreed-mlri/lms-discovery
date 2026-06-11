import { NextRequest, NextResponse } from "next/server";

import { requireAdminSecret } from "@/lib/admin-auth";
import { brightspaceApiFetch, getBrightspaceLpVersion } from "@/lib/brightspace/api";
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

  let response: Response;

  try {
    response = await brightspaceApiFetch(
      request,
      `/d2l/api/lp/${version}/courses/${encodeURIComponent(orgUnitId)}`,
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Brightspace course metadata request failed.",
        nextStep:
          "Complete the Brightspace OAuth flow from /api/auth/brightspace/start, then retry this sync route in the same browser session.",
      },
      { status: 500 },
    );
  }

  const course = (await response.json()) as BrightspaceCourseOffering;

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        error: course,
      },
      { status: response.status },
    );
  }

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
