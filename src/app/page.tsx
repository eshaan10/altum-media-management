import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import BrandMarquee from "@/components/BrandMarquee";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import { brand } from "@/content/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <div id="top" />
        {/* Hero stays pinned while About slides up over it; the wrapper bounds the pin. */}
        <div className="relative">
          <Hero />
          <About />
        </div>
        <BrandMarquee />
        <Services />
        <Contact />
      </main>
      <footer className="relative z-10 bg-sky">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-2 border-t border-navy/15 px-5 py-8 text-sm text-slate sm:flex-row sm:justify-between sm:px-8 lg:px-12">
          <span>
            © {new Date().getFullYear()} {brand.name}
          </span>
          <a href="#top" className="text-steel hover:text-navy">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
