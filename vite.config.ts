import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/memorize-scripture-web-app",
  plugins: [tailwindcss()],
});
