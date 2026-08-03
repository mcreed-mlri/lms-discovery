"use client";

import { SectionHead } from "@/components/home/section-head";
import { SkillGlyph } from "@/components/skill-glyph";
import { getHue } from "@/lib/skill-hue";
import type { Skill, SkillId } from "@/lib/data";

// "Browse by skill" tile — the primary lens of the homepage. Each tile takes
// the next hue from the 8-hue palette BY INDEX, so the grid reads as one
// systematic family of orientation cues.
function SkillTile({
  skill,
  index,
  count,
  onSelect,
}: {
  skill: Skill;
  index: number;
  count: number;
  onSelect: (id: SkillId) => void;
}) {
  const hue = getHue(index);
  return (
    <button
      type="button"
      onClick={() => onSelect(skill.id)}
      className="interactive-tile group flex min-h-0 flex-col gap-2 p-3 text-left focus-ring sm:min-h-[8.25rem] sm:gap-2.5 sm:p-5"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition group-hover:scale-[1.02] sm:h-[46px] sm:w-[46px] sm:rounded-[12px]"
          style={{ background: hue.tint, color: hue.ink }}
        >
          <SkillGlyph kind={skill.glyph} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span className="rounded-[7px] border border-[color:var(--line)] bg-[color:var(--surface-sunken)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase leading-4 tracking-[0.03em] text-[color:var(--ink-soft)] sm:px-2 sm:text-[11px] sm:leading-5">
          {count} modules
        </span>
      </div>
      <h3 className="section-title text-[15px] leading-snug text-[color:var(--ink)] sm:mt-1 sm:text-[17px]">
        {skill.name}
      </h3>
      <p className="hidden line-clamp-2 text-[14px] leading-normal text-[color:var(--ink-muted)] sm:block">
        {skill.blurb}
      </p>
    </button>
  );
}

export function SkillsSection({
  tiles,
  onSelect,
}: {
  tiles: { skill: Skill; count: number }[];
  onSelect: (id: SkillId) => void;
}) {
  return (
    <section
      id="skills"
      className="mx-auto max-w-[1120px] scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))] px-4 py-4 sm:px-6 sm:py-9 lg:px-10"
      aria-label="Browse by skill"
    >
      <SectionHead kicker="Practical skills" title="What do you need to do?" />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {tiles.map(({ skill, count }, i) => (
          <SkillTile key={skill.id} skill={skill} index={i} count={count} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
