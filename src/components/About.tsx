import Image from "next/image";
import { about, type TeamMember } from "@/content/site";
import SectionLabel from "./SectionLabel";

function Headshot({ member }: { member: TeamMember }) {
  // Photos are pre-cropped squares with matching framing; see `photo` in src/content/site.ts.
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={`Portrait of ${member.name}`}
        width={176}
        height={176}
        className="size-24 rounded-full object-cover ring-1 ring-navy/10 sm:size-36 lg:size-44"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${member.name} photo coming soon`}
      className="grid size-24 place-items-center rounded-full border border-dashed border-steel/50 bg-white/40 text-2xl font-bold tracking-tight text-steel sm:size-36 sm:text-4xl lg:size-44"
    >
      {member.initials}
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 rounded-t-[1.75rem] bg-sky shadow-[0_-18px_40px_-28px_rgba(11,27,51,0.22)] sm:rounded-t-[2.5rem]"
    >
      <div className="mx-auto max-w-[90rem] px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-3">
            <SectionLabel index="01">{about.label}</SectionLabel>
          </div>
          <p
            data-reveal
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-balance text-navy sm:text-4xl lg:col-span-9 lg:text-5xl"
          >
            {about.intro}
          </p>
        </div>

        <ul className="mt-20 border-b border-navy/15 sm:mt-28">
          {about.team.map((member) => (
            <li
              key={member.name}
              data-reveal
              className="grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 border-t border-navy/15 py-8 sm:gap-x-10 sm:py-12 lg:grid-cols-12"
            >
              <div className="lg:col-span-3">
                <Headshot member={member} />
              </div>
              <h3 className="self-center text-2xl font-bold tracking-[-0.03em] text-navy sm:text-4xl lg:col-span-4 lg:self-start">
                {member.name}
              </h3>
              <div className="col-span-2 lg:col-span-5">
                <p className="max-w-xl text-base leading-relaxed text-navy/85 sm:text-lg">{member.bio}</p>
                {member.link && (
                  <a
                    href={member.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-2 font-semibold text-steel"
                  >
                    <span className="underline decoration-steel/30 underline-offset-[6px] transition-colors group-hover:decoration-steel">
                      {member.link.label}
                    </span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
