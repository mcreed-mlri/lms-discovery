"use client";

import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { NotesPanel } from "@/components/notes-panel";
import { StudioShell } from "@/components/studio-shell";
import { getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTab, getSectionTabs } from "@/lib/binder";
import { describeContents, getTabTopics } from "@/lib/binder-topics";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { getLearningItemById, type LearningItem } from "@/lib/data";

/**
 * One divider's page in a binder: an index of its topics. Built topics are
 * rows that say what each holds and open the topic's own page; planned topics
 * wait behind one collapsed line (each opens a "Coming" page), so the page
 * stays a screen long however much the tab grows. Law changes for the tab sit under the index, and the
 * advocate's notes for the whole tab sit alongside.
 */
export function BinderSectionView({ binderId, tabId }: { binderId: string; tabId: string }) {
  const { user } = useAuth();
  const binder = getBinder(binderId);
  const tab = binder ? getSectionTab(binder, tabId) : undefined;
  if (!binder || !tab) return null;

  const { built, planned } = getTabTopics(binder, tabId);
  const rows = built.map((contents) => {
    const items = contents.itemIds
      .map((id) => getLearningItemById(id))
      .filter((item): item is LearningItem => item !== undefined);
    const courses = getEligibleLearningItems(items, user).length;
    return { contents, summary: describeContents(contents, courses) };
  });
  const changes = built.flatMap((contents) => contents.changes);
  const sections = getSectionTabs(binder);
  const index = sections.findIndex((t) => t.id === tabId);
  const previous = sections[index - 1];
  const next = sections[index + 1];

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <div className="border-b-4 border-[color:var(--binder)] pb-6">
          <p className="text-sm font-semibold text-[color:var(--ink-muted)]">
            <Link href={binder.href} className="underline-offset-[3px] hover:underline focus-ring">
              {binder.name}
            </Link>
          </p>
          <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[color:var(--ink)]">
            {tab.label}
          </h1>
          {tab.title !== tab.label ? (
            <p className="mt-1.5 text-[16px] text-[color:var(--ink-muted)]">{tab.title}</p>
          ) : null}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
          <div className="flex min-w-0 flex-col gap-8">
            <section aria-labelledby="topics">
              <h2
                id="topics"
                className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]"
              >
                Open in this tab
              </h2>
              {rows.length > 0 ? (
                <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
                  {rows.map(({ contents, summary }) => (
                    <li key={contents.topic.id} className="border-b border-[color:var(--line)]">
                      <Link
                        href={contents.topic.href}
                        className="group flex min-h-11 items-center justify-between gap-4 py-4 text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        <span className="min-w-0">
                          <span className="block text-[18px] font-bold">
                            {contents.topic.title}
                          </span>
                          {contents.topic.subTopics.length > 0 ? (
                            <span className="mt-0.5 block text-[14px] text-[color:var(--ink-muted)]">
                              {contents.topic.subTopics.join(", ")}
                            </span>
                          ) : null}
                          <span className="mt-1 block text-[13px] text-[color:var(--ink-soft)]">
                            {summary || "Not open for your role yet"}
                          </span>
                        </span>
                        <ArrowIcon className="h-5 w-5 shrink-0 text-[color:var(--ink)] transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[15px] text-[color:var(--ink-muted)]">
                  Nothing is open in this tab yet.
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

            {planned.length > 0 ? (
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-[6px] text-[15px] font-semibold text-[color:var(--ink)] focus-ring [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform group-open:rotate-90"
                  >
                    ›
                  </span>
                  {rows.length > 0
                    ? `${planned.length} more topics planned`
                    : `${planned.length} topics planned`}
                </summary>
                <ul className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {planned.map((topic) => (
                    <li key={topic.id} className="border-b border-[color:var(--line-soft)]">
                      <Link
                        href={topic.href}
                        className="flex min-h-11 items-center justify-between gap-3 py-2 text-[15px] text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-tint)] hover:text-[color:var(--ink)] focus-ring"
                      >
                        {topic.title}
                        {topic.tag ? (
                          <span className="text-[12px] text-[color:var(--ink-soft)]">
                            {topic.tag}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
                  Each one shows up under Updates when it opens. See where they fit on the{" "}
                  <Link href="/curriculum-map" className="underline underline-offset-[3px]">
                    curriculum map
                  </Link>
                  .
                </p>
              </details>
            ) : null}

            <nav
              aria-label="Other tabs"
              className="flex flex-wrap justify-between gap-4 border-t border-[color:var(--line)] pt-4 text-[14px] font-semibold"
            >
              {previous ? (
                <Link
                  href={previous.href}
                  className="rounded-[4px] text-[color:var(--ink)] underline-offset-[3px] hover:underline focus-ring"
                >
                  ‹ {previous.label}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={next.href}
                  className="rounded-[4px] text-[color:var(--ink)] underline-offset-[3px] hover:underline focus-ring"
                >
                  {next.label} ›
                </Link>
              ) : null}
            </nav>
          </div>

          <aside className="min-w-0 lg:self-start">
            <NotesPanel tabId={tab.id} tabTitle={tab.label} />
          </aside>
        </div>
      </div>
    </StudioShell>
  );
}
