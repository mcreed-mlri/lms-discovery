import type { ComponentType } from "react";
import { BookIcon, HomeIcon, PathIcon, SearchIcon, SparkIcon } from "@/components/icons";

export type LibraryFilter = "Paths";

export type LibraryNavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  filter?: LibraryFilter;
  pathMatch?: string;
};

export const libraryNavItems: LibraryNavItem[] = [
  { title: "Home", href: "/", icon: HomeIcon, pathMatch: "/" },
  { title: "Browse", href: "/#browse", icon: SearchIcon },
  { title: "My Learning", href: "/my-learning", icon: BookIcon, pathMatch: "/my-learning" },
  { title: "Paths", href: "/#browse", icon: PathIcon, filter: "Paths" },
  { title: "Updates", href: "/updates", icon: SparkIcon, pathMatch: "/updates" },
];

export function isLibraryNavActive(item: LibraryNavItem, pathname: string) {
  if (item.pathMatch === "/my-learning") return pathname.startsWith("/my-learning");
  if (item.pathMatch) return pathname === item.pathMatch;
  return false;
}
