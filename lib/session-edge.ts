/**
 * Edge-runtime session verification.
 *
 * `lib/session.ts` uses node:crypto, which is unavailable in Next middleware's
 * Edge runtime. This is the same token format verified with Web Crypto instead,
 * so middleware can check a session without pulling in Node builtins or pinning
 * middleware to a specific runtime.
 *
 * The duplication is deliberate but guarded: tests/session-edge.test.ts asserts
 * this verifier and the Node one agree on the same tokens — valid, tampered,
 * wrong-secret, and expired — so the two cannot silently drift apart.
 *
 * Verification only. Tokens are always minted server-side by lib/session.ts.
 */

const encoder = new TextEncoder();

function base64UrlToBytes(input: string): Uint8Array | null {
  // atob needs standard base64: restore padding and the non-URL alphabet.
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const withPadding = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  try {
    const binary = atob(withPadding);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Constant-time string comparison. `timingSafeEqual` is a node:crypto API, so
 * this is the Edge equivalent: always walk the full length, accumulate
 * differences with a bitwise OR, and never early-return on a mismatch.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Mirrors the SessionUser shape in lib/session.ts. */
export type EdgeSessionUser = {
  brightspaceUserId: string;
  uniqueName: string;
  firstName: string;
  lastName: string;
};

export async function verifySessionTokenEdge(
  token: string | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<EdgeSessionUser | null> {
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const providedSignature = token.slice(separator + 1);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(encoded));
  const expectedSignature = bytesToBase64Url(new Uint8Array(signatureBytes));

  // Signature first, before parsing anything from the payload.
  if (!constantTimeEqual(providedSignature, expectedSignature)) return null;

  const payloadBytes = base64UrlToBytes(encoded);
  if (!payloadBytes) return null;

  let payload: { user?: EdgeSessionUser; exp?: number };
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return null;
  }

  if (typeof payload.exp !== "number" || payload.exp <= nowSeconds) return null;
  if (!payload.user?.brightspaceUserId) return null;

  return payload.user;
}
