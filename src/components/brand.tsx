import Image from "next/image";

const FLAME = "M32 4c3 10 14 15 17 27 3 13-6 27-17 27S12 46 15 33c1-6 5-9 7-14 1 5 3 7 5 8 1-8 1-15 5-23z";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${className}`}>
      <svg viewBox="0 0 64 64" className="h-[1.15em] w-[1.15em]" aria-hidden="true">
        <path d={FLAME} fill="currentColor" />
      </svg>
      Alau
    </span>
  );
}

/** The flame alone: the logo mark in the phone page headers. */
export function Flame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={FLAME} fill="currentColor" />
    </svg>
  );
}

export type MascotPose =
  | "audio-book"
  | "empty-state"
  | "flashcards"
  | "level-up"
  | "mastered"
  | "onboarding-login"
  | "reader-tooltip"
  | "streak"
  | "subscription";

/** The flame character from the Figma file (public/mascots, 512 px WebP). Decorative: no alt text. */
export function Mascot({ pose = "onboarding-login", className = "" }: { pose?: MascotPose; className?: string }) {
  return (
    <Image
      src={`/mascots/${pose}.webp`}
      alt=""
      width={512}
      height={512}
      sizes="160px"
      className={`object-contain ${className}`}
    />
  );
}
