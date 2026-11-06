"use client";

import { useSyncExternalStore } from "react";
import {
  INITIAL_STATE,
  addWord,
  mergeProgress,
  parseStoredState,
  type AppState,
  type Progress,
  type SavedWord,
  type Settings,
} from "./state";

const KEY = "alau:v1";
let state: AppState = INITIAL_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): AppState {
  try {
    return parseStoredState(window.localStorage.getItem(KEY));
  } catch {
    return state; // Storage is blocked: keep working in memory for this visit.
  }
}

function ensureLoaded() {
  if (!loaded) {
    state = readStorage();
    loaded = true;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

/** Always merges into what is stored now, so two tabs do not erase each other's data. */
function update(change: (current: AppState) => AppState) {
  ensureLoaded();
  const current = readStorage();
  const next = change(current);
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage is blocked or full. The change still lives in memory until the page closes.
  }
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function onStorage(event: StorageEvent) {
  if (event.key === KEY || event.key === null) {
    state = readStorage();
    notify();
  }
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_STATE);
}

const noSubscribe = () => () => {};
/** False during server rendering and hydration, when stored data cannot be known yet. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

export const recordProgress = (slug: string, progress: Progress) =>
  update((s) => ({
    ...s,
    progress: { ...s.progress, [slug]: mergeProgress(s.progress[slug], progress) },
  }));

export const saveWord = (word: SavedWord) =>
  update((s) => ({ ...s, words: addWord(s.words, word) }));

export const removeWord = (id: string) =>
  update((s) => {
    const words = { ...s.words };
    delete words[id];
    return { ...s, words };
  });

export const toggleSavedBook = (slug: string) =>
  update((s) => {
    const savedBooks = { ...s.savedBooks };
    if (savedBooks[slug]) delete savedBooks[slug];
    else savedBooks[slug] = Date.now();
    return { ...s, savedBooks };
  });

export const updateSettings = (change: Partial<Settings>) =>
  update((s) => ({ ...s, settings: { ...s.settings, ...change } }));

export const clearAllData = () => update(() => INITIAL_STATE);
