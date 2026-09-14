// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_DEMO_MODE = "true";
  process.env.NEXT_PUBLIC_SHOW_DEMO_USERS = "true";
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const { AuthProvider } = await import("@/lib/auth");
const { default: LoginPage } = await import("@/app/login/page");

beforeEach(() => {
  localStorage.clear();
});

test("demo persona cards are buttons that persist the chosen user", async () => {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  );

  await user.click(screen.getByRole("button", { name: /Sarah Chen/i }));

  expect(JSON.parse(localStorage.getItem("mlri-demo-user") ?? "{}")).toMatchObject({
    id: "sarah-chen",
    name: "Sarah Chen",
  });
});
