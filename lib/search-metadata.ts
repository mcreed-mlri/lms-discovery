import type { LearningItem } from "@/lib/data";

export type SearchAudience = "New attorneys" | "All staff" | "Supervisors" | "Program staff";
export type ContentLifecycleStatus = "Recommended" | "New" | "Updated" | "Core";

export type SearchMetadata = {
  audience: SearchAudience[];
  status: ContentLifecycleStatus;
  editorialBoost?: number;
  synonyms?: string[];
  reviewedAt: string;
};

export const defaultSearchMetadata: SearchMetadata = {
  audience: ["All staff"],
  status: "Core",
  reviewedAt: "2026-05-21",
};

export const searchMetadataById: Record<string, SearchMetadata> = {
  "brightspace-wrapper-demo": {
    audience: ["Program staff"],
    status: "Updated",
    editorialBoost: 12,
    synonyms: ["interactive elements", "wrappers", "d2l demo"],
    reviewedAt: "2026-05-21",
  },
  "professional-foundations": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 24,
    synonyms: ["ethics", "professional responsibility", "mission"],
    reviewedAt: "2026-05-21",
  },
  "client-centered-practice": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 20,
    synonyms: ["intake", "client interview", "counseling"],
    reviewedAt: "2026-05-21",
  },
  "first-steps-in-court": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 20,
    synonyms: ["hearing", "court appearance", "courtroom"],
    reviewedAt: "2026-05-21",
  },
  "wrapper-static-layouts": {
    audience: ["Program staff"],
    status: "Core",
    synonyms: ["accordions", "tabs", "callouts"],
    reviewedAt: "2026-05-21",
  },
  "wrapper-self-checks": {
    audience: ["Program staff"],
    status: "Updated",
    editorialBoost: 8,
    synonyms: ["knowledge checks", "practice checks", "sequencing"],
    reviewedAt: "2026-05-21",
  },
  "wrapper-insert-media": {
    audience: ["Program staff"],
    status: "New",
    synonyms: ["video", "image hotspots", "media"],
    reviewedAt: "2026-05-21",
  },
  "ethics-and-confidentiality": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["privilege", "conflicts", "professional conduct"],
    reviewedAt: "2026-05-21",
  },
  "legal-aid-environment": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["mission", "organization", "legal services"],
    reviewedAt: "2026-05-21",
  },
  "case-notes-and-compliance": {
    audience: ["New attorneys", "Program staff"],
    status: "Core",
    synonyms: ["time records", "documentation", "grant reporting"],
    reviewedAt: "2026-05-21",
  },
  "first-client-interview": {
    audience: ["New attorneys", "All staff"],
    status: "Updated",
    editorialBoost: 14,
    synonyms: ["intake", "client intake", "fact gathering"],
    reviewedAt: "2026-05-21",
  },
  "trauma-informed-communication": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 12,
    synonyms: ["trauma informed", "sensitive facts", "client communication"],
    reviewedAt: "2026-05-21",
  },
  "safety-screening": {
    audience: ["New attorneys", "All staff"],
    status: "New",
    editorialBoost: 10,
    synonyms: ["dv", "domestic violence", "crisis", "safety risk"],
    reviewedAt: "2026-05-21",
  },
  "courtroom-roles-etiquette": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["courtroom procedure", "clerks", "bench"],
    reviewedAt: "2026-05-21",
  },
  "preparing-client-for-court": {
    audience: ["New attorneys", "All staff"],
    status: "Core",
    synonyms: ["hearing preparation", "client preparation", "court appearance"],
    reviewedAt: "2026-05-21",
  },
  "first-appearance-checklist": {
    audience: ["New attorneys"],
    status: "Updated",
    editorialBoost: 14,
    synonyms: ["first hearing", "appearance", "checklist"],
    reviewedAt: "2026-05-21",
  },
  "new-attorney-foundations": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 30,
    synonyms: ["onboarding", "first year", "new lawyer"],
    reviewedAt: "2026-05-21",
  },
  "client-centered-communication-path": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["client interview path", "intake path", "communication path"],
    reviewedAt: "2026-05-21",
  },
  "courtroom-readiness": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["court readiness", "hearing path", "courtroom path"],
    reviewedAt: "2026-05-21",
  },
};

export function getSearchMetadata(item: LearningItem): SearchMetadata {
  return searchMetadataById[item.id] ?? defaultSearchMetadata;
}
