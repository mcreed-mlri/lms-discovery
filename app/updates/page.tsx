"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LibraryShell } from "@/components/library-shell";
import { UpdatesView } from "@/components/updates-view";
import { useAuth } from "@/lib/auth";

export default function UpdatesPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="hub-shell flex min-h-screen items-center justify-center px-4">
        <div className="editorial-panel w-full max-w-sm rounded-xl p-6 text-center">
          <p className="editorial-eyebrow">Learning Hub</p>
          <h1 className="hero-title mt-3 text-3xl text-[color:var(--ink)]">Loading updates</h1>
        </div>
      </div>
    );
  }

  return (
    <LibraryShell>
      <UpdatesView />
    </LibraryShell>
  );
}
