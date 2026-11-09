import type { ReactNode } from "react";

/** Label beside an icon while the sidebar is folded. Screen readers use the link text instead. */
export function Tooltip({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 collapsed:block"
    >
      {children}
    </span>
  );
}
