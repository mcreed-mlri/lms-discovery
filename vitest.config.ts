import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Replaces the hand-listed `node --test` script.
 *
 * Environment is "node" by default rather than "jsdom", deliberately: the lib
 * suites exercise node:crypto (lib/session.ts) and Web Crypto's crypto.subtle
 * (lib/session-edge.ts), and jsdom supplies its own partial `crypto` that lacks
 * subtle — running everything under jsdom would break the session tests for
 * reasons that have nothing to do with the code.
 *
 * Component tests opt in per file with a `@vitest-environment jsdom` docblock,
 * so the DOM exists exactly where it is wanted and nowhere else.
 */
export default defineConfig({
  plugins: [react()],
  // Resolves the "@/*" alias from tsconfig.json natively — Vite 8 supersedes
  // the vite-tsconfig-paths plugin for this.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: ["lib/**/*.{ts,tsx}", "components/**/*.tsx", "app/**/*.tsx"],
      /**
       * The demo-only surfaces are excluded rather than tested: the eviction
       * intake scenario and the workspace shell are demo scaffolding, not
       * shipping features, and nothing in them reaches learners yet. This is a
       * scope decision, NOT a threshold one — the ratchet below is untouched
       * (see ADR 0011). When a demo graduates, delete its exclusion and land
       * its suite in the same change, so the ratchet sees it.
       */
      exclude: [
        "**/*.d.ts",
        "mocks/**",
        "app/demo/**",
        "components/scenario/**",
        "components/workspace/**",
      ],
      /**
       * A ratchet, not a target. These sit just under the measured baseline at
       * the time coverage was introduced (35.5% statements / 30.7% branches), so
       * CI fails if coverage slides backwards while leaving room to move without
       * fighting the threshold. Raise them as suites land; never lower them to
       * make a build pass.
       */
      thresholds: {
        statements: 33,
        branches: 28,
        functions: 26,
        lines: 33,
      },
    },
  },
});
