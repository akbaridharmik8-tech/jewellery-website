"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { EASE_LUXE } from "@/components/ui/Reveal";

const NAV = [
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/**
 * A compact pill that floats off the top edge (landing-page-design B7): translucent
 * over a blur, tinted for the section beneath it, with the current section marked.
 */
export default function Header() {
  const [dark, setDark] = useState(true);
  const [current, setCurrent] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  // Light or dark tint: read the `data-header` of the section under the bar (rAF throttled).
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      for (const s of document.querySelectorAll<HTMLElement>("[data-header]")) {
        const r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) {
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

  // Current section for the nav (B9): whichever nav section crosses the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
          else setCurrent((c) => (c === e.target.id ? null : c));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <div
        className={`pointer-events-auto flex w-full items-center justify-between gap-6 rounded-full border py-2 pr-2 pl-6 backdrop-blur-xl transition-colors duration-500 md:w-auto ${
          onDark ? "border-ivory/10 bg-onyx/70 text-ivory" : "border-ink/10 bg-ivory/75 text-ink"
        }`}
      >
        <a href="#top" className="flex items-baseline gap-2" aria-label={`${site.brand} home`}>
          <span className="display text-3xl leading-none">{site.brand}</span>
          <span className={`label hidden sm:inline ${onDark ? "text-champagne" : "text-taupe"}`}>Studio</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = current === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active ? "true" : undefined}
                    className={`relative flex min-h-10 items-center rounded-full px-3 text-sm font-medium transition-colors ${
                      active ? (onDark ? "bg-ivory/10 text-champagne" : "bg-ink/5 text-taupe") : onDark ? "hover:bg-ivory/10" : "hover:bg-ink/5"
                    }`}
                  >
                    {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className={`hidden min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.98] md:inline-flex ${
              onDark ? "bg-champagne text-onyx hover:bg-ivory" : "bg-ink text-ivory hover:bg-onyx"
            }`}
          >
            Start a project
          </a>
          <button
            ref={toggle}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile: a full-height panel, links arriving one after another (60ms apart, under 400ms total) */}
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="pointer-events-auto fixed inset-0 -z-10 flex flex-col justify-between bg-onyx/95 px-4 pt-24 pb-10 text-ivory backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_LUXE }}
          >
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.16, ease: EASE_LUXE }}
                >
                  <a
                    href={`#${n.id}`}
                    onClick={() => setMenu(false)}
                    aria-current={current === n.id ? "true" : undefined}
                    className={`display flex items-baseline gap-4 border-b border-line-dark py-3 text-5xl ${current === n.id ? "text-champagne" : ""}`}
                  >
                    <span className="label text-champagne">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="space-y-6">
              <a
                href="#contact"
                onClick={() => setMenu(false)}
                className="flex min-h-12 items-center justify-center rounded-full bg-champagne text-base font-semibold text-onyx active:scale-[0.98]"
              >
                Start a project
              </a>
              <div className="space-y-2 text-sm text-greige">
                <p>{site.email}</p>
                <p>{site.phone}</p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
