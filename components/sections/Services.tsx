"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { services } from "@/lib/site";
import { MaskLines, Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  return (
    <section
      id="services"
      data-header="light"
      className="relative bg-bone py-[clamp(88px,11vw,160px)]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
    >
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel no="02">Services</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.6rem,6vw,6rem)]">
              <MaskLines lines={["Everything a jewellery", "brand needs to be seen."]} />
            </h2>
          </div>
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="text-[15px] leading-relaxed text-stone">
              One team from the first test shot to the last ad report. Pick a single service or hand us the whole launch.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line-light md:mt-24">
          {services.map((s, i) => (
            <Reveal as="li" key={s.no} delay={i * 0.04}>
              <a
                href="#contact"
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 border-b border-line-light py-7 transition-colors md:grid-cols-12 md:py-9"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="label text-gold-ink md:col-span-1">{s.no}</span>
                <span className="display text-[clamp(1.9rem,3.6vw,3.4rem)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3 md:col-span-6">
                  {s.title}
                </span>
                <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-45 text-ink/40 transition-all duration-500 group-hover:rotate-0 group-hover:text-gold-ink md:order-last md:col-span-1 md:justify-self-end" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="col-span-3 col-start-2 max-w-md text-[15px] leading-relaxed text-stone md:col-span-4 md:col-start-auto">{s.line}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Cursor-following preview (pointer devices only) */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-10 hidden [@media(hover:hover)]:block"
        style={{ x: sx, y: sy }}
        aria-hidden
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="relative -mt-36 -ml-28 h-72 w-56 overflow-hidden rounded-[2px] bg-emerald shadow-[0_30px_60px_-20px_rgb(12_38_32/0.6)]"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={services[active].preview} alt="" fill sizes="224px" className="object-contain p-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
