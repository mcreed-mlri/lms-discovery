import { NextResponse, type NextRequest } from "next/server";

type SecurityEnv = {
  LACE_DEPLOYMENT_KIND?: string;
  LACE_ALLOW_DEMO_AUTH?: string;
  BRIGHTSPACE_OAUTH_SCOPE?: string;
  NEXT_PUBLIC_DEMO_MODE?: string;
  SESSION_SECRET?: string;
  VERCEL_ENV?: string;
};

const PRODUCTION_DEPLOYMENT_KINDS = new Set(["pilot", "production"]);
const DEMO_DEPLOYMENT_KINDS = new Set(["demo", "local"]);

function getProcessSecurityEnv(): SecurityEnv {
  return process.env as unknown as SecurityEnv;
}

export type SecurityEnvironmentIssue = {
  code: "demo_auth_in_production" | "missing_brightspace_scope" | "missing_session_secret";
  message: string;
};

export function isProductionDeployment(env: SecurityEnv = getProcessSecurityEnv()) {
  const deploymentKind = env.LACE_DEPLOYMENT_KIND?.toLowerCase();
  return (
    env.VERCEL_ENV === "production" ||
    (deploymentKind ? PRODUCTION_DEPLOYMENT_KINDS.has(deploymentKind) : false)
  );
}

export function isExplicitDemoDeployment(env: SecurityEnv = getProcessSecurityEnv()) {
  const deploymentKind = env.LACE_DEPLOYMENT_KIND?.toLowerCase();
  return (
    env.LACE_ALLOW_DEMO_AUTH === "true" ||
    (deploymentKind ? DEMO_DEPLOYMENT_KINDS.has(deploymentKind) : false)
  );
}

export function getSecurityEnvironmentIssues(
  env: SecurityEnv = getProcessSecurityEnv(),
): SecurityEnvironmentIssue[] {
  const issues: SecurityEnvironmentIssue[] = [];
  const production = isProductionDeployment(env);

  if (production && env.NEXT_PUBLIC_DEMO_MODE === "true" && !isExplicitDemoDeployment(env)) {
    issues.push({
      code: "demo_auth_in_production",
      message:
        "NEXT_PUBLIC_DEMO_MODE=true enables local persona sign-in and is blocked for pilot/production deployments.",
    });
  }

  if (production && !env.SESSION_SECRET) {
    issues.push({
      code: "missing_session_secret",
      message: "SESSION_SECRET is required for pilot/production deployments.",
    });
  }

  if (production && !env.BRIGHTSPACE_OAUTH_SCOPE) {
    issues.push({
      code: "missing_brightspace_scope",
      message:
        "BRIGHTSPACE_OAUTH_SCOPE must be set explicitly for pilot/production deployments; do not rely on the local fallback scope.",
    });
  }

  return issues;
}

export function requireSameOriginRequest(request: NextRequest | Request): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return null;

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin) {
    if (origin === requestUrl.origin) return null;
    return NextResponse.json(
      { ok: false, error: "Cross-origin request rejected." },
      { status: 403 },
    );
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return NextResponse.json({ ok: false, error: "Cross-site request rejected." }, { status: 403 });
  }

  // Non-browser clients often omit both headers; route-specific auth still applies.
  return null;
}
