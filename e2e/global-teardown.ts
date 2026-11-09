import { existsSync } from "node:fs";
import { Pool } from "pg";

/** Removes everything the E2E tests created in the app database. */
export default async function globalTeardown() {
  if (existsSync(".env")) process.loadEnvFile(".env");
  const url = process.env.DATABASE_URL;
  if (!url) return;
  const pool = new Pool({ connectionString: url });
  try {
    // Deleting the reader removes their sessions and purchases (ON DELETE CASCADE).
    await pool.query(`DELETE FROM "user" WHERE email LIKE 'e2e+%@example.kz'`);
    await pool.query(`DELETE FROM paywall_events WHERE anon_id LIKE 'e2e-anon-%'`);
  } finally {
    await pool.end();
  }
}
