import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist", "node_modules", ".vite"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^_" }],
    },
  },
];
