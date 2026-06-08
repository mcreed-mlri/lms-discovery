/* ============================================================================
   Skill-hue palette — Studio "Direction A2"
   ----------------------------------------------------------------------------
   Eight disciplined hues with an identical saturation/lightness feel, so a grid
   of them reads as one systematic family rather than a rainbow. Used BY INDEX
   (not by topic) on the "Browse by skill" tiles and the rail's practice-area
   swatches: the Nth tile takes the Nth hue, wrapping after 8.

   Raw hexes live here for inline use (SVG strokes, swatch backgrounds). The same
   values are mirrored as `--hue-1..8` CSS vars in app/globals.css — keep in sync.
   ========================================================================= */

export type SkillHue = {
  /** Saturated colour — icon strokes, swatches, accent bars. */
  solid: string;
  /** Pale fill — icon wells, tile backgrounds. */
  tint: string;
};

export const SKILL_HUES: readonly SkillHue[] = [
  { solid: "var(--hue-1)", tint: "var(--hue-1-tint)" }, // blue
  { solid: "var(--hue-2)", tint: "var(--hue-2-tint)" }, // violet
  { solid: "var(--hue-3)", tint: "var(--hue-3-tint)" }, // pink
  { solid: "var(--hue-4)", tint: "var(--hue-4-tint)" }, // amber
  { solid: "var(--hue-5)", tint: "var(--hue-5-tint)" }, // green
  { solid: "var(--hue-6)", tint: "var(--hue-6-tint)" }, // sky
  { solid: "var(--hue-7)", tint: "var(--hue-7-tint)" }, // indigo
  { solid: "var(--hue-8)", tint: "var(--hue-8-tint)" }, // rust
];

/** The hue at index `i`, wrapping after 8. */
export function getHue(i: number): SkillHue {
  return SKILL_HUES[((i % SKILL_HUES.length) + SKILL_HUES.length) % SKILL_HUES.length];
}
