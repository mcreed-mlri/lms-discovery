const DEFAULT_BRIGHTSPACE_MANAGER_URL = "http://localhost:3001";

export function getBrightspaceManagerUrl(path = "/dashboard") {
  const baseUrl =
    process.env.NEXT_PUBLIC_BRIGHTSPACE_MANAGER_URL || DEFAULT_BRIGHTSPACE_MANAGER_URL;
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

