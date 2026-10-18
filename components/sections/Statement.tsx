"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { site } from "@/lib/site";
import { SectionLabel } from "@/components/ui/Reveal";

const TEXT =
  "Jewellery is the hardest thing to photograph. Metal mirrors everything, stones hide their colour, and a phone camera flattens all of it. So we built a studio that does only this, so what your customer sees on a screen is what they fall for in the store.";
const ACCENT = new Set(["hardest", "only", "fall"]);

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 2 / total], [0.16, 1]);
  const bare = word.replace(/[^a-z]/gi, "").toLowerCase();
  return (
    <motion.span style={{ opacity }} className={ACCENT.has(bare) ? "text-gold-ink italic" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");
  return (
    <section data-header="light" className="bg-ivory py-[clamp(96px,14vw,200px)]">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel no="01">The studio</SectionLabel>
          <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-stone">
            {site.brand} has photographed jewellery for {new Date().getFullYear() - site.since} years: bridal houses, diamond brands and family jewellers.
          </p>
        </div>
        <p ref={ref} className="display text-[clamp(2rem,4.4vw,4.4rem)] leading-[1.08] md:col-span-9">
          {words.map((w, i) => (
            <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
