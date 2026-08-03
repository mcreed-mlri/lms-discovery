/* ============================================================================
   Skill-hue palette — Studio "Direction A2"
   ----------------------------------------------------------------------------
   Eight disciplined hues with an identical saturation/lightness feel, so a grid
   of them reads as one systematic family rather than a rainbow. Used BY INDEX
   (not by topic) on the "Browse by skill" tiles and the rail's practice-area
   swatches: the Nth tile takes the Nth hue, wrapping after 8.

   The set is deliberately grounded — steel, teal, olive, amber, green, sky,
   graphite, rust. No violet or pink, and one slot spent on graphite so ink
   stays in rotation as a colour.

   Raw hexes live here for inline use (SVG strokes, swatch backgrounds). The same
   values are mirrored as `--hue-1..8` CSS vars in app/globals.css — keep in sync.
   ========================================================================= */

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
  { solid: "var(--hue-1)", tint: "var(--hue-1-tint)", ink: "var(--hue-1-ink)" }, // steel
  { solid: "var(--hue-2)", tint: "var(--hue-2-tint)", ink: "var(--hue-2-ink)" }, // teal
  { solid: "var(--hue-3)", tint: "var(--hue-3-tint)", ink: "var(--hue-3-ink)" }, // olive
  { solid: "var(--hue-4)", tint: "var(--hue-4-tint)", ink: "var(--hue-4-ink)" }, // amber
  { solid: "var(--hue-5)", tint: "var(--hue-5-tint)", ink: "var(--hue-5-ink)" }, // green
  { solid: "var(--hue-6)", tint: "var(--hue-6-tint)", ink: "var(--hue-6-ink)" }, // sky
  { solid: "var(--hue-7)", tint: "var(--hue-7-tint)", ink: "var(--hue-7-ink)" }, // graphite
  { solid: "var(--hue-8)", tint: "var(--hue-8-tint)", ink: "var(--hue-8-ink)" }, // rust
];

/** The hue at index `i`, wrapping after 8. */
export function getHue(i: number): SkillHue {
  return SKILL_HUES[((i % SKILL_HUES.length) + SKILL_HUES.length) % SKILL_HUES.length];
}
