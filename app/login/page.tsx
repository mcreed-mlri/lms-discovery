"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, demoUser } from "@/lib/auth";
import { BookIcon } from "@/components/icons";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mlri-navy px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-mlri-blue/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[24rem] w-[24rem] rounded-full bg-mlri-sky/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Branding */}
        <a href="#" className="mb-10 flex items-center justify-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <BookIcon className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold">MLRI</span>
            <span className="block text-[15px] font-semibold text-sky-200">Learning Hub</span>
          </span>
        </a>

        {/* Card */}
        <div className="rounded-3xl bg-white px-8 pb-8 pt-7 shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Sign in</h1>
            <p className="mt-1 text-sm text-slate-500">MLRI Learning Hub · Demo Environment</p>
          </div>

          {/* User preview */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mlri-navy text-lg font-bold text-white">
                {demoUser.initials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{demoUser.name}</p>
                <p className="text-sm text-slate-500">
                  {demoUser.title} &middot; {demoUser.unit}
                </p>
                <p className="truncate text-sm text-slate-400">{demoUser.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-mlri-navy px-6 py-3.5 text-base font-bold text-white transition hover:bg-mlri-blue focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            Continue as {demoUser.firstName}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p className="mt-5 text-center text-xs text-slate-400">
            No real credentials required. This is a demonstration environment.
          </p>
        </div>
      </div>
    </div>
  );
}
