/**
 * All site copy lives here. Edit this file to change text, prices, links,
 * and placeholder assets — no component changes needed.
 *
 * Search for "TBD" to find every placeholder that still needs real content.
 */

export const brand = {
  name: "Altum Media Management",
  wordmark: "Altum",
  // Nav logo: navy recolour of media/logo.png, trimmed to the letters. width/height are the
  // display size in px (keep the file's 633:120 ratio). Set src to null to fall back to the
  // text wordmark above.
  logo: { src: "/brand/altum-wordmark.png" as string | null, alt: "Altum Media Management", width: 116, height: 22 },
};

export const hero = {
  // Working copy — Dom/Haley may want to adjust. Two sentences; the second gets the on-load
  // halftone animation. Each sentence is split into phrases that never break internally, so
  // lines only wrap *between* phrases (e.g. on phones: "One less thing / to worry about.").
  headline: [
    ["One less thing", "to worry about."],
    ["One more way", "to grow."],
  ],
  subhead: "A two-person media team scaling small businesses on social.",
  linkLabel: "Get in touch",
  // TBD — HERO IMAGE / DUO PHOTO (optional): not used in the current layout.
  // If you want one, add it to /public and set the path here.
  image: null as string | null,
};

export type TeamMember = {
  name: string;
  initials: string;
  bio: string;
  // Square photo in /public/team/, shown in a circle. Set to null to show initials instead.
  photo: string | null;
  link?: { label: string; href: string };
};

export const about = {
  label: "About",
  intro:
    "Altum Media Management pairs finance-grade strategy with hands-on marketing execution, helping small businesses grow a real presence on social media without the guesswork.",
  team: [
    {
      name: "Dominic McLaughlin",
      initials: "DM",
      bio: "Computer science graduate from UC Irvine with 3+ years of experience in finance, including investment banking and private equity.",
      photo: "/team/dominic-mclaughlin.jpg",
    },
    {
      name: "Haley Dutra",
      initials: "HD",
      bio: "Marketing graduate from Fresno State with 5+ years of experience, having worked with 7+ small business clients and handled institutional marketing for brands including O'Neill, PSD, and Hydro Flask.",
      photo: "/team/haley-dutra.jpg",
      link: { label: "View portfolio", href: "https://canva.link/n1cffv7ogxlz3vr" },
    },
  ] satisfies TeamMember[],
};

export type Brand = {
  name: string;
  // Logo in /public/brands/: transparent background, margins trimmed.
  logo: string;
  // The file's pixel size — only the ratio matters (used to balance logo sizes).
  width: number;
  height: number;
};

export const brands = {
  // Working copy — easy to change.
  label: "Brands we've brought campaigns to",
  // Add a brand: drop a trimmed, transparent PNG in /public/brands/ and add one line.
  list: [
    { name: "O'Neill", logo: "/brands/oneill.png", width: 540, height: 200 },
    { name: "PSD", logo: "/brands/psd.png", width: 728, height: 200 },
    { name: "Hydro Flask", logo: "/brands/hydro-flask.png", width: 849, height: 200 },
    { name: "RIIP Beer Co.", logo: "/brands/riip.png", width: 284, height: 200 },
    { name: "Sun Bum", logo: "/brands/sun-bum.png", width: 141, height: 200 },
  ] satisfies Brand[],
};

export type Tier = {
  name: string;
  price: string;
  popular?: boolean;
  included: string[];
  excluded: string[];
};

export const services = {
  label: "Services",
  // Working copy — easy to change.
  heading: "Three ways to work with us.",
  tiers: [
    {
      name: "Manage",
      price: "$500",
      included: [
        "Daily DM and comment responses",
        "Daily engagement on your existing profiles",
        "Profile and page maintenance",
        "1–2 posts per month (client-provided content)",
        "Basic community management",
        "Monthly check-in call",
      ],
      excluded: ["Content creation", "Strategy or brainstorming", "Paid ads", "Video work"],
    },
    {
      name: "Create",
      price: "$1,500",
      popular: true,
      included: [
        "6 original posts per month, created by us",
        "You direct the content, we execute",
        "Custom graphics and captions included",
        "2–3 platforms managed",
        "Daily DM and comment responses",
        "Full engagement management",
        "Bi-weekly strategy calls",
        "Monthly analytics report",
      ],
      excluded: ["Strategic brainstorming", "Video production", "Paid ads"],
    },
    {
      name: "Strategy",
      price: "$3,500",
      included: [
        "8–10 posts per month",
        "We brainstorm and pitch ideas",
        "Video content (Reels/TikTok)",
        "3–4 platforms managed",
        "Paid ad management, $500–1,000 ad spend included",
        "Daily engagement management",
        "Weekly analytics and optimization",
        "Weekly strategy calls",
        "Monthly big-picture planning",
      ],
      excluded: ["High-production video", "Full brand rebrand", "Photo shoots"],
    },
  ] satisfies Tier[],
};

export const contact = {
  label: "Contact",
  // Working copy — easy to change.
  heading: "Let's grow something.",
  email: "dmclaughlin@altummediamanagement.com",
  phone: "(559) 707-0745",
  phoneHref: "tel:+15597070745",
  // Social profiles, shown as links under "Social" (open in a new tab). To add Instagram or
  // TikTok later, add a line here with the full profile URL, e.g.
  // { label: "Instagram", href: "https://www.instagram.com/<handle>/" },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/altum-media-management/" },
  ] as { label: string; href: string }[],
};
