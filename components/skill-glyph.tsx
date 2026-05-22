import type { SkillGlyphKind } from "@/lib/data";

type SkillGlyphProps = {
  kind: SkillGlyphKind;
  className?: string;
};

// Hand-drawn-feel line glyphs, one per legal skill. Kept distinct from the
// generic icon set so the "Browse by skill" grid reads as its own vocabulary.
export function SkillGlyph({ kind, className }: SkillGlyphProps) {
  const props = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (kind) {
    case "interview": // two overlapping speech bubbles
      return (
        <svg {...props}>
          <path d="M5 7h12v9H11l-3 3v-3H5z" />
          <path d="M15 13h12v9h-3l3 3v-3H15z" />
        </svg>
      );
    case "draft": // a pen drawing a line
      return (
        <svg {...props}>
          <path d="M4 26h24" />
          <path d="m6 22 13-13 3 3-13 13z" />
          <path d="m17 11 3 3" />
          <path d="m4 26 4-1" />
        </svg>
      );
    case "counsel": // a heart held in cupped hands
      return (
        <svg {...props}>
          <path d="M5 19c0-4 3-7 7-7s7 3 7 7" />
          <path d="M19 15c4-1 7 1 7 5" />
          <path d="M12 12c0-2 1-3 3-3s3 1 3 3-2 4-3 4-3-2-3-4z" />
          <path d="M3 23h26" />
        </svg>
      );
    case "triage": // a branching decision arrow
      return (
        <svg {...props}>
          <path d="M16 4v8" />
          <path d="M16 12c-2 0-4 2-4 4v8" />
          <path d="M16 12c2 0 4 2 4 4v8" />
          <circle cx="16" cy="4" r="2" />
          <circle cx="12" cy="26" r="2" />
          <circle cx="20" cy="26" r="2" />
        </svg>
      );
    case "negotiate": // two arrows facing each other
      return (
        <svg {...props}>
          <path d="M5 12h12" />
          <path d="m13 8 4 4-4 4" />
          <path d="M27 20H15" />
          <path d="m19 24-4-4 4-4" />
        </svg>
      );
    case "court": // a courthouse with columns
      return (
        <svg {...props}>
          <path d="M4 12h24" />
          <path d="m16 4 12 8H4z" />
          <path d="M8 14v10M14 14v10M18 14v10M24 14v10" />
          <path d="M3 26h26" />
        </svg>
      );
    case "ethics": // the scales of justice
      return (
        <svg {...props}>
          <path d="M16 4v22" />
          <path d="M9 26h14" />
          <path d="M6 10h20" />
          <path d="M6 10 3 18a3 3 0 0 0 6 0z" />
          <path d="M26 10 23 18a3 3 0 0 0 6 0z" />
        </svg>
      );
    case "research": // a magnifier over a document
      return (
        <svg {...props}>
          <path d="M6 4h14v22H6z" />
          <path d="M10 9h7M10 14h7M10 19h4" />
          <circle cx="22" cy="22" r="4" />
          <path d="m25 25 3 3" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="6" />
        </svg>
      );
  }
}
