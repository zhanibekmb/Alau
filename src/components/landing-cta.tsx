"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useAppState, useHydrated } from "@/lib/store";

/**
 * Header buttons on the landing page. A returning reader (signed in, or with reading progress
 * in this browser) goes straight back to their books; a newcomer is offered to start.
 */
export function LandingHeaderCta() {
  const { data } = authClient.useSession();
  const { progress } = useAppState();
  const hydrated = useHydrated();
  const returning = Boolean(data) || (hydrated && Object.keys(progress).length > 0);

  if (returning) {
    return (
      <Link href="/library" className="rounded-full bg-[#201f4b] px-5 py-2.5 font-bold text-white transition-transform hover:scale-[1.03]">
        Оқуды жалғастыру
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="rounded-full bg-[#201f4b] px-5 py-2.5 font-bold text-white transition-transform hover:scale-[1.03] max-sm:hidden">
        Кіру
      </Link>
      <Link href="/library" className="rounded-full bg-white px-5 py-2.5 font-bold text-[#201f4b] shadow-md transition-transform hover:scale-[1.03]">
        Тегін бастау
      </Link>
    </div>
  );
}
