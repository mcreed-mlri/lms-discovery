export type LaceRole = "learner" | "manager" | "program" | "super_admin";

export interface DashboardUser {
  id: string;
  displayName: string;
  email: string;
  laceRole: LaceRole;
}

export interface LearnerCourse {
  offeringId: string;
  title: string;
  trainingArea?: string;
  completionPct: number;
  status: "not_started" | "in_progress" | "completed";
  lastAccessedAt: string;
  resumeUrl: string;
  dueDate?: string;
}

export interface LearnerCertificate {
  id: string;
  title: string;
  earnedOn: string;
  credits: string;
}

export interface LearnerDashboardPayload {
  user: DashboardUser;
  summary: {
    enrolledCount: number;
    inProgressCount: number;
    completedCount: number;
    /** Training-hour requirement, shown to the learner only. These numbers
     *  stay out of program/leadership reporting by design. Canonical metric
     *  definitions: Brightspace-Manager/docs/planning/metrics-framework.md. */
    hoursEarned?: number;
    hoursRequired?: number;
    hoursDueLabel?: string;
  };
  courses: LearnerCourse[];
  recentActivity?: { label: string; at: string }[];
  notices?: { id: string; title: string; body: string; severity: "info" | "warning" }[];
  certificates?: LearnerCertificate[];
}

export interface ManagerTeamMember {
  id: string;
  name: string;
  course: string;
  completionPct: number;
  lastActiveAt: string;
  hasGap: boolean;
}

export interface ManagerDashboardPayload {
  user: DashboardUser;
  summary: {
    teamSize: number;
    onTrackCount: number;
    gapCount: number;
  };
  members: ManagerTeamMember[];
}

export interface ProgramStat {
  id: string;
  label: string;
  value: string;
  detail?: string;
}

export interface ProgramAreaRow {
  trainingArea: string;
  enrolled: number;
  completionRate: number;
}

export interface ProgramDashboardPayload {
  user: DashboardUser;
  stats: ProgramStat[];
  byArea: ProgramAreaRow[];
}

export type ServiceHealth = "healthy" | "degraded" | "down";

export interface AdminServiceStatus {
  id: string;
  name: string;
  status: ServiceHealth;
  message: string;
}

export interface AdminDashboardPayload {
  user: DashboardUser;
  services: AdminServiceStatus[];
  lastSyncAt: string;
  note: string;
}
