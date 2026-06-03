"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { demoUsers, useAuth, type User } from "@/lib/auth";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  function handleLogin(nextUser: User) {
    login(nextUser.id);
    router.push("/");
  }

  return (
    <div className="hub-shell flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          <div className="mb-9 text-center leading-none text-[color:var(--ink)]" aria-hidden="true">
            <span className="block text-[2rem] font-normal tracking-[-0.055em]">LACE</span>
            <span className="editorial-eyebrow mt-1 block text-[color:var(--ink-soft)]">Learning Hub</span>
          </div>

          <div className="editorial-panel rounded-[var(--radius-card)] bg-[color:var(--bg-surface)] px-8 pb-8 pt-7">
            <div className="mb-6 text-center">
              <p className="section-kicker primary">Demo environment</p>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.01em] text-[color:var(--ink)]">Sign in</h1>
              <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">Choose a demo user to preview access-controlled discovery.</p>
            </div>

            <div className="grid gap-3">
              {demoUsers.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => handleLogin(candidate)}
                  className="group rounded-[var(--radius-control)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-raised)] p-4 text-left shadow-[var(--shadow-sm)] transition hover:border-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-lg font-bold text-[color:var(--surface)]">
                      {candidate.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[color:var(--ink-muted)]">{candidate.name}</p>
                      <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                        {candidate.title} · {candidate.unit}
                      </p>
                      <p className="truncate text-sm text-[#8a8173]">{candidate.organization}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] text-[color:var(--ink-soft)] transition group-hover:border-[color:var(--ink)] group-hover:text-[color:var(--ink)]">
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-xs font-medium leading-5 text-[#8a8173]">
              No real credentials required. This is a demonstration environment.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
