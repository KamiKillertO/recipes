import js from "@eslint/js";
import tseslint from "typescript-eslint";
import lit from "eslint-plugin-lit";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  lit.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);