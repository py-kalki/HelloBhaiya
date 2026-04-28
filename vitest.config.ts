import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
      include: ["lib/**", "actions/**"],
      exclude: ["lib/firebase/**", "**/*.test.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
})
