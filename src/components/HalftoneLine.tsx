"use client";

import { useEffect, useRef } from "react";
import { HALFTONE_SESSION_KEY } from "@/lib/halftone";

/**
 * Halftone "growing" entrance: the line starts as a coarse grid of round dots
 * that continuously tightens (every animation frame) until the dots merge into
 * solid letters, then crossfades into the real DOM text.
 *
 * The real text stays in the DOM throughout (just transparent while the
 * aria-hidden canvas overlay runs). Each glyph is drawn at its measured DOM
 * position, so balanced line wrapping, kerning, and letter-spacing all match.
 *
 * Plays on page load (once fonts are ready), never on scroll, and once per
 * browser session. Whether this load animates is decided before first paint by
 * the head script in layout.tsx (`html.halftone-armed`); without that class the
 * line is plain visible text from the first frame. While armed, CSS hides the
 * line, with a 1.5s CSS failsafe that shows it if the animation hasn't started
 * (slow fonts, slow or failed JS). If the failsafe has already fired, this
 * stands down instead of re-hiding visible text.
 */

// Grid cell size as a fraction of font size: coarse → fine over DURATION_MS.
const CELL_FROM = 0.22;
const CELL_TO = 0.016;
const DURATION_MS = 1200;
// Over the last part of the run, the DOM text shows underneath and the dots fade off it.
const HANDOFF_MS = 260;
const START_DELAY_MS = 250; // after the first headline line appears
const FIRST_LINE_DELAY_MS = 120; // matches line 1's --reveal-delay in Hero

// Dot radius for a fully covered cell, as a fraction of cell size. Just over
// half the cell diagonal (0.707) so neighbouring full dots merge with no pinholes.
const MAX_RADIUS = 0.72;
// Dots start smaller relative to their cell and swell to full size by the end.
const GROW_FROM = 0.72;
const MIN_COVERAGE = 0.03;
const TINT_FROM = [0x1e, 0x5a, 0x8c]; // steel blue

// Lingers a touch on the coarse dots, speeds through the middle, settles gently.
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

let played = false;
// Decided once, on first mount (strict mode's re-run sees its own reset, not the real state).
let shouldAnimate: boolean | null = null;

const TRANSPARENT = "rgba(0, 0, 0, 0)";

type Glyph = { ch: string; x: number; y: number };

export default function HalftoneLine({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => {
      el.style.removeProperty("color");
      el.setAttribute("data-halftone", "done");
    };

    shouldAnimate ??=
      document.documentElement.classList.contains("halftone-armed") &&
      // Still hidden, i.e. the CSS failsafe hasn't already revealed it.
      getComputedStyle(el).color === TRANSPARENT &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !!document.createElement("canvas").getContext("2d");
    if (played || !shouldAnimate) return done();

    // Strict mode re-runs effects; the previous cleanup marked this "done", so re-hide.
    el.setAttribute("data-halftone", "pending");
    const mountedAt = performance.now();
    const startWidth = window.innerWidth;
    let cancelled = false;
    let timer = 0;
    let frame = 0;
    let canvas: HTMLCanvasElement | null = null;

    const cleanup = () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      canvas?.remove();
      canvas = null;
      done();
    };
    // Ignore height-only resizes (mobile URL bar showing/hiding on scroll).
    const onResize = () => {
      if (window.innerWidth !== startWidth) cleanup();
    };

    const start = () => {
      // Fonts took long enough that the CSS failsafe has shown the text: leave it be.
      if (cancelled || getComputedStyle(el).color !== TRANSPARENT) return cleanup();
      const textNode = el.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return cleanup();

      const cs = getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
      // The pending state makes the text transparent; read the real colour with it lifted
      // (synchronous, so it never paints).
      el.setAttribute("data-halftone", "done");
      const finalRgb = cs.color.match(/\d+(\.\d+)?/g)!.slice(0, 3).map(Number);
      el.setAttribute("data-halftone", "pending");

      // Element box in layout px. Ancestors may be scaled (hero pin), so normalise rects.
      const box = el.getBoundingClientRect();
      const scale = box.width / el.offsetWidth || 1;
      // Room on every side for descenders, overhang, and edge dots (which can reach past the ink).
      const pad = Math.ceil(fontSize * 0.4);
      const w = el.offsetWidth + pad * 2;
      const h = el.offsetHeight + pad * 2;
      const dpr = window.devicePixelRatio || 1;

      const measure = document.createElement("canvas").getContext("2d")!;
      measure.font = font;
      const m = measure.measureText(text);
      const ascent = m.fontBoundingBoxAscent;
      const descent = m.fontBoundingBoxDescent;

      // Glyph positions straight from layout, per character.
      const glyphs: Glyph[] = [];
      const range = document.createRange();
      const str = textNode.textContent ?? "";
      for (let i = 0; i < str.length; i++) {
        if (/\s/.test(str[i])) continue;
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const r = range.getClientRects()[0];
        if (!r) continue;
        const mid = (r.top + r.bottom) / 2;
        glyphs.push({
          ch: str[i],
          x: (r.left - box.left) / scale + pad,
          // Baseline sits (ascent - descent) / 2 below the middle of the glyph's content box.
          y: (mid - box.top) / scale + (ascent - descent) / 2 + pad,
        });
      }

      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      Object.assign(canvas.style, {
        position: "absolute",
        left: `${-pad}px`,
        top: `${-pad}px`,
        width: `${w}px`,
        height: `${h}px`,
        pointerEvents: "none",
      });
      const ctx = canvas.getContext("2d");
      const sample = document.createElement("canvas");
      const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
      if (!ctx || !sampleCtx) return cleanup();

      /** Draws the dot grid at `cell` CSS px; `t` (0→1) drives dot growth and tint. */
      const render = (cell: number, t: number) => {
        // Anchor the grid on the canvas centre so dots converge inward as it tightens,
        // instead of everything sliding toward one corner.
        const ox = ((w / 2) % cell) - cell;
        const oy = ((h / 2) % cell) - cell;
        const cols = Math.ceil((w - ox) / cell);
        const rows = Math.ceil((h - oy) / cell);
        // Coverage samples per cell edge: fewer once cells are only a few device px.
        const ss = cell * dpr > 6 ? 3 : 2;

        sample.width = cols * ss;
        sample.height = rows * ss;
        const k = ss / cell;
        sampleCtx.setTransform(k, 0, 0, k, -ox * k, -oy * k);
        sampleCtx.font = font;
        sampleCtx.fillStyle = "#000";
        sampleCtx.textBaseline = "alphabetic";
        for (const g of glyphs) sampleCtx.fillText(g.ch, g.x, g.y);
        const alpha = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;

        const maxR = cell * MAX_RADIUS * (GROW_FROM + (1 - GROW_FROM) * t);
        const rgb = TINT_FROM.map((f, i) => Math.round(f + (finalRgb[i] - f) * t));

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = `rgb(${rgb.join(",")})`;
        ctx.beginPath();

        const rowStride = sample.width * 4;
        const samples = ss * ss * 255;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            let sum = 0;
            const base = row * ss * rowStride + col * ss * 4 + 3;
            for (let sy = 0; sy < ss; sy++) {
              for (let sx = 0; sx < ss; sx++) sum += alpha[base + sy * rowStride + sx * 4];
            }
            const coverage = sum / samples;
            if (coverage < MIN_COVERAGE) continue;
            // sqrt so dot *area* tracks coverage.
            const r = maxR * Math.sqrt(coverage);
            const cx = ox + (col + 0.5) * cell;
            const cy = oy + (row + 0.5) * cell;
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      };

      played = true;
      try {
        sessionStorage.setItem(HALFTONE_SESSION_KEY, "1");
      } catch {}
      el.setAttribute("data-halftone", "running");
      el.appendChild(canvas);
      window.addEventListener("resize", onResize);

      const [r, g, b] = finalRgb;
      const logFrom = Math.log(CELL_FROM);
      const logTo = Math.log(CELL_TO);
      let startedAt = 0;
      const tick = (now: number) => {
        if (cancelled || !canvas) return;
        startedAt ||= now;
        const elapsed = now - startedAt;
        if (elapsed >= DURATION_MS) return cleanup(); // hand off to DOM text

        const t = easeInOutSine(elapsed / DURATION_MS);
        // Interpolate in log space so each halving of cell size takes equal time.
        render(fontSize * Math.exp(logFrom + (logTo - logFrom) * t), t);

        // Handoff: the real text switches on underneath at full strength and the dots
        // (by now nearly the same shape) fade off it. Fading both at once would dip
        // the line's darkness mid-way.
        const fade = Math.max(0, (elapsed - (DURATION_MS - HANDOFF_MS)) / HANDOFF_MS);
        if (fade > 0) {
          el.style.color = `rgb(${r} ${g} ${b})`;
          canvas.style.opacity = String(1 - fade);
        }

        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const wait = Math.max(START_DELAY_MS, FIRST_LINE_DELAY_MS + START_DELAY_MS - (performance.now() - mountedAt));
      timer = window.setTimeout(start, wait);
    });

    return cleanup;
  }, [text]);

  return (
    <span ref={ref} data-halftone="pending" className={`relative ${className ?? ""}`}>
      {text}
    </span>
  );
}
