import { NextRequest, NextResponse } from "next/server";

import { requireAdminSecret } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  // Uses the service-role client, so this stays operator-only.
  const denied = requireAdminSecret(request);
  if (denied) return denied;

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
