import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export const domConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [new URL("./dom-setup.ts", import.meta.url).pathname],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.*",
        "**/*.d.ts",
        "**/*.stories.{ts,tsx}",
      ],
    },
  },
});
