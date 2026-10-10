/* Search inside the binders: the things that are not catalog items but are
   often the fastest answer. Reference pages, practice drills, the open parts
   of a course, and topic pages. Results carry where they are filed
   ("Trial › Objections") and are ordered the way PRODUCT.md asks for: the
   quickest answer first, then practice, then the lesson, then the topic page.

   Library search (lib/search.ts) still covers courses, modules and paths. */

import { binders, getSectionTabs, hearsaySkills } from "@/lib/binder";
import { getTabTopics } from "@/lib/binder-topics";
import { drillHref } from "@/lib/practice";
import { scoreText } from "@/lib/search";

export type BinderHitKind = "Reference" | "Practice" | "Lesson" | "Topic";

export type BinderHit = {
  id: string;
  kind: BinderHitKind;
  title: string;
  /** Where it is filed, e.g. "Litigation › Trial › Objections". */
  context: string;
  href: string;
};

type Entry = BinderHit & {
  fields: { text: string; weight: number }[];
  /** Catalog item the user must be eligible for, when the entry comes from a course. */
  courseId?: string;
};

// Fastest answer first. Large enough to order kinds that both match well, small
// next to a title match, so a clearly better hit of a later kind still wins.
const kindBonus: Record<BinderHitKind, number> = {
  Reference: 160,
  Practice: 120,
  Lesson: 80,
  Topic: 40,
};

const HEARSAY_COURSE_ID = "legal-skills-hearsay";

function buildEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const binder of binders) {
    for (const tab of getSectionTabs(binder)) {
      for (const contents of getTabTopics(binder, tab.id).built) {
        const { topic } = contents;
        const place = `${binder.name} › ${tab.label} › ${topic.title}`;
        const placeText = {
          text: `${place} ${tab.title} ${topic.subTopics.join(" ")}`,
          weight: 24,
        };
        // A topic whose content all comes from one course needs that course.
        const courseId = contents.itemIds.length === 1 ? contents.itemIds[0] : undefined;

        entries.push({
          id: `topic-${tab.id}-${topic.id}`,
          kind: "Topic",
          title: topic.title,
          context: `${binder.name} › ${tab.label}`,
          href: topic.href,
          fields: [
            { text: topic.title, weight: 120 },
            { text: topic.subTopics.join(" "), weight: 90 },
            { text: `${binder.name} ${tab.label} ${tab.title}`, weight: 24 },
          ],
        });
        for (const page of contents.references) {
          entries.push({
            id: `reference-${page.href}`,
            kind: "Reference",
            title: page.title,
            context: place,
            href: page.href,
            fields: [{ text: page.title, weight: 120 }, { text: page.meta, weight: 22 }, placeText],
            courseId,
          });
        }
        for (const drill of contents.drills) {
          entries.push({
            id: `practice-${drill.id}`,
            kind: "Practice",
            title: drill.title,
            context: place,
            href: drillHref(drill),
            fields: [
              { text: drill.title, weight: 120 },
              { text: `${drill.summary} practice drill rehearse`, weight: 22 },
              placeText,
            ],
            courseId,
          });
        }
        if (contents.itemIds.includes(HEARSAY_COURSE_ID)) {
          hearsaySkills.forEach((skill, index) => {
            if (skill.status !== "open" || !skill.href) return;
            entries.push({
              id: `lesson-${HEARSAY_COURSE_ID}-${index + 1}`,
              kind: "Lesson",
              title: skill.title,
              context: `Hearsay part ${index + 1} · ${place}`,
              href: skill.href,
              fields: [
                { text: skill.title, weight: 120 },
                { text: "Legal Skills: Hearsay lesson", weight: 48 },
                placeText,
              ],
              courseId: HEARSAY_COURSE_ID,
            });
          });
        }
      }
    }
  }
  return entries;
}

// Binder content is module-level data, so the index is built once.
let index: Entry[] | null = null;

/** Binder hits for a query, best first, limited to courses the user can open. */
export function searchBinders(query: string, eligibleIds: Set<string>, limit = 4): BinderHit[] {
  index ??= buildEntries();
  return index
    .filter((entry) => !entry.courseId || eligibleIds.has(entry.courseId))
    .map((entry) => {
      const score = scoreText(entry.fields, query);
      return { entry, score: score > 0 ? score + kindBonus[entry.kind] : 0 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(({ entry }) => ({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      context: entry.context,
      href: entry.href,
    }));
}

/** Every binder entry as a hit, regardless of query or eligibility (for checks). */
export function listBinderEntries(): BinderHit[] {
  index ??= buildEntries();
  return index.map(({ id, kind, title, context, href }) => ({ id, kind, title, context, href }));
}
