"use client";

import Link from "next/link";

import { HearsaySkills } from "@/components/hearsay-skills";
import { NotesPanel } from "@/components/notes-panel";
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
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import {
  contentUpdates,
  getLearningItemById,
  getLearningItemUrl,
  type LearningItem,
} from "@/lib/data";

/**
 * One divider's page in a binder: what's open in this section, any law change
 * that touches it, then the planned topics as a quiet "Coming" list, with the
 * advocate's own notes alongside. Kind chips wait until a tab holds three or
 * more kinds of item; until then they would be a row of zeros.
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
  // Law changes reach a tab through the courses filed under it.
  const filedIds = new Set(filed.map((item) => item.id));
  const changes = contentUpdates.filter((update) => filedIds.has(update.courseId));
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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
          <div className="flex min-w-0 flex-col gap-8">
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
                      {item.id === "legal-skills-hearsay" ? (
                        <div className="pb-5">
                          <HearsaySkills />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-[12px] border border-dashed border-[color:var(--line-strong)] px-5 py-4 text-[15px] text-[color:var(--ink-muted)]">
                  Nothing is open in this tab yet. Planned topics are listed below.
                </p>
              )}
            </section>

            {changes.length > 0 ? (
              <section aria-labelledby="new-law">
                <h2
                  id="new-law"
                  className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
                >
                  New law and rules
                </h2>
                <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
                  Sample items, not reviewed legal material.
                </p>
                <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
                  {changes.map((update) => (
                    <li
                      key={update.id}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[color:var(--line)] py-3.5"
                    >
                      <span
                        className={`metadata inline-flex rounded-[4px] border px-2 py-0.5 ${getStatusTheme(resolveStatusKey(update.tag)).pill}`}
                      >
                        {update.tag}
                      </span>
                      <Link
                        href="/updates"
                        className="min-w-0 flex-1 text-[16px] font-semibold text-[color:var(--ink)] underline-offset-[3px] hover:underline focus-ring"
                      >
                        {update.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="coming" className="pt-2">
              <h2 id="coming" className="text-base font-bold text-[color:var(--ink)]">
                Coming to this tab
              </h2>
              <p className="mt-1 text-[15px] text-[color:var(--ink-muted)]">
                {planned.length} topics are planned. Each one shows up under Updates when it opens.
              </p>
              <ul className="mt-3 grid gap-x-8 text-[15px] text-[color:var(--ink-muted)] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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

          <aside className="min-w-0 lg:self-start">
            <NotesPanel tabId={tab.id} tabTitle={tab.title} />
          </aside>
        </div>
      </div>
    </StudioShell>
  );
}
