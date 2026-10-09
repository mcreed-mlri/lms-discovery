import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { getStatusTheme, resolveStatusKey } from "@/lib/course-theme";
import {
  contentUpdates,
  getLearningItemUrl,
  modules,
  skillAreas,
  subjectAreas,
  type LearningItem,
} from "@/lib/data";
import { getHue } from "@/lib/skill-hue";

// The built courses an attorney can open today, in the order they are most
// likely to need them. Everything in the curriculum index is still planned.
const AVAILABLE_NOW = ["eviction-defense-48h", "legal-skills-hearsay", "welcome-to-lace"];

function availableMeta(item: LearningItem) {
  if (item.type !== "COURSE") return null;
  const courseModules = modules.filter((module) => module.courseId === item.id);
  const parts = [item.practiceArea];
  if (courseModules.length > 0) parts.push(`${courseModules.length} modules`);
  parts.push(item.duration.replace(/^~/, "about "));
  return parts.join(" · ");
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="text-[22px] font-extrabold tracking-[-0.015em] text-[color:var(--ink)]">
      {children}
    </h2>
  );
}

export function HomeOverview({
  catalogTotal,
  allItems,
}: {
  catalogTotal: number;
  allItems: LearningItem[];
}) {
  const topicTotal = skillAreas.reduce((sum, area) => sum + area.count, 0);
  const available = AVAILABLE_NOW.map((id) =>
    allItems.find((item) => item.type === "COURSE" && item.id === id),
  ).filter((item): item is LearningItem => Boolean(item));
  const update = contentUpdates[0];
  const updateStatus = update ? getStatusTheme(resolveStatusKey(update.tag)) : null;

  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-11 lg:px-11 lg:pt-11">
      <section id="skills" aria-labelledby="curriculum-heading" className="min-w-0 scroll-mt-24">
        <SectionHeading id="curriculum-heading">The curriculum</SectionHeading>
        <p className="mt-0.5 text-[13px] text-[color:var(--ink-soft)]">
          Legal skills: {skillAreas.length} areas, {topicTotal} topics, all planned. Open an area to
          see its topics and where they stand.
        </p>
        <ul className="mt-4 grid border-t-[1.5px] border-[color:var(--ink)] sm:grid-cols-2 sm:gap-x-10">
          {skillAreas.map((area) => (
            <li key={area.id} className="flex">
              <Link
                href={area.href}
                className="flex min-h-11 w-full items-center gap-2.5 border-b border-[color:var(--line)] px-0.5 py-2 text-[14px] font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--hover-tint)] focus-ring"
              >
                {/* A divider-tab swatch in the area's hue. */}
                <span
                  aria-hidden="true"
                  className="h-3.5 w-2.5 shrink-0 rounded-t-[2px]"
                  style={{ background: getHue(area.hueIndex).solid }}
                />
                <span className="min-w-0 flex-1">{area.name}</span>
                {/* Every row says planned, so none reads as openable next to
                    "Available now". */}
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)]">
                  {area.count} planned
                  <span className="sr-only"> topics</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-[color:var(--ink-soft)]">
          Subject-area training (
          {subjectAreas
            .slice(0, 3)
            .map((area) => area.name.replace(/ Law$/, ""))
            .join(", ")}{" "}
          and {Math.max(subjectAreas.length - 3, 0)} more) is on the{" "}
          <Link
            href="/curriculum-map"
            className="rounded-[3px] font-semibold text-[color:var(--ink)] underline underline-offset-[3px] focus-ring"
          >
            curriculum map
          </Link>
          .{" "}
          <Link
            href="/browse"
            className="rounded-[3px] font-semibold text-[color:var(--ink)] underline underline-offset-[3px] focus-ring"
          >
            Browse all {catalogTotal} items
          </Link>
          .
        </p>
      </section>

      <div className="flex min-w-0 flex-col gap-8">
        {available.length > 0 ? (
          <section aria-labelledby="available-heading">
            <h2
              id="available-heading"
              className="text-[17px] font-extrabold tracking-[-0.01em] text-[color:var(--ink)]"
            >
              Available now
            </h2>
            <ul className="mt-2.5 border-t-[1.5px] border-[color:var(--ink)]">
              {available.map((item) => (
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
