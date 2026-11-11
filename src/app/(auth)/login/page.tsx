import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { safeNextPath } from "@/lib/auth-messages";
import { googleCredentials } from "@/lib/auth";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Кіру · Alau" };

type SearchParams = Promise<{ next?: string; mode?: string; error?: string }>;

async function LoginView({ searchParams }: { searchParams: SearchParams }) {
  const { next, mode, error } = await searchParams;
  const target = safeNextPath(next);
  if (await getCurrentUser()) redirect(target);
  return (
    <LoginForm
      next={target}
      initialMode={mode === "sign-up" ? "sign-up" : "sign-in"}
      googleEnabled={googleCredentials() !== null}
      initialError={error ? "Google арқылы кіру сәтсіз аяқталды. Қайталап көріңіз." : null}
    />
  );
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <LoginView searchParams={searchParams} />
    </Suspense>
  );
}
