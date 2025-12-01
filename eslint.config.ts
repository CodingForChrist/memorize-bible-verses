import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  globalIgnores(["dist/*"]),
  {
    rules: {
      "unicorn/template-indent": [
        "warn",
        {
          indent: 2,
        },
      ],
      "unicorn/prevent-abbreviations": [
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
