import assert from "node:assert/strict";
import { test } from "vitest";

import { resolveAuthFlags, isLoginPathname } from "@/lib/auth";

test("demo mode allows local persona sign-in", () => {
  const flags = resolveAuthFlags({
    NEXT_PUBLIC_DEMO_MODE: "true",
  });

  assert.equal(flags.isDemoMode, true);
  assert.equal(flags.showDemoUsers, true);
  assert.equal(flags.canUseDemoLogin, true);
});

test("showing demo users without demo mode does not allow local persona sign-in", () => {
  const flags = resolveAuthFlags({
    NEXT_PUBLIC_DEMO_MODE: "false",
    NEXT_PUBLIC_SHOW_DEMO_USERS: "true",
  });

  assert.equal(flags.isDemoMode, false);
  assert.equal(flags.showDemoUsers, true);
  assert.equal(flags.canUseDemoLogin, false);
});

test("production defaults use Brightspace-backed auth", () => {
  const flags = resolveAuthFlags({});

  assert.equal(flags.isDemoMode, false);
  assert.equal(flags.showDemoUsers, false);
  assert.equal(flags.canUseDemoLogin, false);
});

test("omitted env reads the inlinable process.env members", () => {
  const previousDemo = process.env.NEXT_PUBLIC_DEMO_MODE;
  const previousShow = process.env.NEXT_PUBLIC_SHOW_DEMO_USERS;
  process.env.NEXT_PUBLIC_DEMO_MODE = "true";
  process.env.NEXT_PUBLIC_SHOW_DEMO_USERS = "false";

  try {
    const flags = resolveAuthFlags();
    assert.equal(flags.isDemoMode, true);
    assert.equal(flags.showDemoUsers, true);
    assert.equal(flags.canUseDemoLogin, true);
  } finally {
    process.env.NEXT_PUBLIC_DEMO_MODE = previousDemo;
    process.env.NEXT_PUBLIC_SHOW_DEMO_USERS = previousShow;
  }
});

test("login path detection ignores a trailing slash", () => {
  assert.equal(isLoginPathname("/login"), true);
  assert.equal(isLoginPathname("/login/"), true);
  assert.equal(isLoginPathname("/"), false);
  assert.equal(isLoginPathname("/browse/"), false);
});
