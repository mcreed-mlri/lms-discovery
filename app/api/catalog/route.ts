import { NextResponse } from "next/server";

import { createSupabaseAnonClient } from "@/lib/supabase/server";

/**
 * Public catalog read, backed by Supabase learning_items under RLS (anon key
 * only sees status='active' rows once supabase-rls-learning-items.sql is
 * applied; before that, RLS-without-policies returns an empty list — safe).
 *
 * This is the designed replacement for the hardcoded catalog in lib/data.ts:
 * once learning_items carries the full catalog, point the UI here.
 */
export async function GET() {
  try {
    const supabase = createSupabaseAnonClient();

    const { data, error } = await supabase
      .from("learning_items")
      .select(
        "id,provider,provider_course_id,item_type,title,description,practice_area,level,duration_label,brightspace_url,synced_at",
      )
      .order("title");

    if (error) {
      const needsMigration = error.message.includes("permission denied");
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          nextStep: needsMigration
            ? "Apply docs/planning/supabase-rls-learning-items.sql to grant read access to the anon role."
            : undefined,
        },
        { status: needsMigration ? 503 : 500 },
      );
    }

    return NextResponse.json({ ok: true, count: data.length, items: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown catalog error.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
