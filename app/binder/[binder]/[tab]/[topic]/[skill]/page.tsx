import { notFound } from "next/navigation";

import { SkillPathView } from "@/components/skill-path-view";
import { getSkillPath, skillPaths } from "@/lib/skill-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return skillPaths.map((path) => ({
    binder: path.binderId,
    tab: path.tabId,
    topic: path.topicId,
    skill: path.id,
  }));
}

export default async function SkillPathPage({
  params,
}: {
  params: Promise<{ binder: string; tab: string; topic: string; skill: string }>;
}) {
  const { binder, tab, topic, skill } = await params;
  const path = getSkillPath(skill);
  if (!path || path.binderId !== binder || path.tabId !== tab || path.topicId !== topic) {
    notFound();
  }
  return <SkillPathView pathId={path.id} />;
}
