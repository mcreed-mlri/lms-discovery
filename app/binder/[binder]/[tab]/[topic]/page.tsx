import { notFound } from "next/navigation";

import { BinderTopicView } from "@/components/binder-topic-view";
import { binders, getBinder, getSectionTabs, getTopic, getTopics } from "@/lib/binder";

// Every curriculum topic has a page while the hub is a prototype, so the whole
// binder can be clicked through. Planned topics show a "Coming" page.
export const dynamicParams = false;

export function generateStaticParams() {
  return binders.flatMap((binder) =>
    getSectionTabs(binder).flatMap((tab) =>
      getTopics(binder, tab.id).map((topic) => ({
        binder: binder.id,
        tab: tab.id,
        topic: topic.id,
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
  if (!binder || !topic) notFound();
  return <BinderTopicView binderId={binderId} tabId={tab} topicId={topicId} />;
}
