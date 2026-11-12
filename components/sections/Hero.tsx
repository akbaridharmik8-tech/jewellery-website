"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { EASE_LUXE, MaskLines } from "@/components/ui/Reveal";
import PendantRing from "./hero/PendantRing";
import WorkViewer from "./WorkViewer";

/**
 * Light "atelier" hero: headline on the left, a real pendant photo hanging in a
 * slowly turning ring of work in the centre, the pitch and one CTA on the right.
 * Any photo in the ring opens the work viewer.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Scrolling away adds a quarter turn to the ring and lifts the copy a little.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const scrollTurn = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);

  return (
    <section ref={section} id="top" data-header="light" className="paper relative overflow-hidden bg-ivory text-ink">
      <div className="container-x relative grid min-h-svh items-center gap-8 pt-24 pb-12 lg:grid-cols-12 lg:gap-6 lg:pt-24 lg:pb-16">
        {/* Headline */}
        <motion.div className="relative z-10 lg:col-span-4" style={{ y: copyY }}>
          <motion.p
            className="label text-taupe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {site.descriptor} · {site.city}
          </motion.p>
          <h1 className="display mt-6 text-[clamp(3.2rem,7vw,7rem)]">
            <MaskLines
              animateOnMount
              delay={0.3}
              lines={[
                "We shoot",
                "jewellery",
                <>
                  that <em className="text-taupe">sells.</em>
                </>,
              ]}
            />
          </h1>
        </motion.div>

        {/* Pendant + ring of work */}
        <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[440px] lg:col-span-5 lg:max-w-none">
          <PendantRing scrollTurn={scrollTurn} reduced={reduced} onOpen={setViewer} />
        </div>

        {/* Pitch + CTA */}
        <motion.div
          className="relative z-10 lg:col-span-3 lg:self-end lg:pb-[12svh]"
          style={{ y: copyY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_LUXE, delay: 1 }}
        >
          <p className="hidden max-w-xs text-base text-taupe sm:block">
            Photography, reels, social and performance ads for jewellery brands. Built to make metal glow, stones sparkle and products sell.
          </p>
          <button
            type="button"
            onClick={() => setViewer(0)}
            className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 sm:mt-6 text-base font-semibold text-ivory transition-[background-color,transform] hover:bg-onyx active:scale-[0.98]"
          >
            See our work
          </button>
          <p className="mt-4 text-xs text-taupe">Tap any photo in the ring to open it.</p>
        </motion.div>
      </div>

      <WorkViewer index={viewer} onIndex={setViewer} onClose={() => setViewer(null)} />
    </section>
  );
}
