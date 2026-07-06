import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, STATE_COOKIE } from "@/lib/brightspace/oauth";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const cookie of [SESSION_COOKIE, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, STATE_COOKIE]) {
    response.cookies.delete(cookie);
  }

  return response;
}
