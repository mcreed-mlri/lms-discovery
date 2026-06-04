import type { AnchorHTMLAttributes, ReactNode } from "react";
import { getBrightspaceLaunchHref } from "@/lib/brightspace-launch";

type BrightspaceLaunchLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  launchTitle?: string;
  children: ReactNode;
};

export function BrightspaceLaunchLink({
  href,
  launchTitle,
  children,
  ...anchorProps
}: BrightspaceLaunchLinkProps) {
  return (
    <a href={getBrightspaceLaunchHref(href, launchTitle)} {...anchorProps}>
      {children}
    </a>
  );
}
