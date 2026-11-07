import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { getAuth } from "./auth";

// Data access layer: the one place server code asks "who is reading?".
// Checks happen here, next to the data, not in proxy.ts (Next.js 16 guidance).

export type CurrentUser = { id: string; email: string; name: string };

/** The signed-in reader, or null for a guest. Cached for the length of one request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, email, name } = session.user;
  return { id, email, name };
});
