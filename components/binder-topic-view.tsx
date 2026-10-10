"use client";

import Link from "next/link";

import { HearsaySkills } from "@/components/hearsay-skills";
import { NotesPanel } from "@/components/notes-panel";
import { StudioShell } from "@/components/studio-shell";
import { getEligibleLearningItems } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { getBinder, getSectionTab, getTopic } from "@/lib/binder";
import { getTabTopics, getTopicContents, isBuilt } from "@/lib/binder-topics";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import { getLearningItemById, getLearningItemUrl, type LearningItem } from "@/lib/data";
import { drillHref } from "@/lib/practice";
import { getSkillPathsForTopic, skillHref } from "@/lib/skill-paths";

const h2Class = "text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]";

/**
 * One topic inside a binder tab, e.g. Litigation › Trial › Objections. Laid
 * out for the moment before a hearing: the reference to keep open first, then
 * practice, then the courses (grouped by skill, with their parts), then any
 * law change. Notes here are filed under the topic.
 *
 * A planned topic gets a page too while the hub is a prototype: a plain
 * "Coming" state with what the curriculum map says it will cover, and the
 * topics in the same tab that are open now.
 */
export function BinderTopicView({
  binderId,
  tabId,
  topicId,
}: {
  binderId: string;
  tabId: string;
  topicId: string;
}) {
  const { user } = useAuth();
  const binder = getBinder(binderId);
  const tab = binder ? getSectionTab(binder, tabId) : undefined;
  const topic = binder && tab ? getTopic(binder, tabId, topicId) : undefined;
  if (!binder || !tab || !topic) return null;

  const contents = getTopicContents(tabId, topic);
  const { itemIds, references, drills, changes } = contents;
  const skillPaths = getSkillPathsForTopic(tabId, topicId);
  const built = isBuilt(contents);
  const openNearby = built ? [] : getTabTopics(binder, tabId).built.map((nearby) => nearby.topic);
  const courses = getEligibleLearningItems(
    itemIds
      .map((id) => getLearningItemById(id))
      .filter((item): item is LearningItem => item !== undefined),
    user,
  );

  return (
    <StudioShell>
      <div className="flex flex-col gap-8">
        <div className="border-b-4 border-[color:var(--binder)] pb-6">
          <nav
            aria-label="Breadcrumb"
            className="text-sm font-semibold text-[color:var(--ink-muted)]"
          >
            <Link href={binder.href} className="underline-offset-[3px] hover:underline focus-ring">
              {binder.name}
            </Link>
            {" › "}
            <Link href={tab.href} className="underline-offset-[3px] hover:underline focus-ring">
              {tab.label}
            </Link>
            {" › "}
            <span aria-current="page" className="text-[color:var(--ink)]">
              {topic.title}
            </span>
          </nav>
          <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[color:var(--ink)]">
            {topic.title}
          </h1>
          {!built ? (
            <p className="mt-3 flex flex-wrap gap-2">
              <span className="metadata inline-flex rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-2 py-0.5 text-[color:var(--ink-muted)]">
                Coming
              </span>
              {topic.tag ? (
                <span className="metadata inline-flex rounded-[4px] border border-[color:var(--line)] px-2 py-0.5 text-[color:var(--ink-muted)]">
                  {topic.tag}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-11">
          <div className="flex min-w-0 flex-col gap-9">
            {!built ? (
              <section aria-labelledby="coming">
                <h2 id="coming" className={h2Class}>
                  Nothing here yet
                </h2>
                <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-[color:var(--ink-muted)]">
                  {topic.title} is planned for {tab.title}. When it opens, this page will hold quick
                  reference, practice and courses, and it will show up under Updates.
                </p>
                {topic.subTopics.length > 0 ? (
                  <>
                    <h3 className="mt-6 text-[15px] font-bold text-[color:var(--ink)]">
                      Planned to cover
                    </h3>
                    <ul className="mt-2 border-t border-[color:var(--line)] text-[15px] text-[color:var(--ink-muted)]">
                      {topic.subTopics.map((sub) => (
                        <li key={sub} className="border-b border-[color:var(--line-soft)] py-2.5">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <p className="mt-4 text-sm text-[color:var(--ink-soft)]">
                  See where it fits on the{" "}
                  <Link href="/curriculum-map" className="underline underline-offset-[3px]">
                    curriculum map
                  </Link>
                  .
                </p>
              </section>
            ) : null}

            {openNearby.length > 0 ? (
              <section aria-labelledby="open-nearby">
                <h2 id="open-nearby" className="text-[17px] font-extrabold text-[color:var(--ink)]">
                  Open now in {tab.label}
                </h2>
                <ul className="mt-2.5 border-t-[1.5px] border-[color:var(--ink)]">
                  {openNearby.map((nearby) => (
                    <li key={nearby.id} className="border-b border-[color:var(--line)]">
                      <Link
                        href={nearby.href}
                        className="flex min-h-11 items-center justify-between gap-3 py-3 text-[15px] font-bold text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        {nearby.title}
                        <span aria-hidden="true">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {references.length > 0 ? (
              <section aria-labelledby="keep-at-hand">
                <h2 id="keep-at-hand" className={h2Class}>
                  Keep at hand
                </h2>
                <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
                  Quick reference, no need to start the course. Prototype content, not yet reviewed.
                </p>
                <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
                  {references.map((page) => (
                    <li key={page.href} className="border-b border-[color:var(--line)]">
                      <a
                        href={page.href}
                        className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 text-[color:var(--ink)] hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        <span>
                          <span className="block text-[16px] font-bold">{page.title}</span>
                          <span className="mt-0.5 block text-[13px] text-[color:var(--ink-muted)]">
                            {page.meta}
                          </span>
                        </span>
                        <span className="text-[14px] font-bold text-[color:var(--brand-ink)]">
                          Open
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {drills.length > 0 || skillPaths.length > 0 ? (
              <section aria-labelledby="practice">
                <h2 id="practice" className={h2Class}>
                  Practice
                </h2>
                <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
                  Rehearse before court. Nothing is graded or recorded.
                </p>
                <ul className="mt-3 flex flex-col gap-3">
                  {skillPaths.map((path) => (
                    <li key={path.id}>
                      <Link
                        href={skillHref(path)}
                        className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-[12px] border-2 border-[color:var(--binder)] px-5 py-4 transition hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        <span className="min-w-0 flex-1 basis-80">
                          <span className="block text-[17px] font-extrabold text-[color:var(--ink)]">
                            {path.title}: practice levels
                          </span>
                          <span className="mt-0.5 block text-[14px] leading-relaxed text-[color:var(--ink-muted)]">
                            {path.levels.length} levels, simple to complex. Watch an expert, finish
                            one with help, then do it solo. Plus quick drills.
                          </span>
                        </span>
                        <span className="text-[15px] font-bold text-[color:var(--brand-ink)]">
                          Open levels
                        </span>
                      </Link>
                    </li>
                  ))}
                  {drills.map((drill) => (
                    <li key={drill.id}>
                      <Link
                        href={drillHref(drill)}
                        className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-[12px] border-[1.5px] border-[color:var(--ink)] px-5 py-4 transition hover:bg-[color:var(--hover-tint)] focus-ring"
                      >
                        <span className="min-w-0 flex-1 basis-80">
                          <span className="block text-[17px] font-extrabold text-[color:var(--ink)]">
                            {drill.title}
                          </span>
                          <span className="mt-0.5 block text-[14px] leading-relaxed text-[color:var(--ink-muted)]">
                            {drill.summary}
                          </span>
                        </span>
                        <span className="text-[15px] font-bold text-[color:var(--brand-ink)]">
                          Start practice
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {courses.length > 0 ? (
              <section aria-labelledby="courses">
                <h2 id="courses" className={h2Class}>
                  Courses
                </h2>
                <ul className="mt-3 border-t-[1.5px] border-[color:var(--ink)]">
                  {courses.map((item) => (
                    <li key={item.id} className="border-b border-[color:var(--line)] pb-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-4">
                        <span className="min-w-0">
                          <span className="block text-[17px] font-bold text-[color:var(--ink)]">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-[color:var(--ink-muted)]">
                            {item.description}
                          </span>
                        </span>
                        <a
                          href={getLearningItemUrl(item)}
                          className="rounded-[4px] text-[14px] font-bold text-[color:var(--brand-ink)] underline-offset-[3px] hover:underline focus-ring"
                        >
                          Course home
                        </a>
                      </div>
                      {item.id === "legal-skills-hearsay" ? <HearsaySkills /> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {changes.length > 0 ? (
              <section aria-labelledby="new-law">
                <h2 id="new-law" className={h2Class}>
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

            <p className="text-[14px] font-semibold">
              <Link
                href={tab.href}
                className="rounded-[4px] text-[color:var(--ink)] underline-offset-[3px] hover:underline focus-ring"
              >
                ‹ All of {tab.label}
              </Link>
            </p>
          </div>

          <aside className="min-w-0 lg:self-start">
            <NotesPanel tabId={`${tab.id}/${topic.id}`} tabTitle={topic.title} />
          </aside>
        </div>
      </div>
    </StudioShell>
  );
}
