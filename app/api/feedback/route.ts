import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Learner micro-survey intake: the post-completion rating card and the
 * stalled-course nudge both POST here. Target table is Supabase `feedback`
 * (draft: docs/planning/supabase-analytics.sql).
 *
 * Until that table is live (and profiles provide a user_id), inserts will
 * fail — by design this route then returns 202 "accepted, not stored" instead
 * of an error, so the UI never punishes a learner for offering feedback.
 * Payload is validated hard either way: this is an unauthenticated write
 * endpoint, so only whitelisted fields with bounded sizes pass through.
 */

const ALLOWED_FLAGS = new Set([
  // content-quality flags
  "outdated",
  "unclear",
  "not_relevant",
  // abandonment reasons (stalled-course nudge)
  "too_busy",
  "too_long",
  "need_help",
]);

const MAX_NOTES_LENGTH = 600;

type FeedbackBody = {
  courseOfferingId?: unknown;
  rating?: unknown;
  flag?: unknown;
  notes?: unknown;
};

function accepted(reason: string) {
  return NextResponse.json({ ok: true, stored: false, reason }, { status: 202 });
}

export async function POST(request: Request) {
  let body: FeedbackBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const courseOfferingId = typeof body.courseOfferingId === "string" ? body.courseOfferingId : "";
  if (!/^\d{1,10}$/.test(courseOfferingId)) {
    return NextResponse.json({ ok: false, error: "Invalid courseOfferingId." }, { status: 400 });
  }

  const rating = body.rating === undefined ? null : Number(body.rating);
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ ok: false, error: "Rating must be 1-5." }, { status: 400 });
  }

  const flag = body.flag === undefined ? null : String(body.flag);
  if (flag !== null && !ALLOWED_FLAGS.has(flag)) {
    return NextResponse.json({ ok: false, error: "Unknown flag." }, { status: 400 });
  }

  if (rating === null && flag === null) {
    return NextResponse.json({ ok: false, error: "Provide a rating or a flag." }, { status: 400 });
  }

  const notes =
    typeof body.notes === "string" && body.notes.trim()
      ? body.notes.trim().slice(0, MAX_NOTES_LENGTH)
      : null;

  try {
    const supabase = createSupabaseAdminClient();

    // Map the Brightspace offering id onto the catalog row the feedback
    // belongs to; unknown courses are accepted-not-stored, never an error.
    const { data: item } = await supabase
      .from("learning_items")
      .select("id")
      .eq("provider_course_id", courseOfferingId)
      .maybeSingle();

    if (!item) return accepted("Course is not in learning_items yet.");

    // No user_id yet: learner identity attaches when the profiles table lands
    // (see docs/planning/supabase-analytics.sql). Until the feedback table
    // exists and allows this shape, the insert fails into the 202 path.
    const { error } = await supabase.from("feedback").insert({
      item_id: item.id,
      rating,
      flag,
      notes,
    });

    if (error) return accepted(`Not stored: ${error.message}`);

    return NextResponse.json({ ok: true, stored: true });
  } catch {
    // Supabase env not configured (local demo) — accept and move on.
    return accepted("Supabase is not configured.");
  }
}
