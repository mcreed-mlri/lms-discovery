import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET_HEADER = "x-admin-secret";

/**
 * Guards admin-only API routes with a shared secret.
 *
 * Returns an error response when the caller is not authorized, or null when
 * the request may proceed. Use at the top of admin route handlers:
 *
 *   const denied = requireAdminSecret(request);
 *   if (denied) return denied;
 */
export function requireAdminSecret(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_SYNC_SECRET;

  if (!expected) {
    // Fail closed: without a configured secret, admin routes stay locked.
    return NextResponse.json(
      {
        ok: false,
        error: "Admin routes are disabled because ADMIN_SYNC_SECRET is not configured.",
      },
      { status: 503 },
    );
  }

  const provided = request.headers.get(ADMIN_SECRET_HEADER);

  if (!provided || !secretsMatch(provided, expected)) {
    return NextResponse.json(
      { ok: false, error: `Unauthorized. Provide the correct ${ADMIN_SECRET_HEADER} header.` },
      { status: 401 },
    );
  }

  return null;
}

function secretsMatch(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
