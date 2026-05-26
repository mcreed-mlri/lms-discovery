export type BrightspaceAuthMode = "id-key" | "oauth" | "unconfigured";

export type BrightspaceConfigHealth = {
  baseUrl: boolean;
  redirectUri: boolean;
  appId: boolean;
  appKey: boolean;
  userId: boolean;
  userKey: boolean;
  clientId: boolean;
  clientSecret: boolean;
  accessToken: boolean;
};

export function getBrightspaceConfigHealth(): BrightspaceConfigHealth {
  return {
    baseUrl: Boolean(process.env.BRIGHTSPACE_BASE_URL),
    redirectUri: Boolean(process.env.BRIGHTSPACE_REDIRECT_URI),
    appId: Boolean(process.env.BRIGHTSPACE_APP_ID),
    appKey: Boolean(process.env.BRIGHTSPACE_APP_KEY),
    userId: Boolean(process.env.BRIGHTSPACE_USER_ID),
    userKey: Boolean(process.env.BRIGHTSPACE_USER_KEY),
    clientId: Boolean(process.env.BRIGHTSPACE_CLIENT_ID),
    clientSecret: Boolean(process.env.BRIGHTSPACE_CLIENT_SECRET),
    accessToken: Boolean(process.env.BRIGHTSPACE_ACCESS_TOKEN),
  };
}

export function getBrightspaceAuthMode(config = getBrightspaceConfigHealth()): BrightspaceAuthMode {
  if (config.clientId && config.clientSecret) return "oauth";
  if (config.appId && config.appKey) return "id-key";
  return "unconfigured";
}
