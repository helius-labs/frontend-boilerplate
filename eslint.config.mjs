import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // Global rule overrides
    rules: {
      // Allow setState in effects for hydration safety patterns
      "react-hooks/set-state-in-effect": "warn",
      // Allow ref updates during render for callback refs
      "react-hooks/refs": "warn",
    },
  },
  {
    // Enforce @/ imports in app folder (pages/routes)
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Use @/ path alias instead of relative imports in app folder",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".planning/**",
  ]),
]);

export default eslintConfig;
