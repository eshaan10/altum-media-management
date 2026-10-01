import Image from "next/image";
import { brands, type Brand } from "@/content/site";

// Logos are balanced by visual area rather than a fixed height, so a wide wordmark
// (Hydro Flask) and a tall mark (Sun Bum) carry similar weight. MAX_H caps tall ones.
const AREA = 2900; // px² at desktop size
const MAX_H = 38;
// Each half of the track repeats the list so one half is wider than very wide screens;
// the track then slides by exactly one half and loops seamlessly.
const REPEATS = 3;

function logoSize({ width, height }: Brand) {
  const aspect = width / height;
  const h = Math.min(MAX_H, Math.sqrt(AREA / aspect));
  return { w: Math.round(h * aspect), h: Math.round(h) };
}

function Logo({ brand, decorative }: { brand: Brand; decorative: boolean }) {
  const { w, h } = logoSize(brand);
  return (
    <li className="marquee-item shrink-0" aria-hidden={decorative || undefined}>
      <Image
        src={brand.logo}
        alt={decorative ? "" : brand.name}
        width={w}
        height={h}
        style={{ "--w": `${w}px`, "--h": `${h}px` } as React.CSSProperties}
        className="marquee-logo"
      />
    </li>
  );
}

/** Quiet, self-running strip of client logos between About and Services. */
export default function BrandMarquee() {
  const copies = REPEATS * 2;

  return (
    <section aria-labelledby="brands-label" className="relative z-10 bg-sky pb-4 sm:pb-8">
      {/* Same content column as the other sections, so the strip lines up with the pricing cards. */}
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <p id="brands-label" className="text-sm font-medium tracking-wide text-slate sm:text-base">
          {brands.label}
        </p>

        {/* Focusable so keyboard users can pause it (the only pause; hover doesn't). */}
        <div className="marquee mt-8 sm:mt-10" tabIndex={0} aria-label={brands.label} role="region">
          <ul className="marquee-track">
            {Array.from({ length: copies }, (_, copy) =>
              brands.list.map((brand) => (
                // Only the first copy is exposed to assistive tech; the rest are visual repeats.
                <Logo key={`${copy}-${brand.name}`} brand={brand} decorative={copy > 0} />
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
