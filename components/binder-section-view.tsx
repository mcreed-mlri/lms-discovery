"use client";

import Link from "next/link";

import { StudioShell } from "@/components/studio-shell";
import { getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import {
  filedItems,
  getBinder,
  getPlannedTopics,
  getSectionTab,
  getSectionTabs,
} from "@/lib/binder";
import { getLearningItemById, getLearningItemUrl, type LearningItem } from "@/lib/data";

/**
 * One divider's page in a binder. First slice: what's open in
 * this section, then the planned topics as a quiet "Coming" list. Kind chips,
 * reference pages and notes come next (DESIGN.md, "Kind chips").
 */
export function BinderSectionView({ binderId, tabId }: { binderId: string; tabId: string }) {
  const { user } = useAuth();
  const binder = getBinder(binderId);
  const tab = binder ? getSectionTab(binder, tabId) : undefined;
  const filed = (filedItems[tabId] ?? [])
    .map((id) => getLearningItemById(id))
    .filter((item): item is LearningItem => item !== undefined);
  const items = getEligibleLearningItems(filed, user);
  const planned = getPlannedTopics(tabId);
  const sections = binder ? getSectionTabs(binder) : [];
  const position = sections.findIndex((t) => t.id === tabId) + 1;

  if (!binder || !tab) return null;

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <div className="border-b-4 border-[color:var(--binder)] pb-6">
          <p className="text-sm font-semibold text-[color:var(--ink-muted)]">
            <Link href={binder.href} className="underline-offset-[3px] hover:underline focus-ring">
              {binder.name}
            </Link>{" "}
            · tab {position} of {sections.length}
          </p>
          <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[color:var(--ink)]">
            {tab.title}
          </h1>
        </div>

        <section aria-labelledby="open-now">
          <h2
            id="open-now"
            className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
          >
            Open now
          </h2>
          {items.length > 0 ? (
            <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
              {items.map((item) => (
                <li key={item.id} className="border-b border-[color:var(--line)]">
                  <a
                    href={getLearningItemUrl(item)}
                    className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4 text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                  >
                    <span>
                      <span className="block text-[17px] font-bold">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-[color:var(--ink-muted)]">
                        {item.description}
                      </span>
                    </span>
                    <span className="text-[15px] font-bold text-[color:var(--brand-ink)]">
                      Open
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-[12px] border border-dashed border-[color:var(--line-strong)] px-5 py-4 text-[15px] text-[color:var(--ink-muted)]">
              Nothing is open in this tab yet. Planned topics are listed below.
            </p>
          )}
        </section>

        <section aria-labelledby="coming" className="border-t border-[color:var(--line)] pt-6">
          <h2 id="coming" className="text-base font-bold text-[color:var(--ink)]">
            Coming to this tab
          </h2>
          <p className="mt-1 text-[15px] text-[color:var(--ink-muted)]">
            {planned.length} topics are planned. Each one shows up under Updates when it opens.
          </p>
          <ul className="mt-3 grid gap-x-8 text-[15px] text-[color:var(--ink-muted)] sm:grid-cols-2">
            {planned.map((topic) => (
              <li key={topic} className="border-b border-[color:var(--line-soft)] py-2.5">
                {topic}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[color:var(--ink-soft)]">
            See where this fits on the{" "}
            <Link href="/curriculum-map" className="underline underline-offset-[3px]">
              curriculum map
            </Link>
            .
          </p>
        </section>
      </div>
    </StudioShell>
  );
}
