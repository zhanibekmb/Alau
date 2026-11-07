import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createTestDb } from "./test-db";

/** Runs once before npm run test:db: brings alau_test up to the latest migration. */
export default async function setup() {
  const db = createTestDb();
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } finally {
    await db.$client.end();
  }
}
