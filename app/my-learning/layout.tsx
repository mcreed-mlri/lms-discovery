import type { ReactNode } from "react";
import { StudioShell } from "@/components/studio-shell";

// LaceDevRoleProvider is now supplied app-wide in app/providers.tsx, so the
// layout only needs to wrap My Learning pages in the Studio rail shell.
export default function MyLearningLayout({ children }: { children: ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
