"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import {
  canUseDemoLogin,
  demoUsers,
  isDemoMode,
  showDemoUsers,
  useAuth,
  type User,
} from "@/lib/auth";
import { sanitizeReturnTo } from "@/lib/safe-return-to";

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  brightspace_denied: "Brightspace declined the sign-in request. Please try again.",
  invalid_state: "That sign-in link expired. Please try again.",
  token_exchange_failed: "We couldn't complete sign-in with Brightspace. Please try again.",
  whoami_failed:
    "Signed in to Brightspace, but we couldn't confirm your account. Please try again.",
  misconfigured: "Sign-in isn't fully configured yet. Please contact the platform administrator.",
};

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Where middleware wanted to send them before the gate intervened. Sanitized
  // again on the server; this copy only drives client-side navigation.
  const [returnTo, setReturnTo] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace(returnTo ?? "/");
  }, [ready, user, router, returnTo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error");
    if (errorCode) {
      setErrorMessage(
        LOGIN_ERROR_MESSAGES[errorCode] ?? LOGIN_ERROR_MESSAGES.token_exchange_failed,
      );
    }
    setReturnTo(sanitizeReturnTo(params.get("returnTo")));
  }, []);

  function handleDemoLogin(nextUser: User) {
    login(nextUser.id);
    router.push(returnTo ?? "/");
  }

  const brightspaceStartHref = returnTo
    ? `/api/auth/brightspace/start?returnTo=${encodeURIComponent(returnTo)}`
    : "/api/auth/brightspace/start";

  return (
    <div className="hub-shell flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          <div className="mb-9 text-center leading-none text-[color:var(--ink)]" aria-hidden="true">
            <span className="block text-[32px] font-normal tracking-[-0.055em]">LACE</span>
            <span className="editorial-eyebrow mt-1 block text-[color:var(--ink-soft)]">
              Learning Hub
            </span>
          </div>

          <div className="editorial-panel rounded-[var(--radius-card)] bg-[color:var(--surface)] px-8 pb-8 pt-7">
            <div className="mb-6 text-center">
              <p className="section-kicker primary">
                {isDemoMode ? "Demo environment" : "LACE Learning Hub"}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.01em] text-[color:var(--ink)]">
                Sign in
              </h1>
              <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">
                {isDemoMode
                  ? "Choose a demo user to preview access-controlled discovery."
                  : "Use Brightspace for access to this pre-pilot sandbox."}
              </p>
            </div>

            {errorMessage ? (
              <p
                role="alert"
                className="mb-5 rounded-[var(--radius-control)] border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-800"
              >
                {errorMessage}
              </p>
            ) : null}

            {!isDemoMode ? (
              <a
                href={brightspaceStartHref}
                className="group flex items-center justify-center gap-3 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 py-4 text-base font-bold text-[color:var(--surface)] shadow-[var(--shadow-sm)] transition hover:opacity-90 focus-ring"
              >
                Sign in with Brightspace
                <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            ) : null}

            {showDemoUsers ? (
              <div className={isDemoMode ? "grid gap-3" : "mt-6 grid gap-3"}>
                {!isDemoMode ? (
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-[color:var(--line)]" />
                    <span className="editorial-eyebrow text-[color:var(--ink-soft)]">
                      Demo users
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--line)]" />
                  </div>
                ) : null}

                {demoUsers.map((candidate) => {
                  const CardElement = canUseDemoLogin ? "button" : "article";
                  return (
                    <CardElement
                      key={candidate.id}
                      {...(canUseDemoLogin
                        ? { type: "button" as const, onClick: () => handleDemoLogin(candidate) }
                        : {})}
                      className="group rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4 text-left shadow-[var(--shadow-sm)] transition hover:border-[color:var(--ink)] focus-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--ink)] text-lg font-bold text-[color:var(--surface)]">
                          {candidate.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[color:var(--ink-muted)]">
                            {candidate.name}
                          </p>
                          <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                            {candidate.title} - {candidate.unit}
                          </p>
                          <p className="truncate text-sm text-[color:var(--ink-soft)]">
                            {candidate.organization}
                          </p>
                        </div>
                        {canUseDemoLogin ? (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--line)] text-[color:var(--ink-soft)] transition group-hover:border-[color:var(--ink)] group-hover:text-[color:var(--ink)]">
                            <ArrowIcon className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="metadata shrink-0 rounded-full border border-[color:var(--line)] px-2 py-1 text-[color:var(--ink-soft)]">
                            Preview
                          </span>
                        )}
                      </div>
                    </CardElement>
                  );
                })}
              </div>
            ) : null}

            <p className="mt-5 text-center text-xs font-medium leading-5 text-[color:var(--ink-soft)]">
              {isDemoMode
                ? "No real credentials required. This is a demonstration environment."
                : "Persona cards are previews only unless the app is running in demo mode."}
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
