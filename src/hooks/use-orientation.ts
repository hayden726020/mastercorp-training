"use client";

import { useState, useEffect } from "react";

export type Orientation = "portrait" | "landscape";

/**
 * Detects the current screen orientation (portrait / landscape).
 *
 * Uses `window.matchMedia("(orientation: portrait)")` so it responds to
 * both device rotation and viewport resize (e.g. browser window resize,
 * devtools docking, foldable screens).
 *
 * Returns "landscape" during SSR to match the default coordinate set.
 */
export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === "undefined") return "landscape";
    return window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape";
  });

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");

    const handleChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "portrait" : "landscape");
    };

    // Modern browsers
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return orientation;
}
