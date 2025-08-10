// ESLint flat config
// - JS: @eslint/js recommended
// - TS: typescript-eslint recommended (non type-checked) to ensure TS syntax parses correctly
// - Prettier: warn on formatting differences, but disabled for config files
// Tip: Use `npm run lint` locally and `npm run lint:ci` in CI.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  // Ignore build artifacts and generated types
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "**/*.d.ts",
      ".eslintrc.cjs",
    ],
  },

  // JavaScript rules
  js.configs.recommended,

  // TypeScript rules (ensures TS parser is used for .ts/.tsx and TS syntax parses)
  ...tseslint.configs.recommended,

  // Global rules/plugins
  {
    plugins: { prettier },
    rules: {
      // Surface formatting as warnings during development
      "prettier/prettier": "warn",
      "no-console": "off",
    },
  },

  // Disable Prettier for common config files (noise reduction in CI)
  {
    files: [
      "**/*.config.{js,cjs,mjs,ts}",
      "**/*.config.*",
      "vite.config.js",
      "eslint.config.mjs",
    ],
    rules: {
      "prettier/prettier": "off",
    },
  },
];
