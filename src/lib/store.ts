import { create } from "zustand";
import type { AnalysisResult } from "./types";

const KEY = "medassist:last-result";

function load(): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}

type Store = {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult) => void;
  hydrate: () => void;
};

export const useAnalysis = create<Store>((set) => ({
  result: null,
  setResult: (r) => {
    set({ result: r });
    try {
      localStorage.setItem(KEY, JSON.stringify(r));
    } catch {
      /* ignore quota */
    }
  },
  hydrate: () => set({ result: load() }),
}));
