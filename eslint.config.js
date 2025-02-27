import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // Global configuration
  {
    ignores: ["dist/**", "node_modules/**", "**/*.astro", "**/*.d.ts"],
  },

  // Base JS configuration
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.ts", "**/*.tsx"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
    },
  },
];
