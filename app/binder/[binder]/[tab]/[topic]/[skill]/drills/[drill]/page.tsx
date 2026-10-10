import { notFound } from "next/navigation";

import { QuickDrillView } from "@/components/quick-drill-view";
import { getSkillPath, skillPaths } from "@/lib/skill-paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return skillPaths.flatMap((path) =>
    path.drills.map((drill) => ({
      binder: path.binderId,
      tab: path.tabId,
      topic: path.topicId,
      skill: path.id,
      drill: drill.id,
    })),
  );
}

export default async function QuickDrillPage({
  params,
}: {
  params: Promise<{ binder: string; tab: string; topic: string; skill: string; drill: string }>;
}) {
  const { binder, tab, topic, skill, drill } = await params;
  const path = getSkillPath(skill);
  if (
    !path ||
    path.binderId !== binder ||
    path.tabId !== tab ||
    path.topicId !== topic ||
    !path.drills.some((d) => d.id === drill)
  ) {
    notFound();
  }
  return <QuickDrillView pathId={path.id} drillId={drill} />;
}
