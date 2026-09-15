/**
 * User shape and the demo personas, kept free of the "use client" boundary.
 *
 * These live here rather than in lib/auth.tsx because server code needs to read
 * them as data. A route handler compiles in the RSC/server layer, where every
 * export of a "use client" module is replaced by a client-reference stub — so
 * `import { demoUser } from "@/lib/auth"` inside app/api/me/route.ts silently
 * yielded `undefined`, and the Google-gated demo login bounced straight back to
 * /login with no error anywhere. Same boundary problem, and the same remedy, as
 * lib/session-constants.ts in ADR 0003.
 *
 * lib/auth.tsx re-exports everything below, so client call sites are unchanged.
 * tests/server-client-boundary.test.ts keeps server entry points off the client
 * module.
 */

export type User = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  title: string;
  organization: string;
  unit: string;
  initials: string;
  userType: "attorney" | "non_lawyer_advocate" | "paralegal" | "admin" | "faculty";
  accessStatus: "approved" | "pending" | "suspended" | "inactive";
  jurisdiction: string[];
  practiceArea: string[];
  uplAcknowledgedDate?: string;
  barNumber?: string;
  barJurisdiction?: string[];
};

export const demoUser: User = {
  id: "sarah-chen",
  name: "Sarah Chen",
  firstName: "Sarah",
  email: "s.chen@mlri.org",
  title: "Staff Attorney",
  organization: "MLRI",
  unit: "Housing Unit",
  initials: "SC",
  userType: "attorney",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["housing", "client-services", "ethics"],
  barNumber: "BBO-123456",
  barJurisdiction: ["MA"],
};

export const kevinSmithUser: User = {
  id: "kevin-smith",
  name: "Kevin Smith",
  firstName: "Kevin",
  email: "k.smith@partnerlegalaid.example",
  title: "Non-Practicing Advocate",
  organization: "Demo Legal Aid Partner",
  unit: "Client Services",
  initials: "KS",
  userType: "non_lawyer_advocate",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["client-services", "ethics", "practice-skills"],
  uplAcknowledgedDate: "2026-06-01",
};

export const mlriAdminUser: User = {
  id: "mlri-admin",
  name: "MLRI Admin",
  firstName: "MLRI",
  email: "admin@mlri.example",
  title: "Platform Administrator",
  organization: "MLRI",
  unit: "Learning Platform",
  initials: "MA",
  userType: "admin",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["all"],
};

export const facultyUser: User = {
  id: "faculty-demo",
  name: "Faculty",
  firstName: "Faculty",
  email: "faculty@mlri.example",
  title: "Content Creator",
  organization: "MLRI",
  unit: "Curriculum & Content",
  initials: "F",
  userType: "faculty",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  practiceArea: ["all"],
};

export const demoUsers = [demoUser, kevinSmithUser, mlriAdminUser, facultyUser];
