import { notFound } from "next/navigation";

import { BinderTopicView } from "@/components/binder-topic-view";
import { binders, getBinder, getSectionTabs, getTopic } from "@/lib/binder";
import { getTabTopics, getTopicContents, isBuilt } from "@/lib/binder-topics";

// Only built topics have a page; a planned topic is a name on its tab, never
// an empty page to click into.
export const dynamicParams = false;

export function generateStaticParams() {
  return binders.flatMap((binder) =>
    getSectionTabs(binder).flatMap((tab) =>
      getTabTopics(binder, tab.id).built.map((contents) => ({
        binder: binder.id,
        tab: tab.id,
        topic: contents.topic.id,
      })),
    ),
  );
}

export default async function BinderTopicPage({
  params,
}: {
  params: Promise<{ binder: string; tab: string; topic: string }>;
}) {
  const { binder: binderId, tab, topic: topicId } = await params;
  const binder = getBinder(binderId);
  const topic = binder ? getTopic(binder, tab, topicId) : undefined;
  if (!binder || !topic || !isBuilt(getTopicContents(tab, topic))) notFound();
  return <BinderTopicView binderId={binderId} tabId={tab} topicId={topicId} />;
}
