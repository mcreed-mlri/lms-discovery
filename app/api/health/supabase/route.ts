import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("learning_items")
      .select("id,title,item_type,provider")
      .limit(5);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, items: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase health error.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
