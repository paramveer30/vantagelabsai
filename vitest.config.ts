import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Each .claude worktree carries its own copy of the suite; only run this one.
    exclude: ["**/node_modules/**", "**/.claude/**"],
    // Reset env/global stubs between tests so a per-test NODE_ENV override
    // can't leak into the next one.
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
