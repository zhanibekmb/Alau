import { configDefaults, defineConfig } from "vitest/config";

// npm test: no database needed. Database tests (*.db.test.ts) run with npm run test:db.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: [...configDefaults.exclude, "src/**/*.db.test.ts"],
  },
});
