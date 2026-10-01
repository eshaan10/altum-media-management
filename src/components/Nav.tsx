"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brand } from "@/content/site";

const links = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "border-navy/10 bg-sky/85 backdrop-blur-md" : "border-transparent bg-sky/0"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="text-navy" aria-label={`${brand.name} — back to top`}>
          {/* Logo image from brand.logo in src/content/site.ts; text wordmark if src is null. */}
          {brand.logo.src ? (
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={brand.logo.width}
              height={brand.logo.height}
              priority
              className="block"
            />
          ) : (
            <span className="font-wordmark text-2xl font-semibold tracking-[0.04em] uppercase">
              {brand.wordmark}
            </span>
          )}
        </a>
        <ul className="flex items-center gap-5 text-sm font-medium sm:gap-8 sm:text-[0.95rem]">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-steel underline-offset-4 transition-colors hover:text-navy hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
