import { NextResponse } from "next/server";

import {
  createBrightspaceOAuthState,
  getBrightspaceAuthorizationUrl,
  STATE_COOKIE,
} from "@/lib/brightspace/oauth";

export async function GET() {
  try {
    const state = createBrightspaceOAuthState();
    const response = NextResponse.redirect(getBrightspaceAuthorizationUrl(state));

    response.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 10 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start Brightspace OAuth.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
