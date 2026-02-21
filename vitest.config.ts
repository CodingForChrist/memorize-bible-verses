/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    clearMocks: true,
    environment: "happy-dom",
    sequence: {
      shuffle: true,
    },
    silent: "passed-only",
    exclude: ["**/node_modules/**", "**/playwright-tests/**"],
  },
});
