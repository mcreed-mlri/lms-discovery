import type { ReactNode } from "react";
import { HubShell } from "@/components/hub-shell";
import { LaceDevRoleProvider } from "@/lib/lace-dev-role";

export default function MyLearningLayout({ children }: { children: ReactNode }) {
  return (
    <LaceDevRoleProvider>
      <HubShell>{children}</HubShell>
    </LaceDevRoleProvider>
  );
}
