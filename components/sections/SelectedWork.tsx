"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { works, workStill, isRender, type Work } from "@/lib/site";
import WorkImage from "@/components/ui/WorkImage";
import { MaskLines, SectionLabel } from "@/components/ui/Reveal";
import { useMedia } from "@/components/ui/useMedia";

/** Card with a pointer-driven 3D tilt and a parallax layer for the piece. */
function WorkCard({ w, i }: { w: Work; i: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const px = useTransform(sry, [-8, 8], [-14, 14]);
  const py = useTransform(srx, [-8, 8], [14, -14]);
  const src = workStill(w);
  const light = w.tone === "#e9e1d3" || w.tone === "#ece8e2";

  return (
    <article className="w-(--card-w) shrink-0 snap-start">
      <div style={{ perspective: 900 }}>
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-[2px]"
          style={{ rotateX: srx, rotateY: sry, backgroundColor: w.tone, transformStyle: "preserve-3d" }}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
        >
          <motion.div className="absolute inset-0" style={{ x: px, y: py, scale: 1.06 }}>
            <WorkImage src={src} fallback={w.fallback} alt={`${w.title} for ${w.client}`} sizes="(min-width: 900px) 31vw, 78vw" containPadding="p-[10%]" />
          </motion.div>
          <span className={`label absolute top-5 left-5 rounded-full px-2.5 py-1 ${light || !isRender(src) ? "bg-ivory/85 text-gold-ink" : "text-gold"}`}>
            {String(i + 1).padStart(2, "0")} · {w.service}
          </span>
        </motion.div>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h3 className="display text-[2rem]">{w.title}</h3>
          <p className="mt-1 text-sm text-stone">
            {w.client} · {w.year}
          </p>
          {w.credit && <p className="mt-1 text-[11px] text-stone/80">Placeholder photo · {w.credit}</p>}
        </div>
        <p className="text-[13px] leading-snug font-semibold text-gold-ink sm:mt-2 sm:max-w-[11rem] sm:text-right">{w.result}</p>
      </div>
    </article>
  );
}

export default function SelectedWork() {
  const desktop = useMedia("(min-width: 900px)");
  const outer = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => setDist(rail.current ? Math.max(0, rail.current.scrollWidth - window.innerWidth) : 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (rail.current) ro.observe(rail.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  const heading = (
    <div className="container-x grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <SectionLabel no="03">Selected work</SectionLabel>
        <h2 className="display mt-6 text-[clamp(2.6rem,6vw,6rem)]">
          <MaskLines lines={["Work that moved", "the needle."]} />
        </h2>
      </div>
      <p className="text-[15px] leading-relaxed text-stone md:col-span-3 md:col-start-10">
        A few recent projects. Every frame was planned around one thing: getting the piece into a customer&rsquo;s cart.
      </p>
    </div>
  );

  const cards = works.map((w, i) => <WorkCard key={w.slug} w={w} i={i} />);

  // One element owns the ref in both layouts so the scroll target is always hydrated.
  return (
    <section
      id="work"
      ref={outer}
      data-header="light"
      className={`relative bg-ivory ${desktop ? "" : "py-24"}`}
      style={desktop ? { height: `calc(100svh + ${dist}px)` } : undefined}
    >
      {desktop ? (
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-10 overflow-hidden pt-20 pb-8">
          {heading}
          <motion.div ref={rail} style={{ x }} className="flex w-max gap-8 px-[clamp(16px,4vw,56px)] [--card-w:min(31vw,calc((100svh_-_440px)*0.8))]">
            {cards}
          </motion.div>
        </div>
      ) : (
        <>
          {heading}
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [--card-w:78vw] [scrollbar-width:none] sm:[--card-w:56vw]">{cards}</div>
        </>
      )}
    </section>
  );
}
