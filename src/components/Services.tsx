import { services, type Tier } from "@/content/site";
import SectionLabel from "./SectionLabel";
import ServicesMotion from "./ServicesMotion";

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="mt-[0.28em] size-[15px] shrink-0 text-steel">
      <path d="M3.25 8.4 6.4 11.5l6.35-7" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Price with tabular digits but a normal-width comma (tabular commas leave a gap: "$1 , 500"). */
function PriceText({ value }: { value: string }) {
  const [head, ...rest] = value.split(",");
  return (
    <>
      {head}
      {rest.map((part, i) => (
        <span key={i}>
          <span className="price-sep">,</span>
          {part}
        </span>
      ))}
    </>
  );
}

const groupLabel = "text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate";

function TierCard({ tier }: { tier: Tier }) {
  const amount = Number(tier.price.replace(/[^\d]/g, ""));

  return (
    <article
      data-tier-card
      className={`relative flex flex-col rounded-[10px] border-[0.5px] bg-white p-7 transition-[translate,border-color] duration-200 ease-out hover:-translate-y-[3px] hover:border-steel sm:p-9 ${
        // CREATE carries a persistent (non-hover) emphasis: steel border tint + a 3px steel top
        // border as the accent bar. Being the card's own border, it follows the rounded corners
        // and tapers into the sides. Top padding drops by the extra 2.5px so content still lines
        // up with the other cards.
        tier.popular
          ? "border-steel/55 border-t-[3px] border-t-steel pt-[25.5px] sm:pt-[33.5px]"
          : "border-steel/20"
      }`}
    >
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-navy">{tier.name}</h3>
        {tier.popular && (
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-steel">Popular</span>
        )}
      </header>

      <p className="mt-7 flex items-baseline gap-1.5 text-navy">
        <span className="sr-only">{tier.price} per month</span>
        {/* The count-up rewrites the visible digits; an invisible copy of the final value
            reserves the width so "/mo" never shifts. */}
        <span aria-hidden className="inline-grid text-6xl font-extrabold tracking-[-0.055em] tabular-nums sm:text-7xl">
          <span className="invisible col-start-1 row-start-1">
            <PriceText value={tier.price} />
          </span>
          <span data-price={amount} className="col-start-1 row-start-1">
            <PriceText value={tier.price} />
          </span>
        </span>
        <span aria-hidden className="text-base font-medium text-slate">
          /mo
        </span>
      </p>

      <div className="mt-8 border-t-[0.5px] border-navy/15 pt-6">
        <h4 className={groupLabel}>Included</h4>
        <ul className="mt-4 space-y-3">
          {tier.included.map((item) => (
            <li key={item} data-line className="flex gap-3 text-[0.95rem] leading-snug text-navy">
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-10">
        <a
          href="#contact"
          data-plan={tier.name}
          className={`block rounded-[7px] px-5 py-3.5 text-center text-[0.95rem] font-semibold transition-colors duration-200 ease-out ${
            tier.popular
              ? "bg-steel text-white hover:bg-[#174A73]"
              : "border-[0.5px] border-steel/60 text-steel hover:border-steel hover:bg-steel hover:text-white"
          }`}
        >
          Ask about {tier.name}
        </a>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative z-10 bg-sky">
      <div className="mx-auto max-w-[90rem] px-5 pt-20 pb-24 sm:px-8 sm:pt-24 sm:pb-32 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-3">
            <SectionLabel index="02">{services.label}</SectionLabel>
          </div>
          <h2
            data-reveal
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="text-4xl font-extrabold tracking-[-0.04em] text-navy sm:text-6xl lg:col-span-9 lg:text-7xl"
          >
            {services.heading}
          </h2>
        </div>

        {/* items-start: each card is its natural height (no stretching to the tallest). */}
        <div className="mx-auto mt-14 grid max-w-2xl items-start gap-5 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {services.tiers.map((tier, i) => (
            <div
              key={tier.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <TierCard tier={tier} />
            </div>
          ))}
        </div>
      </div>
      <ServicesMotion />
    </section>
  );
}
