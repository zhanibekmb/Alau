import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Better Auth endpoints: /api/auth/sign-up/email, /api/auth/sign-in/email, /api/auth/sign-out, ...
// The handler is built per request so a build without .env never touches the database.

export async function GET(request: Request) {
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request) {
  return toNextJsHandler(getAuth()).POST(request);
}
