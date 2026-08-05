import Link from "next/link";
import { RouteStatePanel } from "@/components/route-state-panel";

/* Reached by `notFound()` in app/learn/[slug]/page.tsx for an unknown slug, and
   by any mistyped URL. Before this file existed both got the stock Next 404. */
export default function NotFound() {
  return (
    <RouteStatePanel
      eyebrow="LACE Learning Hub"
      title="We could not find that page"
      description="The link may be out of date, or the training may have been renamed. The library is the fastest way back."
    >
      <Link
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-[color:var(--ink)] px-5 text-sm font-bold text-[color:var(--surface)] shadow-[var(--shadow-md)] transition hover:opacity-90 focus-ring"
        href="/"
      >
        Back to the library
      </Link>
      <Link
        className="text-sm font-bold text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] focus-ring"
        href="/browse"
      >
        Browse all training
      </Link>
    </RouteStatePanel>
  );
}
