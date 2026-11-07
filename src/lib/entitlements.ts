import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { entitlements } from "../db/schema";
import type { Entitlement } from "./access";

/** Everything one reader may read. Uses the entitlements_user_idx index. */
export async function loadEntitlements(db: Database, userId: string): Promise<Entitlement[]> {
  return db
    .select({ kind: entitlements.kind, work: entitlements.work, expiresAt: entitlements.expiresAt })
    .from(entitlements)
    .where(eq(entitlements.userId, userId));
}
