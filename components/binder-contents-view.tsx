"use client";

import Link from "next/link";

import { StudioShell } from "@/components/studio-shell";
import { getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTabs } from "@/lib/binder";
import { describeContents, getTabTopics } from "@/lib/binder-topics";
import { getLearningItemById, type LearningItem } from "@/lib/data";

/**
 * A binder's Contents divider: its sections in order, each with the topics
 * open there now (linking to each topic's page) and how many are planned.
 * Open topics lead; planned counts stay quiet.
 */
export function BinderContentsView({ binderId }: { binderId: string }) {
  const { user } = useAuth();
  const binder = getBinder(binderId);
  if (!binder) return null;

  const sections = getSectionTabs(binder).map((tab) => {
    const { built, planned } = getTabTopics(binder, tab.id);
    const open = built.map((contents) => {
      const items = contents.itemIds
        .map((id) => getLearningItemById(id))
        .filter((item): item is LearningItem => item !== undefined);
      return {
        topic: contents.topic,
        summary: describeContents(contents, getEligibleLearningItems(items, user).length),
      };
    });
    return { tab, open, planned: planned.length };
  });

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <div className="border-b-4 border-[color:var(--binder)] pb-6">
          <p className="text-sm font-semibold text-[color:var(--ink-muted)]">Legal Skills</p>
          <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[color:var(--ink)]">
            {binder.name}
          </h1>
          <p className="mt-2 text-[17px] text-[color:var(--ink-muted)]">{binder.blurb}</p>
        </div>

        <section aria-labelledby="contents-heading">
          <h2 id="contents-heading" className="sr-only">
            Contents
          </h2>
          <ol>
            {sections.map(({ tab, open, planned }, index) => (
              <li key={tab.id} className="border-b border-[color:var(--line)] py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <Link
                    href={tab.href}
                    className="flex items-baseline gap-3 text-[color:var(--ink)] hover:underline underline-offset-[3px] focus-ring"
                  >
                    <span className="w-6 text-[15px] font-semibold tabular-nums text-[color:var(--ink-soft)]">
                      {index + 1}
                    </span>
                    <span className="text-[20px] font-bold tracking-[-0.01em]">{tab.label}</span>
                  </Link>
                  <span className="text-sm text-[color:var(--ink-muted)]">
                    {open.length > 0 ? `${open.length} open · ` : ""}
                    {planned} planned
                  </span>
                </div>
                {tab.title !== tab.label ? (
                  <p className="mt-0.5 pl-9 text-[14px] text-[color:var(--ink-soft)]">
                    {tab.title}
                  </p>
                ) : null}
                {open.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2 pl-9">
                    {open.map(({ topic, summary }) => (
                      <li key={topic.id}>
                        <Link
                          href={topic.href}
                          className="inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-0.5 rounded-[10px] border-[1.5px] border-[color:var(--ink)] px-4 py-2 text-[15px] font-bold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                        >
                          {topic.title}
                          {summary ? (
                            <span className="text-[13px] font-semibold text-[color:var(--ink-muted)]">
                              {summary}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </StudioShell>
  );
}
