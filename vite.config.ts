import { defineConfig } from "vite";
import packageJSON from "./package.json";

export default defineConfig({
  base: "/memorize-bible-verses",
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJSON.version),
  },
});
