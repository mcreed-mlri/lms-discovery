import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { binders, filedItems, getSectionTabs } from "@/lib/binder";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { contentUpdates, getLearningItemUrl, modules, type LearningItem } from "@/lib/data";

// Built courses an attorney can open today, other than the pilot, which the
// resume card already carries.
const ALSO_OPEN = ["eviction-defense-48h", "welcome-to-lace"];

function availableMeta(item: LearningItem) {
  if (item.type !== "COURSE") return null;
  const courseModules = modules.filter((module) => module.courseId === item.id);
  const parts = [item.practiceArea];
  if (courseModules.length > 0) parts.push(`${courseModules.length} modules`);
  parts.push(item.duration.replace(/^~/, "about "));
  return parts.join(" · ");
}

function binderOpenCount(binderId: string, eligibleIds: Set<string>) {
  const binder = binders.find((b) => b.id === binderId);
  const tabs = binder ? getSectionTabs(binder) : [];
  return tabs.reduce(
    (sum, tab) => sum + (filedItems[tab.id] ?? []).filter((id) => eligibleIds.has(id)).length,
    0,
  );
}

function YourBinders({
  eligibleIds,
  catalogTotal,
}: {
  eligibleIds: Set<string>;
  catalogTotal: number;
}) {
  return (
    <section aria-labelledby="binders-heading" className="min-w-0">
      <h2
        id="binders-heading"
        className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
      >
        Your binders
      </h2>
      <ul className="mt-4 border-t-[1.5px] border-[color:var(--ink)]">
        {binders.map((binder) => {
          const open = binderOpenCount(binder.id, eligibleIds);
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
                {open > 0 ? (
                  <span className="shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)]">
                    {open} open
                  </span>
                ) : null}
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
          Browse all {catalogTotal} items
        </Link>
      </p>
    </section>
  );
}

export function HomeOverview({
  catalogTotal,
  allItems,
}: {
  catalogTotal: number;
  allItems: LearningItem[];
}) {
  const eligibleIds = new Set(allItems.map((item) => item.id));
  const alsoOpen = ALSO_OPEN.map((id) =>
    allItems.find((item) => item.type === "COURSE" && item.id === id),
  ).filter((item): item is LearningItem => Boolean(item));
  const update = contentUpdates[0];
  const updateStatus = update ? getStatusTheme(resolveStatusKey(update.tag)) : null;

  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-11 lg:px-11 lg:pt-6">
      <div className="flex min-w-0 flex-col gap-10">
        <YourBinders eligibleIds={eligibleIds} catalogTotal={catalogTotal} />
      </div>

      <div className="flex min-w-0 flex-col gap-8">
        {alsoOpen.length > 0 ? (
          <section aria-labelledby="available-heading">
            <h2
              id="available-heading"
              className="text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)]"
            >
              Also open now
            </h2>
            <ul className="mt-2.5 border-t-[1.5px] border-[color:var(--ink)]">
              {alsoOpen.map((item) => (
                <li key={item.id}>
                  <a
                    href={getLearningItemUrl(item)}
                    className="group flex items-center justify-between gap-3 border-b border-[color:var(--line)] py-3 transition hover:bg-[color:var(--hover-tint)] focus-ring"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-[color:var(--ink)]">
                        {item.title}
                      </span>
                      <span className="block text-[12px] text-[color:var(--ink-soft)]">
                        {availableMeta(item)}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-[color:var(--ink)]">
                      Open
                      <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {update && updateStatus ? (
          <section aria-labelledby="update-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                id="update-heading"
                className="text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)]"
              >
                Updates
              </h2>
              <Link
                href="/updates"
                className="rounded-[3px] text-[13px] font-semibold text-[color:var(--brand)] underline-offset-[3px] hover:underline focus-ring"
              >
                All updates
              </Link>
            </div>
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
          </section>
        ) : null}
      </div>
    </div>
  );
}
