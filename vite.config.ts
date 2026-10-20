import { defineConfig } from "vite";
import packageJSON from "./package.json" with { type: "json" };

/* eslint-disable unicorn/no-top-level-side-effects */
export default defineConfig({
  base: "/memorize-bible-verses",
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJSON.version),
  },
});
