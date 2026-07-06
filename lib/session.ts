import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless signed-cookie sessions for Hub login.
 *
 * After the Brightspace OAuth callback verifies the user with whoami, we
 * issue a session cookie: base64url(JSON payload) + "." + HMAC-SHA256
 * signature. No database required; revocation = cookie expiry or rotating
 * SESSION_SECRET (which invalidates every session at once).
 */

export const SESSION_COOKIE = "lace_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export type SessionUser = {
  /** Brightspace user Identifier from whoami. */
  brightspaceUserId: string;
  /** Brightspace login name (UniqueName). */
  uniqueName: string;
  firstName: string;
  lastName: string;
};

type SessionPayload = {
  user: SessionUser;
  /** Issued-at and expiry, unix seconds. */
  iat: number;
  exp: number;
};

export function getSessionSecret() {
  return process.env.SESSION_SECRET || null;
}

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(
  user: SessionUser,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  const payload: SessionPayload = {
    user,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): SessionUser | null {
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const providedSignature = Buffer.from(token.slice(separator + 1));
  const expectedSignature = Buffer.from(sign(encoded, secret));

  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(providedSignature, expectedSignature)
  ) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload.exp !== "number" || payload.exp <= nowSeconds) return null;
  if (!payload.user?.brightspaceUserId) return null;

  return payload.user;
}
