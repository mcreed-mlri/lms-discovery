const productionKinds = new Set(["pilot", "production"]);
const demoKinds = new Set(["demo", "local"]);

function isProductionDeployment(env) {
  const deploymentKind = env.LACE_DEPLOYMENT_KIND?.toLowerCase();
  return (
    env.VERCEL_ENV === "production" ||
    (deploymentKind ? productionKinds.has(deploymentKind) : false)
  );
}

function isExplicitDemoDeployment(env) {
  const deploymentKind = env.LACE_DEPLOYMENT_KIND?.toLowerCase();
  return (
    env.LACE_ALLOW_DEMO_AUTH === "true" || (deploymentKind ? demoKinds.has(deploymentKind) : false)
  );
}

const issues = [];

if (
  isProductionDeployment(process.env) &&
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" &&
  !isExplicitDemoDeployment(process.env)
) {
  issues.push(
    "NEXT_PUBLIC_DEMO_MODE=true enables local persona sign-in and is blocked for pilot/production deployments.",
  );
}

if (isProductionDeployment(process.env) && !process.env.SESSION_SECRET) {
  issues.push("SESSION_SECRET is required for pilot/production deployments.");
}

if (isProductionDeployment(process.env) && !process.env.BRIGHTSPACE_OAUTH_SCOPE) {
  issues.push(
    "BRIGHTSPACE_OAUTH_SCOPE must be set explicitly for pilot/production deployments; do not rely on the local fallback scope.",
  );
}

if (issues.length) {
  console.error("Security environment validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}
