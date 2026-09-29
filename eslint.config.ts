import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";

export default defineConfig([
  {
    ignores: ["dist/"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, tseslint: tseslint.plugin, unicorn },
    extends: ["js/recommended", "tseslint/recommended", "unicorn/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "unicorn/template-indent": [
        "warn",
        {
          indent: 2,
        },
      ],
      "unicorn/name-replacements": [
        "error",
        {
          replacements: {
            // allow vite-env.d.ts file name
            env: false,
          },
        },
      ],
      // toSorted() was added to ES2023
      // current target is ES2022
      "unicorn/no-array-sort": "off",
    },
  },
]);
