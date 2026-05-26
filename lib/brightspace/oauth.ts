import { randomBytes } from "node:crypto";

const DEFAULT_SCOPE = "core:*:* content:toc:read";
const STATE_COOKIE = "brightspace_oauth_state";
const ACCESS_TOKEN_COOKIE = "brightspace_access_token";
const REFRESH_TOKEN_COOKIE = "brightspace_refresh_token";

export function getBrightspaceRedirectUri() {
  return (
    process.env.BRIGHTSPACE_REDIRECT_URI ||
    "https://localhost:3000/api/auth/brightspace/callback"
  );
}

export function getBrightspaceScope() {
  return process.env.BRIGHTSPACE_OAUTH_SCOPE || DEFAULT_SCOPE;
}

export function getBrightspaceAuthorizationUrl(state: string) {
  const clientId = process.env.BRIGHTSPACE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing Brightspace OAuth client ID.");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getBrightspaceRedirectUri(),
    scope: getBrightspaceScope(),
    state,
  });

  return `https://auth.brightspace.com/oauth2/auth?${params.toString()}`;
}

export function createBrightspaceOAuthState() {
  return randomBytes(24).toString("hex");
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, STATE_COOKIE };
