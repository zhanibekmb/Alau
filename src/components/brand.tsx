import Image from "next/image";
import { useId } from "react";

// The Alau flame: an outer flame with an inner tongue and a small spark.
const OUTER =
  "M32 2.5c1.6 8.2 6.6 12.6 11.2 17.6 4.8 5.2 8.8 11 8.8 19.4C52 51.6 43.2 61 32 61S12 51.6 12 39.8c0-7 3-12.6 7.2-17.2.8 4.6 3 7.8 6.2 9.4-.9-11.2 1.6-21.8 6.6-29.5z";
const INNER =
  "M32.6 29c1.2 5.3 4.4 8 6.8 11.2 1.8 2.4 2.9 4.9 2.9 8.2C42.3 54.4 37.6 58 32 58s-10.3-3.6-10.3-9.6c0-3.8 1.9-6.7 4.3-9.1.4 2.6 1.7 4.4 3.6 5.3-.5-6.2.6-11.4 3-15.6z";
const SPARK = "M46.5 6.5c1.6 2.6 2.4 5 1.6 7.6-.5 1.6-1.8 2.7-3.3 2.9.9-3.3 1.4-6.8 1.7-10.5z";

/**
 * mono: one colour (currentColor) with the inner tongue cut out — for the logo next to text.
 * color: amber-to-orange flame with a golden core — for the landing page.
 */
export function Flame({ className = "", variant = "mono" }: { className?: string; variant?: "mono" | "color" }) {
  const id = useId().replace(/:/g, "");
  if (variant === "mono") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path d={`${OUTER} ${INNER}`} fill="currentColor" fillRule="evenodd" />
        <path d={SPARK} fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB627" />
          <stop offset="0.55" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#E8590C" />
        </linearGradient>
        <linearGradient id={`${id}i`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="1" stopColor="#FFC24B" />
        </linearGradient>
      </defs>
      <path d={OUTER} fill={`url(#${id}o)`} />
      <path d={INNER} fill={`url(#${id}i)`} />
      <path d={SPARK} fill="#FFB627" />
    </svg>
  );
}

export function Logo({ className = "", variant = "mono" }: { className?: string; variant?: "mono" | "color" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${className}`}>
      <Flame variant={variant} className="h-[1.15em] w-[1.15em]" />
      Alau
    </span>
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
export function Mascot({ pose = "onboarding-login", className = "", eager = false }: {
  pose?: MascotPose;
  className?: string;
  /** For a large mascot in the first screen (the sign-in panel), so it is not lazy-loaded. */
  eager?: boolean;
}) {
  return (
    <Image
      src={`/mascots/${pose}.webp`}
      alt=""
      width={512}
      height={512}
      sizes={eager ? "256px" : "160px"}
      loading={eager ? "eager" : undefined}
      className={`object-contain ${className}`}
    />
  );
}
