"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { process } from "@/lib/site";
import { MaskLines, Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function Process() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 0.7", "end 0.6"] });

  return (
    <section id="process" data-header="dark" className="grain relative bg-emerald-2 py-[clamp(88px,11vw,160px)] text-ivory">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionLabel no="05" dark>
              Process
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.6rem,5vw,5rem)]">
              <MaskLines lines={["From brief", "to bestseller."]} />
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mist">
              Four steps, one point of contact, and a shared folder you can see from day one. Most shoots go from brief to delivery in under two weeks.
            </p>
          </div>
        </div>

        <ol ref={list} className="relative md:col-span-6 md:col-start-7">
          {/* Progress rail drawn by scroll */}
          <span className="absolute top-2 bottom-2 left-[11px] w-px bg-line-dark" aria-hidden />
          <motion.span
            className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-gold"
            style={{ scaleY: scrollYProgress }}
            aria-hidden
          />
          {process.map((p, i) => (
            <Reveal as="li" key={p.no} delay={i * 0.05} className="relative pb-16 pl-14 last:pb-0">
              <span className="absolute top-1.5 left-0 grid h-[23px] w-[23px] place-items-center rounded-full border border-gold bg-emerald-2" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <p className="label text-gold">Step {p.no}</p>
              <h3 className="display mt-3 text-[clamp(2rem,3.4vw,3rem)]">{p.title}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">{p.line}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
