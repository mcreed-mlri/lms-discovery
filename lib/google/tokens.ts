import { getGoogleRedirectUri } from "@/lib/google/oauth";

export type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

/** Claims Google's tokeninfo endpoint returns for a verified ID token. */
export type GoogleTokenInfo = {
  iss?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  hd?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  error_description?: string;
};

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const TOKENINFO_ENDPOINT = "https://oauth2.googleapis.com/tokeninfo";

export async function exchangeGoogleToken(code: string): Promise<GoogleTokenResponse> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth client credentials.");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleRedirectUri(),
    }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Google token endpoint returned ${response.status} with a non-JSON body.`);
  }

  return (await response.json()) as GoogleTokenResponse;
}

/**
 * Verifies an ID token's signature and expiry by asking Google directly,
 * rather than adding a JWKS/JWT-verification dependency for a one-week
 * feature. Also returns the `hd`/`email` claims the callback needs for the
 * domain check.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo | null> {
  const response = await fetch(`${TOKENINFO_ENDPOINT}?id_token=${encodeURIComponent(idToken)}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  return (await response.json()) as GoogleTokenInfo;
}
