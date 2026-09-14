import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, STATE_COOKIE } from "@/lib/brightspace/oauth";
import { RETURN_TO_COOKIE } from "@/lib/return-to-cookie";
import { requireSameOriginRequest } from "@/lib/security";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request: Request) {
  const blocked = requireSameOriginRequest(request);
  if (blocked) return blocked;

  const response = NextResponse.json({ ok: true });

  for (const cookie of [
    SESSION_COOKIE,
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    STATE_COOKIE,
    RETURN_TO_COOKIE,
  ]) {
    response.cookies.delete(cookie);
  }

  return response;
}
