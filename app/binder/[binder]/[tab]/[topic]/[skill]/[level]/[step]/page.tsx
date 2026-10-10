import { notFound } from "next/navigation";

import { SkillStepView } from "@/components/skill-step-view";
import { getSkillPath, skillPaths } from "@/lib/skill-paths";

export const dynamicParams = false;

// Watch and Help have pages; Solo is the practice room, linked directly.
export function generateStaticParams() {
  return skillPaths.flatMap((path) =>
    path.levels.flatMap((level) =>
      (["watch", "help"] as const)
        .filter((step) => level[step])
        .map((step) => ({
          binder: path.binderId,
          tab: path.tabId,
          topic: path.topicId,
          skill: path.id,
          level: `level-${level.n}`,
          step,
        })),
    ),
  );
}

export default async function SkillStepPage({
  params,
}: {
  params: Promise<{
    binder: string;
    tab: string;
    topic: string;
    skill: string;
    level: string;
    step: string;
  }>;
}) {
  const { binder, tab, topic, skill, level, step } = await params;
  const path = getSkillPath(skill);
  const levelNumber = Number(/^level-(\d+)$/.exec(level)?.[1]);
  const found = path?.levels.find((l) => l.n === levelNumber);
  if (
    !path ||
    path.binderId !== binder ||
    path.tabId !== tab ||
    path.topicId !== topic ||
    !found ||
    (step !== "watch" && step !== "help") ||
    !found[step]
  ) {
    notFound();
  }
  return <SkillStepView pathId={path.id} levelNumber={found.n} step={step} />;
}
