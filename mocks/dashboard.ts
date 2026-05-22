import type {
  AdminDashboardPayload,
  DashboardUser,
  LaceRole,
  LearnerDashboardPayload,
  ManagerDashboardPayload,
  ProgramDashboardPayload,
} from "@/types/dashboard";

const DEMO_RESUME_URL =
  "https://mlri.brightspace.com/content/enforced/6698-demo.instructor_mc/Sequencing.html?ou=6698&d2l_body_type=3&ou=6698";

const baseUser: DashboardUser = {
  id: "user-sarah-chen",
  displayName: "Sarah Chen",
  email: "sarah.chen@mlri-demo.org",
  laceRole: "learner",
};

function withRole(role: LaceRole): DashboardUser {
  return { ...baseUser, laceRole: role };
}

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const daysAhead = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const learnerDashboardMock: LearnerDashboardPayload = {
  user: baseUser,
  summary: {
    enrolledCount: 6,
    inProgressCount: 3,
    completedCount: 2,
    streakDays: 12,
    longestStreakNote: "Longest streak in the Housing area",
    cleEarned: 8.5,
    cleRequired: 12,
    cleDueLabel: "Due Jun 30",
    weeklyHoursAvg: 4.2,
  },
  courses: [
    {
      offeringId: "6698",
      title: "Housing Law Fundamentals",
      trainingArea: "Housing",
      completionPct: 62,
      status: "in_progress",
      lastAccessedAt: daysAgo(1),
      resumeUrl: DEMO_RESUME_URL,
      dueDate: daysAhead(14),
    },
    {
      offeringId: "7102",
      title: "UPL Boundaries for Advocates",
      trainingArea: "Ethics",
      completionPct: 100,
      status: "completed",
      lastAccessedAt: daysAgo(5),
      resumeUrl: "#course-7102",
    },
    {
      offeringId: "6844",
      title: "Client Intake & Screening",
      trainingArea: "Practice skills",
      completionPct: 28,
      status: "in_progress",
      lastAccessedAt: daysAgo(3),
      resumeUrl: "#course-6844",
      dueDate: daysAhead(21),
    },
    {
      offeringId: "6921",
      title: "Eviction Defense Workshop",
      trainingArea: "Housing",
      completionPct: 0,
      status: "not_started",
      lastAccessedAt: daysAgo(45),
      resumeUrl: "#course-6921",
      dueDate: daysAhead(30),
    },
    {
      offeringId: "7055",
      title: "Public Benefits Overview",
      trainingArea: "Benefits",
      completionPct: 85,
      status: "in_progress",
      lastAccessedAt: daysAgo(2),
      resumeUrl: "#course-7055",
    },
    {
      offeringId: "7188",
      title: "Domestic Violence Safety Planning",
      trainingArea: "Family law",
      completionPct: 100,
      status: "completed",
      lastAccessedAt: daysAgo(12),
      resumeUrl: "#course-7188",
    },
  ],
  recentActivity: [
    { label: "Completed module: Reasonable Accommodation Requests", at: daysAgo(1) },
    { label: "Started Self Check: UPL scenarios", at: daysAgo(4) },
    { label: "Bookmarked: Working with court interpreters", at: daysAgo(4) },
    { label: "Earned 2.0 CLE: UPL Boundaries for Advocates", at: daysAgo(5) },
  ],
  notices: [
    {
      id: "notice-upl-2026",
      title: "Annual ethics refresh available",
      body: "All advocates must complete UPL Boundaries recertification by June 30. Your prior completion counts toward partial credit.",
      severity: "info",
    },
  ],
  // 84 cells = 12 weeks x 7 days, intensity 0-4. Demo data; production reads
  // this from Brightspace engagement snapshots.
  activityHeatmap: [
    0, 2, 1, 0, 3, 1, 2, 0, 1, 2, 3, 0, 1, 4, 2, 3, 1, 0, 2, 3, 1, 2, 0, 3, 1, 2, 3, 1,
    4, 2, 1, 2, 3, 1, 2, 0, 1, 3, 2, 1, 2, 3, 4, 2, 3, 1, 0, 2, 1, 3, 2, 4, 1, 2, 3, 2,
    1, 3, 2, 4, 1, 2, 3, 4, 2, 3, 2, 1, 2, 3, 2, 4, 1, 3, 2, 4, 3, 2, 1, 3, 2, 3, 4, 2,
  ],
  weeklySparkline: [2, 4, 3, 6, 4, 7, 5, 8],
  certificates: [
    { id: "cert-upl", title: "UPL Boundaries for Advocates", earnedOn: "May 20, 2026", credits: "2.0 CLE" },
    { id: "cert-dv", title: "Domestic Violence Safety Planning", earnedOn: "May 9, 2026", credits: "3.0 CLE" },
  ],
};

export const managerDashboardMock: ManagerDashboardPayload = {
  user: withRole("manager"),
  summary: { teamSize: 7, onTrackCount: 4, gapCount: 3 },
  members: [
    { id: "m1", name: "Jordan Ellis", course: "Housing Law Fundamentals", completionPct: 62, lastActiveAt: daysAgo(1), hasGap: false },
    { id: "m2", name: "Alex Rivera", course: "UPL Boundaries for Advocates", completionPct: 100, lastActiveAt: daysAgo(6), hasGap: false },
    { id: "m3", name: "Morgan Lee", course: "Client Intake & Screening", completionPct: 12, lastActiveAt: daysAgo(18), hasGap: true },
    { id: "m4", name: "Taylor Brooks", course: "Eviction Defense Workshop", completionPct: 0, lastActiveAt: daysAgo(40), hasGap: true },
    { id: "m5", name: "Casey Nguyen", course: "Public Benefits Overview", completionPct: 45, lastActiveAt: daysAgo(4), hasGap: false },
    { id: "m6", name: "Riley Patel", course: "Housing Law Fundamentals", completionPct: 8, lastActiveAt: daysAgo(22), hasGap: true },
    { id: "m7", name: "Jamie Ortiz", course: "Domestic Violence Safety Planning", completionPct: 78, lastActiveAt: daysAgo(2), hasGap: false },
  ],
};

export const programDashboardMock: ProgramDashboardPayload = {
  user: withRole("program"),
  stats: [
    { id: "completion", label: "Org completion rate", value: "68%", detail: "Across all required trainings" },
    { id: "below-50", label: "Courses below 50%", value: "4", detail: "Need program follow-up" },
    { id: "no-results", label: "Searches with no results", value: "127", detail: "Last 30 days — content gaps" },
  ],
  byArea: [
    { trainingArea: "Housing", enrolled: 84, completionRate: 71 },
    { trainingArea: "Ethics", enrolled: 112, completionRate: 89 },
    { trainingArea: "Benefits", enrolled: 56, completionRate: 54 },
    { trainingArea: "Family law", enrolled: 38, completionRate: 62 },
  ],
};

export const adminDashboardMock: AdminDashboardPayload = {
  user: withRole("super_admin"),
  services: [
    { id: "bs-api", name: "Brightspace API", status: "healthy", message: "OAuth token valid · enrollments syncing" },
    { id: "supabase", name: "Supabase sync", status: "degraded", message: "Engagement snapshots 12m behind schedule" },
    { id: "search-index", name: "Search index", status: "healthy", message: "Last rebuild 2h ago · 1,842 items" },
  ],
  lastSyncAt: daysAgo(0),
  note: "Server-side API only in production",
};

export const emptyLearnerDashboardMock: LearnerDashboardPayload = {
  user: baseUser,
  summary: { enrolledCount: 0, inProgressCount: 0, completedCount: 0 },
  courses: [],
  notices: [],
};
