// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_DEMO_MODE = "true";
  process.env.NEXT_PUBLIC_SHOW_DEMO_USERS = "true";
});

const { AuthProvider, useAuth, demoUser } = await import("@/lib/auth");

function Probe() {
  const { user, ready } = useAuth();
  if (!ready) return <p>loading</p>;
  return <p>{user ? user.name : "signed-out"}</p>;
}

beforeEach(() => {
  localStorage.clear();
});

test("demo mode opens the hub as Sarah Chen without a stored persona", async () => {
  window.history.replaceState({}, "", "/");
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );

  expect(await screen.findByText("Sarah Chen")).toBeVisible();
  expect(JSON.parse(localStorage.getItem("mlri-demo-user") ?? "{}")).toMatchObject({
    id: "sarah-chen",
  });
});

test("demo mode does not auto-sign-in on the login page", async () => {
  window.history.replaceState({}, "", "/login/");
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );

  expect(await screen.findByText("signed-out")).toBeVisible();
  expect(localStorage.getItem("mlri-demo-user")).toBeNull();
});

test("a stored Sarah persona picks up the current staff-preview profile", async () => {
  window.history.replaceState({}, "", "/");
  localStorage.setItem(
    "mlri-demo-user",
    JSON.stringify({ ...demoUser, title: "Staff Attorney", unit: "Housing Unit" }),
  );

  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );

  expect(await screen.findByText("Sarah Chen")).toBeVisible();
  expect(JSON.parse(localStorage.getItem("mlri-demo-user") ?? "{}")).toMatchObject({
    title: "MLRI Staff Attorney",
    unit: "",
  });
});
