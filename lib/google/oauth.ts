import { randomBytes } from "node:crypto";

/**
 * Temporary Google OAuth login, gated to an MLRI Google Workspace domain, for
 * the one-week staff-meeting demo window. See
 * docs/adr/0012-temporary-google-gated-demo-login.md.
 */

const STATE_COOKIE = "google_oauth_state";
const DEFAULT_ALLOWED_DOMAIN = "mlri.org";

export function getGoogleRedirectUri() {
  return process.env.GOOGLE_OAUTH_REDIRECT_URI || "https://localhost:3000/api/auth/google/callback";
}

export function getGoogleAllowedDomain() {
  return process.env.GOOGLE_ALLOWED_DOMAIN || DEFAULT_ALLOWED_DOMAIN;
}

export function getGoogleAuthorizationUrl(state: string) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing Google OAuth client ID.");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(),
    scope: "openid email profile",
    state,
    // UI hint only — Google may still show other accounts, so the callback
    // re-checks the domain server-side against the verified ID token.
    hd: getGoogleAllowedDomain(),
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function createGoogleOAuthState() {
  return randomBytes(24).toString("hex");
}

/**
 * Hard cutoff for the demo window. Reading it fresh each call (rather than at
 * module load) means changing GOOGLE_DEMO_ACCESS_EXPIRES_AT never needs a code
 * change, just a redeploy.
 */
export function getGoogleDemoExpiry(): Date | null {
  const raw = process.env.GOOGLE_DEMO_ACCESS_EXPIRES_AT;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * True once the demo window is over — including when no cutoff is configured
 * at all, so the Google login path is disabled by default rather than left
 * open indefinitely by omission.
 */
export function isPastGoogleDemoExpiry(now: Date = new Date()): boolean {
  const expiry = getGoogleDemoExpiry();
  if (expiry === null) return true;
  return now.getTime() >= expiry.getTime();
}

/**
 * Seconds until the demo cutoff, capped to `maxSeconds` (the normal session
 * TTL). Used so a session minted near the end of the week still dies exactly
 * at the cutoff instead of outliving it by up to SESSION_TTL_SECONDS.
 */
export function secondsUntilGoogleDemoExpiry(maxSeconds: number, now: Date = new Date()): number {
  const expiry = getGoogleDemoExpiry();
  if (!expiry) return maxSeconds;
  const remaining = Math.floor((expiry.getTime() - now.getTime()) / 1000);
  return Math.max(0, Math.min(maxSeconds, remaining));
}

export { STATE_COOKIE };
