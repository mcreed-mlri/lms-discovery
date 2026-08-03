"use client";

import { SectionHead } from "@/components/home/section-head";
import { SkillGlyph } from "@/components/skill-glyph";
import { getSkillHue } from "@/lib/skill-hue";
import type { Skill, SkillId } from "@/lib/data";
import type { CSSProperties } from "react";

// "Browse by skill" tile — the primary lens of the homepage. Each tile takes the
// hue its skill owns in the 8-hue palette (lib/skill-hue.ts) — the same hue the
// cards for that skill area carry — so the grid reads as one systematic family
// of orientation cues. The colour lands twice: a left rail on the tile edge, and
// the icon well. The tile background stays neutral.
function SkillTile({
  skill,
  count,
  onSelect,
}: {
  skill: Skill;
  count: number;
  onSelect: (id: SkillId) => void;
}) {
  const hue = getSkillHue(skill.id);
  return (
    <button
      type="button"
      style={
        {
          "--accent": hue.solid,
          "--accent-tint": hue.tint,
          "--accent-ink": hue.ink,
        } as CSSProperties
      }
      onClick={() => onSelect(skill.id)}
      className="interactive-tile group relative flex min-h-0 flex-col gap-2 overflow-hidden p-3 text-left before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[color:var(--accent)] focus-ring sm:min-h-[8.25rem] sm:gap-2.5 sm:p-5"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--accent-tint)] text-[color:var(--accent-ink)] transition group-hover:scale-[1.02] sm:h-[46px] sm:w-[46px] sm:rounded-[12px]">
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
        {tiles.map(({ skill, count }) => (
          <SkillTile key={skill.id} skill={skill} count={count} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
