/**
 * Vitest setup, applied to every suite.
 *
 * jest-dom adds DOM-aware matchers (toBeVisible, toHaveAccessibleName,
 * toBeDisabled…). Importing the /vitest entry point registers them on Vitest's
 * own `expect` rather than Jest's. Harmless in node-environment suites, which
 * simply never use them.
 *
 * Testing Library normally registers its own cleanup by finding a global
 * `afterEach`, which does not exist here because this project runs Vitest
 * without `globals: true` (explicit imports are easier to trace). Without the
 * hook below, mounted components accumulate across tests in a file and
 * `getByRole` starts failing with "multiple elements found" — so cleanup is
 * wired up by hand.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  // No-op when a suite runs in the node environment and never mounted anything.
  cleanup();
});

/**
 * jsdom does not implement ResizeObserver (it does no layout, so there is
 * nothing to observe). lib/hooks/use-scroll-edges.ts constructs one on mount,
 * which throws in every jsdom suite that renders a horizontally-scrolling
 * track — a jsdom gap, not a bug in that hook, so the fix belongs here rather
 * than in each test file.
 */
class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub;
}
