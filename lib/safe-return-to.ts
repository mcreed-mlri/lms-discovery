/**
 * Validation for the post-login `returnTo` destination.
 *
 * Middleware puts the requested path on the /login URL so a deep link survives
 * sign-in. That value is attacker-controlled: anyone can hand out a link like
 * /login?returnTo=https://evil.example, and if the OAuth callback redirected
 * there we would have an open redirect wearing our own domain — the classic
 * phishing primitive against a login flow.
 *
 * So: only same-origin, path-absolute destinations survive. Anything else
 * degrades to null, and callers fall back to "/".
 */

/** Routes that are never a sensible place to land a human after login. */
const DISALLOWED_PREFIXES = ["/api/", "/_next/"];

export function sanitizeReturnTo(value: string | null | undefined): string | null {
  if (typeof value !== "string" || value.length === 0) return null;

  // Cap the length — nothing legitimate is this long, and it bounds the work below.
  if (value.length > 512) return null;

  // Must be path-absolute. A leading "//" (or "/\") is protocol-relative and
  // browsers resolve it to another host, so it is an absolute URL in disguise.
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;

  // Backslashes get normalized to forward slashes by some browsers, which can
  // turn "/\evil.example" into a host. Reject them outright.
  if (value.includes("\\")) return null;

  // Control characters (newlines especially) have no business in a path and are
  // a header-injection vector. Checked by code point rather than by regex so the
  // range is unambiguous in source and needs no lint exemption.
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return null;
  }

  // Belt and braces: if it parses as a URL with a host against a dummy origin
  // and the origin changed, it was not really relative.
  let parsed: URL;
  try {
    parsed = new URL(value, "https://relative.invalid");
  } catch {
    return null;
  }
  if (parsed.origin !== "https://relative.invalid") return null;

  if (DISALLOWED_PREFIXES.some((prefix) => parsed.pathname.startsWith(prefix))) return null;

  // Rebuild from parsed parts so only path + query + hash survive.
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
