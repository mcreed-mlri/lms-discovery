const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isUserOrOrgSite = repo.endsWith(".github.io");
const shouldUseBasePath = isGitHubActions && repo && !isUserOrOrgSite;
const basePath = shouldUseBasePath ? `/${repo}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGitHubActions ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
