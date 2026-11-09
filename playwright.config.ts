import { defineConfig, devices } from "@playwright/test";

// npm run test:e2e: the paywall path in a real browser (docs/paywall-plan.md, T6b).
// Needs PostgreSQL, the .env from .env.example and PAYMENTS_MODE=demo, because the tests buy a book.
// Reuses a dev server already running on port 3000, otherwise starts one.
// Test readers are e2e+…@example.kz; e2e/global-teardown.ts deletes them and their events.

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone-360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 780 } } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
