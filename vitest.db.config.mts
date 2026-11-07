import { defineConfig } from "vitest/config";

// npm run test:db: tests that need PostgreSQL (DATABASE_URL_TEST in .env).
// Files run one after another because they share one database.
export default defineConfig({
  test: {
    include: ["src/**/*.db.test.ts"],
    globalSetup: ["src/db/test-global-setup.ts"],
    fileParallelism: false,
  },
});
