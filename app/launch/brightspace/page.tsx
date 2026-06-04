import Link from "next/link";
import type { Metadata } from "next";
import { ArrowIcon, BookIcon } from "@/components/icons";
import { getVerifiedBrightspaceUrl } from "@/lib/brightspace-launch";

export const metadata: Metadata = {
  title: "Open Brightspace | Learning Hub",
};

type BrightspaceLaunchPageProps = {
  searchParams?: Promise<{
    title?: string;
    url?: string;
  }>;
};

export default async function BrightspaceLaunchPage({ searchParams }: BrightspaceLaunchPageProps) {
  const params = (await searchParams) ?? {};
  const brightspaceUrl = getVerifiedBrightspaceUrl(params.url);
  const title = params.title?.trim() || "your Brightspace course";

  return (
    <main className="hub-shell flex min-h-screen items-center justify-center px-4 py-[calc(2rem+env(safe-area-inset-top,0px))]">
      <section className="editorial-panel w-full max-w-lg rounded-[var(--radius-card)] p-6 text-[color:var(--ink)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[color:var(--brand-tint)] text-[color:var(--brand)]">
          <BookIcon className="h-5 w-5" />
        </div>

        <p className="section-kicker secondary mt-5">Brightspace handoff</p>
        <h1 className="section-title mt-2 text-2xl text-[color:var(--ink)]">
          Open {title}
        </h1>

        {brightspaceUrl ? (
          <>
            <p className="readable-copy mt-3 text-base leading-7">
              On iPhone and iPad, Brightspace opens in Safari because it lives outside the Learning Hub PWA. This keeps the hub available here while the course opens in the browser.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={brightspaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer-when-downgrade"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
              >
                Open Brightspace <ArrowIcon className="h-4 w-4" />
              </a>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 text-sm font-bold text-[color:var(--ink-muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
              >
                Back to hub
              </Link>
            </div>
            <p className="metadata mt-4 text-[color:var(--ink-soft)]">
              Tip: after Brightspace opens, scroll slightly to let Safari reduce its toolbar.
            </p>
          </>
        ) : (
          <>
            <p className="readable-copy mt-3 text-base leading-7">
              This launch link is missing a valid Brightspace destination.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2a5bff]/15"
            >
              Back to hub
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
