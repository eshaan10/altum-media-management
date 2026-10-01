"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Eased, inertial page scrolling. Also handles in-page anchor links, offset for the fixed nav. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
      anchors: { offset: -72 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
