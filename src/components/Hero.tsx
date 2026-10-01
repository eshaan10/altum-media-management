import { hero, about } from "@/content/site";
import HeroPin from "./HeroPin";
import HalftoneLine from "./HalftoneLine";

/** Joins phrases with normal spaces; words inside a phrase get non-breaking spaces. */
const sentence = (phrases: string[]) => phrases.map((p) => p.replaceAll(" ", " ")).join(" ");

export default function Hero() {
  const names = about.team.map((m) => m.name).join(" & ");
  const [first, second] = hero.headline.map(sentence);

  return (
    <HeroPin>
      <section className="mx-auto flex h-full max-w-[90rem] flex-col px-5 pt-16 sm:px-8 lg:px-12">
        {/* Hero uses .hero-in (CSS-only, plays on load) rather than scroll-triggered data-reveal. */}
        <div
          className="hero-in flex justify-between gap-6 border-t border-navy/15 pt-4 text-xs font-medium uppercase tracking-wide text-steel sm:text-sm"
        >
          <span>Social media management</span>
          <span className="text-right">{names}</span>
        </div>

        <div className="flex flex-1 flex-col pb-10 sm:pb-14">
          {/* Headline centred vertically in the space between the meta row and the subhead. */}
          <div className="flex flex-1 items-center py-10 sm:py-14">
            <h1 className="hero-headline font-extrabold text-navy">
              <span
                className="hero-in block text-balance"
                style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              >
                {first}
              </span>
              {/* Second sentence enters with the halftone-dot effect instead of the fade-up. */}
              <HalftoneLine text={second} className="block text-balance" />
            </h1>
          </div>

          <div
            style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
            className="hero-in flex flex-col gap-4 border-t border-navy/15 pt-5 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <p className="max-w-md text-lg leading-snug text-navy sm:text-xl">{hero.subhead}</p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-base font-semibold text-steel sm:text-lg"
            >
              <span className="underline decoration-steel/30 underline-offset-[6px] transition-colors group-hover:decoration-steel">
                {hero.linkLabel}
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </HeroPin>
  );
}
