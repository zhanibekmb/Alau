"use client";

import { useSyncExternalStore } from "react";

let clock = 0;

function subscribe(onChange: () => void) {
  const id = setInterval(() => {
    clock = Date.now();
    onChange();
  }, 60_000);
  return () => clearInterval(id);
}

function read() {
  if (!clock) clock = Date.now();
  return clock;
}

/**
 * The current time, updated each minute. Null during server rendering and hydration, so
 * dates ("3 күн қалды", today's streak) never differ between the server HTML and the browser.
 */
export function useNow(): Date | null {
  const time = useSyncExternalStore(subscribe, read, () => 0);
  return time ? new Date(time) : null;
}
