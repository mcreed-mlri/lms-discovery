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
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "tools/**",
    "archive/**",
    "design_handoff_studio_rail/**",
  ]),
]);
