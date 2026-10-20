"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const preference = window.matchMedia(query);
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
}

// Render static content on the server and during hydration, then read the preference.
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true);
}
