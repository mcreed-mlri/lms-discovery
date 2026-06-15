"use client";

import { useEffect } from "react";
import { LearnerDashboardView } from "@/components/dashboard/LearnerDashboardView";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBrightspaceManagerUrl } from "@/lib/brightspace-manager";

export default function MyLearningPage() {
  const { user, ready } = useAuth();
  // The headless admin account has no personal learning; operations live in Brightspace Manager.
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  useEffect(() => {
    if (ready && isAdmin) window.location.replace(getBrightspaceManagerUrl());
  }, [ready, isAdmin]);

  if (isAdmin) return null;

  return <LearnerDashboardView />;
}
