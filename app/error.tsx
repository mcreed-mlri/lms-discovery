"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RouteStatePanel } from "@/components/route-state-panel";

/* Route-level error boundary.

   Before this existed the app had no error boundary at all: most of the
   interactive surface is client components, so any render-time throw unmounted
   the tree to a blank white page with nothing in the UI to recover from.

   `reset()` re-renders the segment without a full document reload, so client
   state outside the failed segment survives. */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Until error tracking is wired, the console is the only record. `digest`
    // is the stable id Next assigns, and the one to quote in a bug report.
    console.error("[lace] route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <RouteStatePanel
      eyebrow="Learning Hub"
      title="Something went wrong on this page"
      description="The rest of the Hub is still working. Trying again usually clears it — your progress in Brightspace is unaffected."
      role="alert"
    >
      <button
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
        type="button"
        onClick={reset}
      >
        Try again
      </button>
      <Link
        className="text-sm font-bold text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] focus-ring"
        href="/"
      >
        Back to the library
      </Link>
      {error.digest ? (
        <p className="metadata text-[color:var(--ink-soft)]">Reference: {error.digest}</p>
      ) : null}
    </RouteStatePanel>
  );
}
