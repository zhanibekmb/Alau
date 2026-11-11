import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema> & { $client: Pool };

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  }
}

/**
 * Connections per server process. Vercel runs many copies of the app at once, and a free cloud
 * database allows few connections, so there each copy keeps a small pool (behind the database's
 * own pooler, see .env.example). A single local server can use more.
 */
const POOL_MAX = process.env.VERCEL ? 3 : 10;

/** A database on its own connection pool. Tests use this with DATABASE_URL_TEST. */
export function createDb(url: string): Database {
  return drizzle(new Pool({ connectionString: url, max: POOL_MAX, idleTimeoutMillis: 10_000 }), { schema });
}

// One pool per server process. Next.js dev reloads modules on every edit, so the pool
// lives on globalThis; otherwise each reload would open new connections.
const globalForDb = globalThis as unknown as { alauDb?: Database };

/** The app database. Created on first use, so pages without a database never need one. */
export function getDb(): Database {
  if (!globalForDb.alauDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new MissingDatabaseUrlError();
    globalForDb.alauDb = createDb(url);
  }
  return globalForDb.alauDb;
}
