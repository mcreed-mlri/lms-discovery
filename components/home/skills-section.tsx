"use client";

import { SectionBand } from "@/components/home/section-band";
import { ArrowIcon } from "@/components/icons";
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
      className="interactive-tile group relative flex min-h-0 flex-col overflow-hidden p-3 text-left focus-ring sm:min-h-[11rem] sm:p-4"
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--accent-tint)] text-[color:var(--accent-ink)] transition group-hover:scale-[1.02] sm:h-11 sm:w-11">
          <SkillGlyph kind={skill.glyph} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
      </div>
      <h3 className="section-title mt-3 text-[15px] leading-snug text-[color:var(--ink)] sm:text-[17px]">
        {skill.name}
      </h3>
      <p className="mt-1.5 hidden min-h-[2.75rem] text-[14px] leading-snug text-[color:var(--ink-muted)] sm:line-clamp-2 sm:block">
        {skill.blurb}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[12px] font-semibold text-[color:var(--ink-soft)]">
          {count} modules
        </span>
        <ArrowIcon className="h-4 w-4 text-[color:var(--ink-soft)] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
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
    <SectionBand
      id="skills"
      label="Practical Skills"
      helper="Build everyday skills for legal aid practice."
    >
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {tiles.map(({ skill, count }) => (
          <SkillTile key={skill.id} skill={skill} count={count} onSelect={onSelect} />
        ))}
      </div>
    </SectionBand>
  );
}
