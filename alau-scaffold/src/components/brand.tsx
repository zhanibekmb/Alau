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

/** Temporary drawing. Swap it for the Figma mascot images when Figma access returns. */
export function Mascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={FLAME} fill="#f59e0b" />
      <path d="M32 24c2 6 9 9 10 17 1 9-4 15-10 15s-11-6-10-15c1-7 8-10 10-17z" fill="#fcd34d" />
      <g fill="#fff" stroke="#3b2a12" strokeWidth="1.6">
        <circle cx="26" cy="36" r="5" />
        <circle cx="38" cy="36" r="5" />
      </g>
      <path d="M31 36h2" stroke="#3b2a12" strokeWidth="1.6" />
      <circle cx="26.5" cy="36.5" r="1.6" fill="#3b2a12" />
      <circle cx="38.5" cy="36.5" r="1.6" fill="#3b2a12" />
      <path d="M18 52c5-3 10-3 14 0 4-3 9-3 14 0v8c-5-3-10-3-14 0-4-3-9-3-14 0z" fill="#92400e" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}
