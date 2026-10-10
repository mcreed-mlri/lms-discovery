import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { binders, filedItems, getSectionTabs } from "@/lib/binder";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { contentUpdates, type LearningItem } from "@/lib/data";
import { drillHref, practiceDrills } from "@/lib/practice";

/** What a binder holds today, as "1 course ready · 1 drill", or null when it has nothing built yet. */
export function binderReadyLabel(binderId: string, eligibleIds: Set<string>) {
  const binder = binders.find((b) => b.id === binderId);
  const tabs = binder ? getSectionTabs(binder) : [];
  const ready = tabs.reduce(
    (sum, tab) => sum + (filedItems[tab.id] ?? []).filter((id) => eligibleIds.has(id)).length,
    0,
  );
  const drills = practiceDrills.filter((drill) => drill.binderId === binderId).length;
  const parts = [
    ready > 0 ? `${ready} ${ready === 1 ? "course" : "courses"} ready` : null,
    drills > 0 ? `${drills} ${drills === 1 ? "drill" : "drills"}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Updates about something filed in a binder. The rest wait on the Updates page. */
export function binderUpdates() {
  const filed = new Set(Object.values(filedItems).flat());
  return contentUpdates.filter((update) => filed.has(update.courseId));
}

function YourBinders({
  eligibleIds,
  catalogTotal,
}: {
  eligibleIds: Set<string>;
  catalogTotal: number;
}) {
  return (
    <section
      aria-labelledby="binders-heading"
      className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-2"
    >
      <h2
        id="binders-heading"
        className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
      >
        Your binders
      </h2>
      <ul className="mt-4 border-t-[1.5px] border-[color:var(--ink)]">
        {binders.map((binder) => {
          const ready = binderReadyLabel(binder.id, eligibleIds);
          return (
            <li key={binder.id}>
              <Link
                href={binder.href}
                className="flex min-h-11 items-start gap-3 border-b border-[color:var(--line)] px-0.5 py-3.5 transition hover:bg-[color:var(--hover-tint)] focus-ring"
              >
                <span aria-hidden="true" data-binder={binder.id} className="binder-swatch mt-1.5" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-bold text-[color:var(--ink)]">
                    {binder.name}
                  </span>
                  <span className="block text-[13px] text-[color:var(--ink-muted)]">
                    {binder.blurb}
                  </span>
                </span>
                <span
                  className={`shrink-0 pt-0.5 text-[12px] font-semibold ${
                    ready ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
                  }`}
                >
                  {ready ?? "Coming"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[color:var(--ink-soft)]">
        <span>Substantive-law binders are coming.</span>
        <Link
          href="/curriculum-map"
          className="rounded-[3px] font-semibold text-[color:var(--ink)] underline underline-offset-[3px] focus-ring"
        >
          Curriculum map
        </Link>
        <Link
          href="/browse"
          className="rounded-[3px] font-semibold text-[color:var(--ink)] underline underline-offset-[3px] focus-ring"
        >
          Browse all {catalogTotal} {catalogTotal === 1 ? "item" : "items"}
        </Link>
      </p>
    </section>
  );
}

// The rest of Home, as two more cells of the grid in app/page.tsx: "Your binders"
// under search, and the side column under the resume card.
export function HomeOverview({ allItems }: { allItems: LearningItem[] }) {
  const eligibleIds = new Set(allItems.map((item) => item.id));
  const update = binderUpdates()[0];
  const updateStatus = update ? getStatusTheme(resolveStatusKey(update.tag)) : null;

  return (
    <>
      {/* Everything the user can open, not what the search box currently matches. */}
      <YourBinders eligibleIds={eligibleIds} catalogTotal={allItems.length} />

      <div className="flex min-w-0 flex-col gap-8 lg:col-start-2 lg:row-start-3">
        {practiceDrills.length > 0 ? (
          <section aria-labelledby="practice-heading">
            <h2
              id="practice-heading"
              className="text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)]"
            >
              Practice
            </h2>
            <ul className="mt-2.5 border-t-[1.5px] border-[color:var(--ink)]">
              {practiceDrills.map((drill) => {
                const binder = binders.find((b) => b.id === drill.binderId);
                const tab = binder?.tabs.find((t) => t.id === drill.tabId);
                return (
                  <li key={drill.id}>
                    <Link
                      href={drillHref(drill)}
                      className="group block border-b border-[color:var(--line)] py-3 transition hover:bg-[color:var(--hover-tint)] focus-ring"
                    >
                      <span className="block text-[14px] font-bold text-[color:var(--ink)]">
                        {drill.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-[color:var(--ink-muted)]">
                        {drill.summary}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-[12px] font-bold text-[color:var(--brand-ink)]">
                        {[
                          binder && tab ? `${binder.name} › ${tab.label}` : null,
                          "not graded or recorded",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="update-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2
              id="update-heading"
              className="text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)]"
            >
              What changed in your binders
            </h2>
            <Link
              href="/updates"
              className="shrink-0 rounded-[3px] text-[13px] font-semibold text-[color:var(--brand)] underline-offset-[3px] hover:underline focus-ring"
            >
              All updates
            </Link>
          </div>
          {update && updateStatus ? (
            <div className="mt-2.5 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`metadata inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 ${updateStatus.pill}`}
                >
                  {update.tag}
                </span>
                <span className="text-[12px] text-[color:var(--ink-soft)]">
                  Sample, not reviewed
                </span>
              </div>
              <p className="mt-1.5 text-[14px] font-bold leading-snug text-[color:var(--ink)]">
                {update.title}
              </p>
            </div>
          ) : (
            <p className="mt-2.5 border-t-[1.5px] border-[color:var(--ink)] pt-3 text-[14px] text-[color:var(--ink-muted)]">
              Nothing new in your binders yet.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
