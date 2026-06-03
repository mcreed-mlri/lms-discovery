"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LearnerDashboardView } from "@/components/dashboard/LearnerDashboardView";
import { getEffectiveDashboardRole } from "@/lib/access";
import { useAuth } from "@/lib/auth";

export default function MyLearningPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  // The headless admin account has no personal learning — send it to the console.
  const isAdmin = getEffectiveDashboardRole(user) === "super_admin";

  useEffect(() => {
    if (ready && isAdmin) router.replace("/my-learning/admin");
  }, [ready, isAdmin, router]);

  if (isAdmin) return null;

  return <LearnerDashboardView />;
}
