"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { demoUser, useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  function handleLogin() {
    login();
    router.push("/");
  }

  return (
    <div className="hub-shell flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
        <div className="mb-9 text-center leading-none text-[#171713]" aria-hidden="true">
          <span className="block text-[2rem] font-normal tracking-[-0.055em]">LACE</span>
          <span className="editorial-eyebrow mt-1 block text-[#786f62]">Learning Hub</span>
        </div>

        <div className="editorial-panel rounded-[var(--radius-card)] bg-[color:var(--bg-surface)] px-8 pb-8 pt-7">
          <div className="mb-6 text-center">
            <p className="section-kicker primary">Demo environment</p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.01em] text-[#171713]">Sign in</h1>
            <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">Continue into the curated legal learning library.</p>
          </div>

          <div className="rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-raised)] p-4 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#171713] text-lg font-bold text-[#fffaf0]">
                {demoUser.initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#25221d]">{demoUser.name}</p>
                <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                  {demoUser.title} - {demoUser.unit}
                </p>
                <p className="truncate text-sm text-[#8a8173]">{demoUser.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[#171713] px-6 py-3.5 text-base font-bold text-[#fffaf0] shadow-[0_14px_30px_rgba(23,23,19,0.16)] transition hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#1f1d19]/15"
          >
            Continue as {demoUser.firstName}
            <ArrowIcon className="h-4 w-4" />
          </button>

          <p className="mt-5 text-center text-xs font-medium leading-5 text-[#8a8173]">
            No real credentials required. This is a demonstration environment.
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
