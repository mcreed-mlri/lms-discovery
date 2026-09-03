import { NextRequest, NextResponse } from "next/server";

import { getSessionSecret, SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const secret = getSessionSecret();

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Dashboard is disabled because SESSION_SECRET is not configured." },
      { status: 503 },
    );
  }

  const sessionUser = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, secret);

  if (!sessionUser) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const displayName = [sessionUser.firstName, sessionUser.lastName].filter(Boolean).join(" ");

  return NextResponse.json({
    ok: true,
    dashboard: {
      user: {
        id: `brightspace-${sessionUser.brightspaceUserId}`,
        displayName: displayName || sessionUser.uniqueName || "Learner",
        email: "",
        laceRole: "learner",
      },
      summary: {
        enrolledCount: 0,
        inProgressCount: 0,
        completedCount: 0,
      },
      courses: [],
      recentActivity: [],
      certificates: [],
      activityHeatmap: [],
      weeklySparkline: [],
    },
  });
}
