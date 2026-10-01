# Altum Media Management — marketing site

Single-scroll marketing page. Next.js (App Router) + Tailwind v4, Lenis smooth scroll, Resend for the contact form.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev                  # http://localhost:3000
```

## Editing content

All copy, prices, and links live in [`src/content/site.ts`](src/content/site.ts). Search that file for **`TBD`** to find every placeholder:

| Placeholder | Where to set it |
| --- | --- |
| Hero image / duo photo (optional, not used by the current layout) | `hero.image` |

Social links live in `contact.socials`. Only LinkedIn is set; add Instagram or TikTok as one line each.

The headline copy (hero, services, contact) and the brand-strip label are marked as working copy.

**Nav logo** is `/public/brand/altum-wordmark.png`, a navy, trimmed version of `media/logo.png`. It's set in `brand.logo`.

**Headshots** are square crops in `/public/team/`, cut from the originals in `/media` so both have matching framing. Replace a file with another square photo of similar framing, or point `about.team[n].photo` at a new one.

**Brand logos** (the strip between About and Services) come from `brands.list`. To add one:

1. Put a PNG with a transparent background, margins trimmed, in `/public/brands/`.
2. Add a line with its name, path and pixel size.

Sizes are balanced automatically by aspect ratio.

## Contact form

`POST /api/contact` ([`src/app/api/contact/route.ts`](src/app/api/contact/route.ts)) validates the input, drops honeypot spam, and sends the email via Resend with `replyTo` set to the submitter, so hitting Reply goes straight to the lead.

Environment variables (see `.env.example`):

- `RESEND_API_KEY` (required)
- `CONTACT_TO_EMAIL`: recipient(s), defaults to dmclaughlin@altummediamanagement.com
- `CONTACT_FROM_EMAIL`: must be on a domain verified in Resend. Verify `altummediamanagement.com` under Resend → Domains (add the DNS records it gives you). Before that, `onboarding@resend.dev` works, but it only delivers to the Resend account owner's email.

## Deploy (Vercel)

Import the repo in Vercel, add the three env vars above, and deploy. No other config is needed.

## Scroll behaviour

- **Smooth scroll**: [`SmoothScroll.tsx`](src/components/SmoothScroll.tsx) uses Lenis, which also handles `#anchor` links (offset for the fixed nav).
- **Reveals**: any element with `data-reveal` fades and slides up on first view, driven by one IntersectionObserver in [`RevealObserver.tsx`](src/components/RevealObserver.tsx). Stagger with an inline `--reveal-delay`.
- **Hero pin**: [`HeroPin.tsx`](src/components/HeroPin.tsx) keeps the hero sticky while About slides over it.
- **Halftone headline**: [`HalftoneLine.tsx`](src/components/HalftoneLine.tsx) plays once on load for the second hero sentence. It starts as a coarse grid of round dots on a canvas overlay and tightens smoothly (every animation frame) until solid, then fades into the real text. Grid sizes, duration and dot size are constants at the top of the file.
- All of these respect `prefers-reduced-motion`, and content stays visible without JavaScript.

The hero slogan lives in `hero.headline` in `src/content/site.ts`. Each sentence is a list of phrases that never break internally, so lines wrap only between them.
