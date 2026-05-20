"use client";

import type { ReactNode } from "react";
import { useLaceDevRole } from "@/lib/lace-dev-role";
import type { LaceRole } from "@/types/dashboard";

type RoleGateProps = {
  allow: LaceRole | LaceRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role } = useLaceDevRole();
  const allowed = Array.isArray(allow) ? allow : [allow];
  if (!allowed.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
