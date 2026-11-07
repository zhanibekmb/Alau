import { createAuthClient } from "better-auth/react";

/** Browser side of Better Auth. Talks to /api/auth on the same site. */
export const authClient = createAuthClient();
