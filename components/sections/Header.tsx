"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { EASE_LUXE } from "@/components/ui/Reveal";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#3d", label: "3D" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

/** Reads the `data-header` of whichever section sits under the bar, so it is legible on dark and light. */
export default function Header() {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menu, setMenu] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const hero = document.getElementById("top");
      setPastHero(!!hero && hero.getBoundingClientRect().bottom < 80);
      const sections = document.querySelectorAll<HTMLElement>("[data-header]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= 36 && r.bottom > 36) {
          setDark(s.dataset.header === "dark");
          break;
        }
      }
    };
    const onScroll = () => (raf ||= requestAnimationFrame(check));
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menu) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menu) {
        setMenu(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, lenis]);

  const onDark = dark || menu;
  // Over the hero the bar floats; elsewhere it gets a tinted backdrop matching the section below it.
  const solid = scrolled && (pastHero || !dark) && !menu;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${onDark ? "text-ivory" : "text-ink"} ${
        solid
          ? onDark
            ? "border-b border-line-dark bg-emerald/80 backdrop-blur-md"
            : "border-b border-line-light bg-ivory/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-baseline gap-2" aria-label={`${site.brand} home`}>
          <span className="display text-[1.9rem] leading-none tracking-[-0.01em]">{site.brand}</span>
          <span className={`label hidden sm:inline ${onDark ? "text-gold" : "text-gold-ink"}`}>Studio</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[14px] font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="group relative py-2">
                  {n.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className={`hidden min-h-11 items-center rounded-full border px-5 text-[14px] font-semibold transition-colors md:inline-flex ${
              onDark ? "border-gold/60 text-gold hover:bg-gold hover:text-emerald" : "border-ink/80 hover:bg-ink hover:text-ivory"
            }`}
          >
            Start a project
          </a>
          <button
            ref={toggle}
            type="button"
            className="grid h-11 w-11 place-items-center md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between bg-emerald px-4 pt-8 pb-10 text-ivory md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE_LUXE }}
          >
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE_LUXE }}
                >
                  <a href={n.href} onClick={() => setMenu(false)} className="display flex items-baseline gap-4 border-b border-line-dark py-3 text-5xl">
                    <span className="label text-gold">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="space-y-2 text-sm text-mist">
              <p>{site.email}</p>
              <p>{site.phone}</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
