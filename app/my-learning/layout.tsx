import type { ReactNode } from "react";
import { StudioShell } from "@/components/studio-shell";

// My Learning pages share the Studio rail shell.
export default function MyLearningLayout({ children }: { children: ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
