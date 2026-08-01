import type { LearningItem } from "@/lib/data";

export type SearchAudience = "New attorneys" | "All staff" | "Supervisors" | "Program staff";
export type ContentLifecycleStatus = "Recommended" | "New" | "Updated" | "Core";
export type AccessUserType = "attorney" | "non_lawyer_advocate" | "paralegal" | "admin" | "faculty";

export type AccessMetadata = {
  allowedUserTypes: AccessUserType[];
  attorneyOnly?: boolean;
  requiresUplAck?: boolean;
  jurisdictions?: string[];
};

export type SearchMetadata = {
  audience: SearchAudience[];
  status: ContentLifecycleStatus;
  editorialBoost?: number;
  synonyms?: string[];
  reviewedAt: string;
  access: AccessMetadata;
};

export const defaultSearchMetadata: SearchMetadata = {
  audience: ["All staff"],
  status: "Core",
  reviewedAt: "2026-05-21",
  access: {
    allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
  },
};

export const searchMetadataById: Record<string, SearchMetadata> = {
  "welcome-to-lace": {
    audience: ["All staff"],
    status: "New",
    editorialBoost: 10,
    synonyms: ["onboarding", "welcome", "getting started", "lace"],
    reviewedAt: "2026-06-03",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "curriculum-map": {
    audience: ["Program staff"],
    status: "New",
    editorialBoost: 14,
    synonyms: ["curriculum", "roadmap", "pathway", "map", "competencies", "topics"],
    reviewedAt: "2026-07-01",
    access: {
      allowedUserTypes: ["faculty", "admin"],
    },
  },
  "faculty-starter": {
    audience: ["Program staff"],
    status: "New",
    editorialBoost: 14,
    synonyms: ["faculty", "content creator", "author", "getting started", "orientation"],
    reviewedAt: "2026-07-01",
    access: {
      allowedUserTypes: ["faculty", "admin"],
    },
  },
  "brightspace-wrapper-demo": {
    audience: ["Program staff"],
    status: "Updated",
    editorialBoost: 12,
    synonyms: ["interactive elements", "wrappers", "d2l demo"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["admin"],
    },
  },
  "eviction-defense-48h": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 16,
    synonyms: ["housing court", "eviction", "notice to quit", "summary process"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
  "wrapper-static-layouts": {
    audience: ["Program staff"],
    status: "Core",
    synonyms: ["accordions", "tabs", "callouts"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["admin"],
    },
  },
  "wrapper-self-checks": {
    audience: ["Program staff"],
    status: "Updated",
    editorialBoost: 8,
    synonyms: ["knowledge checks", "practice checks", "sequencing"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["admin"],
    },
  },
  "wrapper-insert-media": {
    audience: ["Program staff"],
    status: "New",
    synonyms: ["video", "image hotspots", "media"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["admin"],
    },
  },
  "clock-starts": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["notice to quit", "deadline", "housing"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
  "notice-types": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["notice to quit", "housing", "eviction"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
  "service-of-process": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["service", "housing", "eviction"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
  "drafting-answer": {
    audience: ["New attorneys"],
    status: "New",
    synonyms: ["answer", "motions", "housing"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
  "walking-into-housing-court": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["housing court", "client goals", "hearing"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
      jurisdictions: ["MA"],
    },
  },
};

export function getSearchMetadata(item: LearningItem): SearchMetadata {
  return searchMetadataById[item.id] ?? defaultSearchMetadata;
}
