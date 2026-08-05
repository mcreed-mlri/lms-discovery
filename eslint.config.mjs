import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // This app hydrates client state from localStorage after mount (auth,
      // saved learning, sidebar collapse). That pattern is SSR-safe and the
      // rule's suggested alternative (useSyncExternalStore) is a bigger
      // refactor than it is worth today. Revisit if adopting React Compiler.
      "react-hooks/set-state-in-effect": "off",

      // Off because both call sites in lib/auth.tsx genuinely need a full
      // document navigation, and the rule cannot tell the difference:
      //
      //   · login() navigates to /api/auth/brightspace/start, an API route that
      //     302s to auth.brightspace.com. Client-side routing cannot follow a
      //     redirect off-origin, so router.push() would break OAuth.
      //   · logout() navigates to /login *in order to* discard client state.
      //     A soft push keeps the SPA alive with a stale user in memory, which
      //     is the exact thing logging out is supposed to prevent.
      //
      // Rewriting these to window.location.href would silence the rule without
      // changing behaviour — suppression by obfuscation. An honest entry here is
      // better. Added when eslint-config-next 16.3.0 introduced the rule.
      "@next/next/no-location-assign-relative-destination": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "tools/**",
    "archive/**",
    "design_handoff_studio_rail/**",
    // Static assets served verbatim, not application source. public/tools-handbook
    // is generated output; linting it produced the only warnings in the repo and
    // hid real ones in the noise.
    "public/**",
    // Generated test output — Vitest coverage reports and Playwright artifacts.
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
  ]),
]);
