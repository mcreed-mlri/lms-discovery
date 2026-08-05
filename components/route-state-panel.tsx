import type { ReactNode } from "react";

/* The centered card shared by the route-level loading, error, and not-found
   states.

   These states are the ones a user hits when something has already gone wrong,
   so they are the worst place to look unlike the rest of the app. This mirrors
   the panels the shell and home page already render for their signed-out and
   loading states — same `hub-shell` background, same `editorial-panel` card, so
   a failure reads as part of the product rather than a browser default.

   Lives in one place on purpose: four hand-copied variants would drift the way
   the button styles did. */
export function RouteStatePanel({
  eyebrow,
  title,
  description,
  children,
  role,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Actions — buttons or links. */
  children?: ReactNode;
  /** "alert" for error states so screen readers announce them on arrival. */
  role?: "alert" | "status";
}) {
  return (
    <div className="hub-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="editorial-panel w-full max-w-md rounded-2xl p-7 text-center"
        role={role}
        aria-live={role ? "polite" : undefined}
      >
        <p className="editorial-eyebrow">{eyebrow}</p>
        <h1 className="hero-title mt-4 text-3xl text-[color:var(--ink)]">{title}</h1>
        {description ? (
          <p className="mt-3 text-base leading-7 text-[color:var(--ink-muted)]">{description}</p>
        ) : null}
        {children ? <div className="mt-7 flex flex-col items-center gap-3">{children}</div> : null}
      </div>
    </div>
  );
}
