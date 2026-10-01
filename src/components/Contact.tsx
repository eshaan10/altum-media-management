import { contact } from "@/content/site";
import SectionLabel from "./SectionLabel";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 bg-sky">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-16 sm:px-8 sm:pt-32 lg:px-12">
        <div className="grid gap-8 border-t border-navy/15 pt-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-3">
            <SectionLabel index="03">{contact.label}</SectionLabel>
          </div>
          <h2
            data-reveal
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="text-5xl font-extrabold tracking-[-0.045em] text-navy sm:text-7xl lg:col-span-9 lg:text-8xl"
          >
            {contact.heading}
          </h2>
        </div>

        <div className="mt-16 grid gap-16 sm:mt-24 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="space-y-10 lg:col-span-5 lg:col-start-4 lg:pr-12">
            <dl className="space-y-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg font-semibold break-all text-navy underline decoration-navy/20 underline-offset-[6px] transition-colors hover:decoration-steel sm:text-xl sm:break-normal"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Phone</dt>
                <dd className="mt-2">
                  <a
                    href={contact.phoneHref}
                    className="text-lg font-semibold text-navy underline decoration-navy/20 underline-offset-[6px] transition-colors hover:decoration-steel sm:text-xl"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Social</dt>
                <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {contact.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-navy underline decoration-navy/20 underline-offset-[6px] transition-colors hover:decoration-steel sm:text-xl"
                    >
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="lg:col-span-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
