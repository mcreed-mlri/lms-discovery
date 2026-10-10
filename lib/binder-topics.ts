/* What each topic in a binder tab holds today: the built courses filed under
   it, its reference pages, its practice drills and the law changes that reach
   it through those courses. The tab page lists topics with these counts, the
   topic page shows them, and a topic with none of them is still planned.

   Pure data, no "use client", so the topic route's generateStaticParams can
   read it. */

import {
  filedTopics,
  getTopics,
  referencePages,
  type Binder,
  type BinderTopic,
  type ReferencePage,
} from "@/lib/binder";
import { contentUpdates, type ContentUpdate } from "@/lib/data";
import { getDrillsForTopic, type PracticeDrill } from "@/lib/practice";

export type TopicContents = {
  topic: BinderTopic;
  /** Learning-item ids, before eligibility filtering. */
  itemIds: string[];
  references: ReferencePage[];
  drills: PracticeDrill[];
  changes: ContentUpdate[];
};

export function getTopicContents(tabId: string, topic: BinderTopic): TopicContents {
  const itemIds = filedTopics[tabId]?.[topic.id] ?? [];
  return {
    topic,
    itemIds,
    references: referencePages[`${tabId}/${topic.id}`] ?? [],
    drills: getDrillsForTopic(tabId, topic.id),
    changes: contentUpdates.filter((update) => itemIds.includes(update.courseId)),
  };
}

/** Built means something is filed there; only built topics get a page. */
export function isBuilt(contents: TopicContents) {
  return contents.itemIds.length + contents.references.length + contents.drills.length > 0;
}

/** A tab's topics split into built (with their contents) and planned (names only). */
export function getTabTopics(binder: Binder, tabId: string) {
  const all = getTopics(binder, tabId).map((topic) => getTopicContents(tabId, topic));
  return {
    built: all.filter(isBuilt),
    planned: all.filter((contents) => !isBuilt(contents)).map((contents) => contents.topic),
  };
}

/** "1 course · 1 drill · 2 references", counting courses the user can open. */
export function describeContents(contents: TopicContents, courseCount: number) {
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return [
    courseCount > 0 ? plural(courseCount, "course") : null,
    contents.drills.length > 0 ? plural(contents.drills.length, "drill") : null,
    contents.references.length > 0 ? plural(contents.references.length, "reference") : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
