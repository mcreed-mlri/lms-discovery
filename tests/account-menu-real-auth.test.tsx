// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";

/**
 * The account menu with real login, i.e. the Google demo deployment.
 *
 * Deliberately a separate file from tests/account-menu.test.tsx: `showDemoUsers`
 * in lib/auth is a module-level const read from NEXT_PUBLIC_* at import time, so
 * the two branches cannot be exercised in one module registry. This file sets no
 * demo flags, which is the configuration staff actually sign in under.
 */
vi.hoisted(() => {
  delete process.env.NEXT_PUBLIC_DEMO_MODE;
  delete process.env.NEXT_PUBLIC_SHOW_DEMO_USERS;
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const { AuthProvider } = await import("@/lib/auth");
const { AccountMenu } = await import("@/components/account-menu");
const { demoUser } = await import("@/lib/auth-constants");

/** What /api/me returns for a Google session: persona access, real name. */
const signedInUser = { ...demoUser, name: "Kate O'Brien", firstName: "Kate", initials: "KO" };

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => ({ ok: true, user: signedInUser }) })),
  );
});

test("offers plain 'Log out' when there is no persona to switch to", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <AccountMenu />
    </AuthProvider>,
  );

  await user.click(await screen.findByRole("button", { name: /Account menu for Kate O'Brien/i }));

  // "switch user" is persona-picker copy. On a real-auth deployment there is no
  // other user to switch to, so offering it describes something that cannot happen.
  expect(screen.getByRole("button", { name: /^Log out$/i })).toBeVisible();
  expect(screen.queryByText(/switch user/i)).not.toBeInTheDocument();
});
