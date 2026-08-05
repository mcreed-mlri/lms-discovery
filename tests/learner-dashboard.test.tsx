// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { emptyLearnerDashboardMock, learnerDashboardMock } from "@/mocks/dashboard";

/**
 * The three states a learner actually notices — loading, failed, and "no courses
 * yet" — had no coverage, even though dashboardService has had `simulateError`
 * and `empty` options for exactly this since it was written. Nothing wired them
 * to anything, so the error panel was unreachable in practice and untested.
 *
 * The service is mocked rather than driven through its options because the
 * component calls getLearnerDashboard() with no arguments; mocking is the only
 * seam from outside.
 */

const getLearnerDashboard = vi.fn();

vi.mock("@/lib/services/dashboardService", () => ({
  dashboardService: {
    getLearnerDashboard: (...args: unknown[]) => getLearnerDashboard(...args),
  },
}));

// Imported after vi.mock so the component picks up the mocked module.
const { LearnerDashboardView } = await import("@/components/dashboard/LearnerDashboardView");

beforeEach(() => {
  getLearnerDashboard.mockReset();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

test("shows a loading state before the payload arrives", async () => {
  // Never resolves: pins the component in its loading branch.
  getLearnerDashboard.mockReturnValue(new Promise(() => {}));
  render(<LearnerDashboardView />);

  expect(screen.getByText(/Loading your learning/i)).toBeVisible();
});

test("renders the learner's courses once loaded", async () => {
  getLearnerDashboard.mockResolvedValue(learnerDashboardMock);
  render(<LearnerDashboardView />);

  // getAllByText, not getByText: an in-progress course legitimately appears more
  // than once — as its own card, and again inside the rating / stalled-course
  // prompts that reference it by name.
  await waitFor(() => {
    expect(screen.getAllByText("Housing Law Fundamentals")[0]).toBeVisible();
  });
  expect(screen.queryByText(/Loading your learning/i)).not.toBeInTheDocument();
});

test("announces a failure and offers a retry", async () => {
  getLearnerDashboard.mockRejectedValue(new Error("Dashboard unavailable. Try again in a moment."));
  render(<LearnerDashboardView />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/Could not load your dashboard/i);
  // The message from the rejection is surfaced, not swallowed.
  expect(alert).toHaveTextContent(/Dashboard unavailable/i);
  expect(screen.getByRole("button", { name: /Try again/i })).toBeVisible();
});

test("Try again refetches in place instead of reloading the document", async () => {
  const user = userEvent.setup();
  getLearnerDashboard.mockRejectedValueOnce(new Error("Temporary glitch."));
  render(<LearnerDashboardView />);

  await screen.findByRole("alert");
  expect(getLearnerDashboard).toHaveBeenCalledTimes(1);

  // Second attempt succeeds.
  getLearnerDashboard.mockResolvedValue(learnerDashboardMock);
  await user.click(screen.getByRole("button", { name: /Try again/i }));

  await waitFor(() => {
    expect(screen.getAllByText("Housing Law Fundamentals")[0]).toBeVisible();
  });
  expect(getLearnerDashboard).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("explains what to expect when there are no enrollments yet", async () => {
  getLearnerDashboard.mockResolvedValue(emptyLearnerDashboardMock);
  render(<LearnerDashboardView />);

  await waitFor(() => {
    expect(screen.getByText(/No courses yet/i)).toBeVisible();
  });
  // An empty state that only says "empty" leaves the user stuck; this one points
  // at Brightspace enrollment and offers a way into discovery.
  expect(screen.getByRole("link", { name: /brows|explor|discover|librar/i })).toBeVisible();
});
