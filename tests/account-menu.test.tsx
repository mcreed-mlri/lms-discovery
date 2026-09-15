// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_DEMO_MODE = "true";
  process.env.NEXT_PUBLIC_SHOW_DEMO_USERS = "true";
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const { AuthProvider, demoUser } = await import("@/lib/auth");
const { AccountMenu } = await import("@/components/account-menu");

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("mlri-demo-user", JSON.stringify(demoUser));
});

test("the account bubble opens a menu with identity and logout", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <AccountMenu />
    </AuthProvider>,
  );

  const trigger = await screen.findByRole("button", { name: /Account menu for Sarah Chen/i });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("dialog", { name: /Sarah Chen/i })).not.toBeInTheDocument();

  await user.click(trigger);

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const dialog = screen.getByRole("dialog", { name: /Sarah Chen/i });
  expect(dialog).toBeVisible();
  expect(screen.getByText("MLRI Staff Attorney")).toBeVisible();
  expect(screen.getByRole("button", { name: /Log out \/ switch user/i })).toBeVisible();
});

test("Escape closes the account menu", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <AccountMenu />
    </AuthProvider>,
  );

  await user.click(await screen.findByRole("button", { name: /Account menu for Sarah Chen/i }));
  expect(screen.getByRole("dialog", { name: /Sarah Chen/i })).toBeVisible();

  await user.keyboard("{Escape}");

  expect(screen.queryByRole("dialog", { name: /Sarah Chen/i })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Account menu for Sarah Chen/i })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
