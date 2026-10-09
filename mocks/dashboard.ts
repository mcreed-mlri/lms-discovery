import type { DashboardUser, LearnerDashboardPayload } from "@/types/dashboard";

const WELCOME_COURSE_URL =
  "https://mlri.brightspace.com/content/enforced/6706-demo.onboarding_mc/Home.html?ou=6706&d2l_body_type=3";
const HOUSING_COURSE_URL =
  "https://mlri.brightspace.com/content/enforced/6703-course.outline/Home.html?ou=6703&d2l_body_type=3";

const baseUser: DashboardUser = {
  id: "user-sarah-chen",
  displayName: "Sarah Chen",
  email: "sarah.chen@mlri-demo.org",
  laceRole: "learner",
};

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

// Sample payload. Every course here is a real catalog item (lib/data.ts) and
// the progress matches the home resume card, so the demo never shows a course
// or certificate that does not exist. The numbers themselves are invented and
// the page says so.
export const learnerDashboardMock: LearnerDashboardPayload = {
  user: baseUser,
  summary: {
    enrolledCount: 3,
    inProgressCount: 2,
    completedCount: 1,
    hoursEarned: 8.5,
    hoursRequired: 12,
    hoursDueLabel: "Due Jun 30",
  },
  courses: [
    {
      offeringId: "7102",
      title: "Legal Skills: Hearsay",
      trainingArea: "Legal skills",
      completionPct: 20,
      status: "in_progress",
      lastAccessedAt: daysAgo(1),
      resumeUrl: "/legal-skills-hearsay/Home.html",
    },
    {
      offeringId: "6703",
      title: "Eviction Defense: The First 48 Hours",
      trainingArea: "Housing",
      completionPct: 40,
      status: "in_progress",
      // Idle past STALLED_AFTER_DAYS so the stalled-course nudge is demoable.
      lastAccessedAt: daysAgo(21),
      resumeUrl: HOUSING_COURSE_URL,
      dueDate: daysAhead(14),
    },
    {
      offeringId: "6706",
      title: "Welcome to the Learning Hub",
      trainingArea: "Orientation",
      completionPct: 100,
      status: "completed",
      lastAccessedAt: daysAgo(5),
      resumeUrl: WELCOME_COURSE_URL,
    },
  ],
  recentActivity: [
    { label: "Opened Legal Skills: Hearsay, lesson 1", at: daysAgo(1) },
    { label: "Completed Welcome to the Learning Hub", at: daysAgo(5) },
    { label: "Earned 0.5 training hrs: Welcome to the Learning Hub", at: daysAgo(5) },
    { label: "Completed module: When the Clock Starts", at: daysAgo(21) },
  ],
  notices: [
    {
      id: "notice-hearsay-2026",
      title: "Hearsay course available",
      body: "Legal Skills: Hearsay covers responding to hearsay objections in written advocacy.",
      severity: "info",
    },
  ],
  certificates: [
    {
      id: "cert-welcome",
      title: "Welcome to the Learning Hub",
      earnedOn: new Date(daysAgo(5)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      credits: "0.5 hrs",
    },
  ],
};

export const emptyLearnerDashboardMock: LearnerDashboardPayload = {
  user: baseUser,
  summary: { enrolledCount: 0, inProgressCount: 0, completedCount: 0 },
  courses: [],
  notices: [],
};
