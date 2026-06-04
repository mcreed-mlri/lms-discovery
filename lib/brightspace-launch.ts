const BRIGHTSPACE_LAUNCH_PATH = "/launch/brightspace";

export function isBrightspaceUrl(href: string) {
  try {
    const url = new URL(href);
    return (
      url.protocol === "https:" &&
      (url.hostname === "brightspace.example.edu" ||
        url.hostname === "mlri.brightspace.com" ||
        url.hostname.endsWith(".brightspace.com"))
    );
  } catch {
    return false;
  }
}

export function getBrightspaceLaunchHref(href: string, title?: string) {
  if (!isBrightspaceUrl(href)) return href;

  const params = new URLSearchParams({ url: href });
  if (title) params.set("title", title);
  return `${BRIGHTSPACE_LAUNCH_PATH}?${params.toString()}`;
}

export function getVerifiedBrightspaceUrl(href?: string) {
  if (!href || !isBrightspaceUrl(href)) return null;
  return href;
}
