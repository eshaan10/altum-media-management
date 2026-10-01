"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page: any element with `data-reveal`
 * fades + slides up the first time it enters the viewport.
 * Stagger with an inline `--reveal-delay` style.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
