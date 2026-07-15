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
  "professional-foundations": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 24,
    synonyms: ["ethics", "professional responsibility", "mission"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "client-centered-practice": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 20,
    synonyms: ["intake", "client interview", "counseling"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "first-steps-in-court": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 20,
    synonyms: ["hearing", "court appearance", "courtroom"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
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
  "ethics-and-confidentiality": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["privilege", "conflicts", "professional conduct"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "legal-aid-environment": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["mission", "organization", "legal services"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "case-notes-and-compliance": {
    audience: ["New attorneys", "Program staff"],
    status: "Core",
    synonyms: ["time records", "documentation", "grant reporting"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "first-client-interview": {
    audience: ["New attorneys", "All staff"],
    status: "Updated",
    editorialBoost: 14,
    synonyms: ["intake", "client intake", "fact gathering"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "trauma-informed-communication": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 12,
    synonyms: ["trauma informed", "sensitive facts", "client communication"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "safety-screening": {
    audience: ["New attorneys", "All staff"],
    status: "New",
    editorialBoost: 10,
    synonyms: ["dv", "domestic violence", "crisis", "safety risk"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "courtroom-roles-etiquette": {
    audience: ["New attorneys"],
    status: "Core",
    synonyms: ["courtroom procedure", "clerks", "bench"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
    },
  },
  "preparing-client-for-court": {
    audience: ["New attorneys", "All staff"],
    status: "Core",
    synonyms: ["hearing preparation", "client preparation", "court appearance"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
    },
  },
  "first-appearance-checklist": {
    audience: ["New attorneys"],
    status: "Updated",
    editorialBoost: 14,
    synonyms: ["first hearing", "appearance", "checklist"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
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
  "upl-boundaries-advocates": {
    audience: ["All staff"],
    status: "Recommended",
    editorialBoost: 22,
    synonyms: ["upl", "unauthorized practice", "advocate boundaries", "supervision"],
    reviewedAt: "2026-06-03",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "upl-scenarios": {
    audience: ["All staff"],
    status: "Recommended",
    editorialBoost: 16,
    synonyms: ["upl", "scenarios", "advocate boundaries", "when to escalate"],
    reviewedAt: "2026-06-03",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "when-to-escalate-attorney": {
    audience: ["All staff"],
    status: "Core",
    synonyms: ["upl", "escalate", "attorney review", "supervision"],
    reviewedAt: "2026-06-03",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "new-attorney-foundations": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 30,
    synonyms: ["onboarding", "first year", "new lawyer"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
    },
  },
  "client-centered-communication-path": {
    audience: ["New attorneys", "All staff"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["client interview path", "intake path", "communication path"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
    },
  },
  "advocate-upl-onboarding": {
    audience: ["All staff"],
    status: "Recommended",
    editorialBoost: 6,
    synonyms: ["advocate onboarding", "upl", "boundaries", "client support"],
    reviewedAt: "2026-06-03",
    access: {
      allowedUserTypes: ["attorney", "non_lawyer_advocate", "paralegal", "admin"],
      requiresUplAck: true,
    },
  },
  "courtroom-readiness": {
    audience: ["New attorneys"],
    status: "Recommended",
    editorialBoost: 18,
    synonyms: ["court readiness", "hearing path", "courtroom path"],
    reviewedAt: "2026-05-21",
    access: {
      allowedUserTypes: ["attorney", "admin"],
      attorneyOnly: true,
    },
  },
};

export function getSearchMetadata(item: LearningItem): SearchMetadata {
  return searchMetadataById[item.id] ?? defaultSearchMetadata;
}
