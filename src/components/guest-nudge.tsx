"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { guestStashText, signUpHref, streakNudgeText } from "@/lib/guest-nudge";
import { dayKey } from "@/lib/streak";
import { showToast } from "@/lib/toast";
import { useAppState, useHydrated } from "@/lib/store";
import { useEntitlements } from "@/lib/use-entitlements";
import { Mascot } from "./brand";
import { useStreak } from "./streak";

/**
 * A sign-up card for guests on the pages where their data lives (dictionary, my books, profile).
 * It names what they already have, since "you could lose 40 words" moves people more than a
 * list of features. Signed-in readers never see it.
 */
export function GuestSignUpCard({ className = "" }: { className?: string }) {
  const { signedIn, sessionPending } = useEntitlements();
  const hydrated = useHydrated();
  const { words, progress } = useAppState();
  const pathname = usePathname();
  const streak = useStreak();

  if (!hydrated || sessionPending || signedIn) return null;

  const stash = guestStashText(Object.keys(words).length, Object.keys(progress).length);
  const streakText = streakNudgeText(streak?.current ?? 0);

  return (
    <section
      aria-label="Тіркелу"
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl border border-amber-200 bg-gradient-to-br from-[#fff6e3] to-[#ffe7b8] p-4 md:p-5 ${className}`}
    >
      <Mascot pose="onboarding-login" className="size-16 shrink-0 md:size-20" />
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-bold">
          {streakText
            ? `🔥 Серияңыз ${streak!.current} күн — оны сақтаңыз`
            : stash
              ? `Сізде ${stash} бар — оларды жоғалтпаңыз`
              : "Тегін аккаунт ашыңыз"}
        </p>
        <p className="mt-0.5 text-sm text-ink/70">
          {streakText || stash
            ? "Қазір бәрі тек осы браузерде. Тіркелсеңіз, телефонда да, компьютерде де сақталады."
            : "Сөздік, прогресс және серия кез келген құрылғыда сақталады. Бір минут қана."}
        </p>
      </div>
      <Link
        href={signUpHref(pathname)}
        className="shrink-0 rounded-2xl bg-accent px-4 py-2.5 text-center max-sm:w-full font-semibold text-on-accent shadow-md shadow-accent/30"
      >
        Тіркелу
      </Link>
    </section>
  );
}

const STREAK_TOAST_KEY = "alau-streak-nudge";

/**
 * Once a day, a guest with a streak worth keeping hears that it lives only in this browser.
 * Used in the reader, where the streak grows.
 */
export function useGuestStreakNudge() {
  const { signedIn, sessionPending } = useEntitlements();
  const hydrated = useHydrated();
  const streak = useStreak();
  const pathname = usePathname();
  const days = streak?.current ?? 0;

  useEffect(() => {
    if (!hydrated || sessionPending || signedIn) return;
    const text = streakNudgeText(days);
    if (!text) return;
    const today = dayKey(new Date());
    try {
      if (window.localStorage.getItem(STREAK_TOAST_KEY) === today) return;
      window.localStorage.setItem(STREAK_TOAST_KEY, today);
    } catch {
      return; // Storage blocked: better silent than the same toast on every page.
    }
    showToast(`🔥 ${text}`, "info", 8000, {
      label: "Тіркелу",
      href: signUpHref(window.location.pathname + window.location.search),
    });
  }, [hydrated, sessionPending, signedIn, days, pathname]);
}
