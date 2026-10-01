import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import RevealObserver from "@/components/RevealObserver";
import { HALFTONE_SESSION_KEY } from "@/lib/halftone";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const HEAD_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('${HALFTONE_SESSION_KEY}'))d.classList.add('halftone-armed')}catch(e){}})()`;

export const metadata: Metadata = {
  title: "Altum Media Management — Social media management for small businesses",
  description:
    "A two-person media team scaling small businesses on social. Finance-grade strategy, hands-on marketing execution.",
};

export const viewport: Viewport = {
  themeColor: "#D6ECFA",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibsted.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint. `js`: reveal animations may hide content (they can run).
            `halftone-armed`: the hero's dot animation will play this load (motion allowed and
            not yet played this session), so its line starts hidden; otherwise that line is
            plain visible text from the first frame. See HalftoneLine.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) inject attributes on <body> before hydration. */}
      <body suppressHydrationWarning>
        <SmoothScroll />
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
