import Link from "next/link";
import type { CSSProperties } from "react";

import { ArrowIcon } from "@/components/icons";
import { SkillGlyph } from "@/components/skill-glyph";
import { ExampleLearningPath } from "@/components/path/example-learning-path";
import { skillAreas } from "@/lib/data";
import { learningPathExplanation } from "@/lib/demo-discovery";
import { coreSkillCards, type CoreSkillCard } from "@/lib/mocks/core-curriculum";
import { getHue } from "@/lib/skill-hue";

function CoreSkillTile({ skill }: { skill: CoreSkillCard }) {
  // Same hue and count as the rail row for this area, so the two never disagree.
  const area = skillAreas.find((entry) => entry.href === skill.href);
  const hue = getHue(area?.hueIndex ?? 0);
  const topicCount = area?.count ?? 0;

  return (
    <Link
      href={skill.href}
      style={
        {
          "--accent": hue.solid,
          "--accent-tint": hue.tint,
          "--accent-ink": hue.ink,
        } as CSSProperties
      }
      className="interactive-tile group relative flex min-h-0 flex-col overflow-hidden p-4 pt-5 text-left focus-ring before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[color:var(--accent)] before:opacity-[0.85] hover:border-[color:var(--accent)] sm:min-h-[11rem] sm:p-5 sm:pt-6"
    >
      <h3 className="section-title flex items-center gap-2 text-[16px] leading-snug text-[color:var(--ink)] sm:text-[17px]">
        <SkillGlyph
          kind={skill.glyph}
          className="h-[18px] w-[18px] shrink-0 text-[color:var(--accent-ink)]"
        />
        {skill.name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--ink-muted)] sm:text-[14px]">
        {skill.blurb}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        {/* Every topic in these areas is still planned, so the tile counts
            them rather than showing progress through content that isn't built. */}
        <span className="text-[12px] font-semibold tabular-nums text-[color:var(--ink-soft)]">
          {topicCount} planned {topicCount === 1 ? "topic" : "topics"}
        </span>
        <ArrowIcon className="h-4 w-4 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function HomeOverview({ catalogTotal }: { catalogTotal: number }) {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[1120px] scroll-mt-[calc(5rem+var(--safe-top))] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9"
    >
      <p className="section-label text-[color:var(--ink-soft)]">Legal skills</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {coreSkillCards.map((skill) => (
          <CoreSkillTile key={skill.id} skill={skill} />
        ))}
      </div>
      <p className="mt-4">
        <Link
          href="/browse"
          className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[color:var(--brand)] transition hover:text-[color:var(--brand-ink)] focus-ring"
        >
          Browse all {catalogTotal} items in the catalog
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </p>

      <div className="mt-10 sm:mt-12">
        <p className="mb-4 text-sm leading-6 text-[color:var(--ink-muted)]">
          {learningPathExplanation}
        </p>
        <ExampleLearningPath />
      </div>
    </section>
  );
}
