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
  { solid: "#2a5bff", tint: "#e9f0ff" }, // blue
  { solid: "#7a4fe0", tint: "#efeafd" }, // violet
  { solid: "#d24d83", tint: "#fce9f1" }, // pink
  { solid: "#c8791b", tint: "#fbf0dc" }, // amber
  { solid: "#179a72", tint: "#e2f4ed" }, // green
  { solid: "#3a8ec9", tint: "#e7f3fb" }, // sky
  { solid: "#5563d6", tint: "#ebedfc" }, // indigo
  { solid: "#bb573b", tint: "#fbe8e2" }, // rust
];

/** The hue at index `i`, wrapping after 8. */
export function getHue(i: number): SkillHue {
  return SKILL_HUES[((i % SKILL_HUES.length) + SKILL_HUES.length) % SKILL_HUES.length];
}
