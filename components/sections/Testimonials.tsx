"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { testimonials } from "@/lib/site";
import { SectionLabel } from "@/components/ui/Reveal";
import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";
import { SampleTag } from "@/components/ui/Sample";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <section data-header="light" className="bg-bone py-[clamp(88px,11vw,160px)]">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel no="06">Clients</SectionLabel>
          <div className="mt-8 flex gap-2" role="group" aria-label="Choose a testimonial">
            {testimonials.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Testimonial ${k + 1}`}
                aria-pressed={k === i}
                className={`grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors ${
                  k === i ? "border-ink bg-ink text-ivory" : "border-ink/25 text-ink/70 hover:border-ink"
                }`}
              >
                {String(k + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <figure className="min-h-[22rem] md:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuotesIcon weight="fill" className="h-10 w-10 text-gold-ink" aria-hidden />
              <blockquote className="display mt-8 text-[clamp(2rem,4vw,3.8rem)] leading-[1.1]">{t.quote}</blockquote>
              <figcaption className="mt-10 flex items-center gap-4 text-sm">
                <span className="h-px w-10 bg-ink/40" />
                <span>
                  <strong className="font-semibold">{t.name}</strong>
                  <span className="text-stone">, {t.detail}</span>
                </span>
                <SampleTag />
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>
      </div>
    </section>
  );
}
