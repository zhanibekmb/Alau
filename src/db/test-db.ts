import { existsSync } from "node:fs";
import { sql } from "drizzle-orm";
import { createDb, type Database } from "./index";

// Helpers for *.db.test.ts files (npm run test:db). Never imported by the app.

/** The test database URL. Refuses anything that is not clearly a test database. */
export function testDatabaseUrl(): string {
  if (existsSync(".env")) process.loadEnvFile(".env");
  const url = process.env.DATABASE_URL_TEST;
  if (!url) throw new Error("DATABASE_URL_TEST is not set. See .env.example.");
  const name = new URL(url).pathname.slice(1);
  if (!name.endsWith("_test")) {
    throw new Error(`DATABASE_URL_TEST points at "${name}". Test databases must end in "_test", because tests wipe them.`);
  }
  return url;
}

export const createTestDb = (): Database => createDb(testDatabaseUrl());

/** Empties every table. Deleting from "user" cascades to the reader tables. */
export async function resetDb(db: Database): Promise<void> {
  await db.execute(
    sql`TRUNCATE TABLE "user", "session", "account", "verification", "entitlements", "paywall_events", "reading_progress", "saved_words" CASCADE`,
  );
}
