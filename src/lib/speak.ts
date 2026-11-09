"use client";

import type { Accent } from "./state";

// Word pronunciation with the browser's own speech synthesis: no audio files, no outside service.
// The voice follows the accent chosen in the profile.

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, accent: Accent) {
  if (!canSpeak()) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = accent === "gb" ? "en-GB" : "en-US";
  utterance.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang === utterance.lang) ?? voices.find((v) => v.lang.startsWith("en"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
