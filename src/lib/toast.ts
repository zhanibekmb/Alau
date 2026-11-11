"use client";

import { useSyncExternalStore } from "react";

// Short notices at the bottom of the screen ("Аккаунттан шықтыңыз"). One at a time; a new
// one replaces the old. The Toaster in the root layout shows it, so it survives navigation.

export type ToastAction = { label: string; href: string };
export type Toast = { id: number; text: string; tone: "info" | "success"; action?: ToastAction };

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function showToast(text: string, tone: Toast["tone"] = "info", ms = 4000, action?: ToastAction) {
  current = { id: Date.now(), text, tone, action };
  clearTimeout(timer);
  timer = setTimeout(hideToast, ms);
  emit();
}

export function hideToast() {
  current = null;
  emit();
}

export function useToast(): Toast | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null,
  );
}
