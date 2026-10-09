/* ============================================================================
   Skill-hue palette — the binder's divider colours
   ----------------------------------------------------------------------------
   Eight hues from the divider set: ultramarine, teal, grass, chrome yellow,
   oxide orange, violet, graphite, sienna. Assigned BY SKILL (see
   SKILL_HUE_INDEX below) — not by topic family, and not by grid position: a
   skill lens keeps its hue on the Home curriculum index, the drawer's
   skill-area swatches, and every course/module card in that area. The lenses
   the curriculum uses most get the brightest dividers; graphite and sienna go
   to the rarest, so the index never reads as grey.

   These reference the `--hue-1..8` CSS vars in app/globals.css, which hold the
   values (and their measured -ink pairs) for both themes.
   ========================================================================= */

import type { SkillId } from "@/lib/data";

export type SkillHue = {
  /** Saturated colour — icon strokes, swatches, accent bars. */
  solid: string;
  /** Pale fill — icon wells, tile backgrounds. */
  tint: string;
  /** Readable text colour for labels sitting on `tint`. The saturated `solid`
   *  is NOT accessible as small text on its own pale tint (it lands near 3:1);
   *  this is the same solid darkened until it clears 4.5:1. */
  ink: string;
};

export const SKILL_HUES: readonly SkillHue[] = [
  { solid: "var(--hue-1)", tint: "var(--hue-1-tint)", ink: "var(--hue-1-ink)" }, // ultramarine
  { solid: "var(--hue-2)", tint: "var(--hue-2-tint)", ink: "var(--hue-2-ink)" }, // teal
  { solid: "var(--hue-3)", tint: "var(--hue-3-tint)", ink: "var(--hue-3-ink)" }, // grass
  { solid: "var(--hue-4)", tint: "var(--hue-4-tint)", ink: "var(--hue-4-ink)" }, // chrome yellow
  { solid: "var(--hue-5)", tint: "var(--hue-5-tint)", ink: "var(--hue-5-ink)" }, // oxide orange
  { solid: "var(--hue-6)", tint: "var(--hue-6-tint)", ink: "var(--hue-6-ink)" }, // violet
  { solid: "var(--hue-7)", tint: "var(--hue-7-tint)", ink: "var(--hue-7-ink)" }, // graphite
  { solid: "var(--hue-8)", tint: "var(--hue-8-tint)", ink: "var(--hue-8-ink)" }, // sienna
];

/** The hue at index `i`, wrapping after 8. */
export function getHue(i: number): SkillHue {
  return SKILL_HUES[((i % SKILL_HUES.length) + SKILL_HUES.length) % SKILL_HUES.length];
}

/* ----------------------------------------------------------------------------
   Skill → hue assignment
   ----------------------------------------------------------------------------
   THE single assignment of hue to skill lens, so one skill reads as one colour
   everywhere: the homepage skill tiles read it by id, and each curriculum
   skill-area course + its modules inherit it as `hueIndex`
   (lib/curriculum-catalog.ts), which is what getItemAccent resolves.

   Keyed by skill id, NOT by grid position: the homepage hides skill lenses the
   signed-in user has no content for, so a positional index would slide every
   colour along for those users.
   -------------------------------------------------------------------------- */
export const SKILL_HUE_INDEX: Record<SkillId, number> = {
  interviewing: 0, // ultramarine
  drafting: 1, // teal
  research: 2, // grass
  triage: 3, // chrome yellow
  ethics: 4, // oxide orange
  courtroom: 5, // violet
  negotiation: 6, // graphite
  counseling: 7, // sienna
};

export function getSkillHueIndex(skillId: SkillId): number {
  return SKILL_HUE_INDEX[skillId];
}

/** The hue a skill lens owns, wherever it appears. */
export function getSkillHue(skillId: SkillId): SkillHue {
  return getHue(getSkillHueIndex(skillId));
}
