import type { Sentence } from "./types";

export const sentenceText = (sentence: Sentence) => sentence.tokens.map((t) => t.t).join("").trim();
