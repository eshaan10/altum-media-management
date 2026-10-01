"use client";

import { useEffect } from "react";

const COUNT_MS = 700;
const LINE_STAGGER_MS = 50;
// Lines and price start a beat after the card itself begins its fade-up.
const LEAD_MS = 150;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
// Same markup as PriceText in Services: the comma opts out of tabular width.
const format = (n: number) =>
  `$${Math.round(n).toLocaleString("en-US")}`.replaceAll(",", '<span class="price-sep">,</span>');

/**
 * Pricing-card entrance, once per page load and per card as it scrolls into view:
 * feature lines fade up one by one and the price counts up from $0.
 * Server HTML already shows final prices and all lines, so no-JS and reduced
 * motion get the finished state; this only arms the effect when it can run.
 */
export default function ServicesMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = document.getElementById("services");
    if (!section) return;

    const cards = [...section.querySelectorAll<HTMLElement>("[data-tier-card]")];
    const prices = cards.flatMap((c) => [...c.querySelectorAll<HTMLElement>("[data-price]")]);
    const timers: number[] = [];
    const frames = new Set<number>();

    section.classList.add("services-armed");
    for (const p of prices) p.innerHTML = format(0);

    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.price);
      let start = 0;
      const tick = (now: number) => {
        start ||= now;
        const t = Math.min(1, (now - start) / COUNT_MS);
        el.innerHTML = format(target * easeOutCubic(t));
        if (t < 1) frames.add(requestAnimationFrame(tick));
      };
      frames.add(requestAnimationFrame(tick));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target as HTMLElement;
          observer.unobserve(card);
          // Match the card's own staggered reveal delay (set on its wrapper in Services).
          const lead = (parseFloat(getComputedStyle(card.parentElement!).getPropertyValue("--reveal-delay")) || 0) + LEAD_MS;
          card.querySelectorAll<HTMLElement>("[data-line]").forEach((li, i) => {
            li.style.transitionDelay = `${lead + i * LINE_STAGGER_MS}ms`;
          });
          card.classList.add("lines-in");
          card.querySelectorAll<HTMLElement>("[data-price]").forEach((p) => {
            timers.push(window.setTimeout(() => countUp(p), lead));
          });
        }
      },
      // Same trigger as RevealObserver, so lines and count start as the card appears.
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((c) => observer.observe(c));

    // Strict mode runs effects twice: restore the finished state so the re-run starts clean.
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
      section.classList.remove("services-armed");
      for (const c of cards) {
        c.classList.remove("lines-in");
        c.querySelectorAll<HTMLElement>("[data-line]").forEach((li) => (li.style.transitionDelay = ""));
      }
      for (const p of prices) p.innerHTML = format(Number(p.dataset.price));
    };
  }, []);

  return null;
}
