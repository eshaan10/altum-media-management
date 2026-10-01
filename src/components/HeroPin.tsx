"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pinned hero: sticks to the top of the viewport while the About section
 * (rendered after it, with a higher z-index) slides up over it. As About
 * approaches, the hero content eases back and fades so the layering reads.
 */
export default function HeroPin({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      inner.style.opacity = String(1 - progress * 0.75);
      inner.style.transform = `translate3d(0, ${progress * -6}vh, 0) scale(${1 - progress * 0.06})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky top-0 z-0 h-svh min-h-[34rem] overflow-hidden">
      <div ref={innerRef} className="h-full origin-top-left will-change-transform">
        {children}
      </div>
    </div>
  );
}
