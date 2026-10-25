"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { works, workStill } from "@/lib/site";
import WorkImage from "@/components/ui/WorkImage";
import { EASE_LUXE } from "@/components/ui/Reveal";

const SLIDE_MS = 5500;

/**
 * The DSLR's rear screen, blown up to full-bleed: a playback view of the work.
 * Camera chrome (counter, exposure data, thirds grid, focus brackets) keeps the
 * metaphor, while the work itself stays the hero.
 */
export default function WorkDisplay({ open, onBack }: { open: boolean; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const work = works[index];

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + works.length) % works.length), []);

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Start from the first frame each time the display opens: it matches the LCD.
  useEffect(() => {
    if (!open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open || paused || reduced) return;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [open, paused, reduced, index, go]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our work"
      aria-hidden={!open}
      inert={!open}
      className="absolute inset-0 overflow-hidden text-ivory transition-colors duration-700"
      style={{ backgroundColor: work.tone }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Media */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={work.slug}
          className="absolute inset-0 flex items-center justify-center pb-[36svh] md:pb-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.1, ease: EASE_LUXE }}
        >
          {work.media.type === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={work.media.src}
              poster={work.media.poster}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <WorkImage
              src={work.media.src}
              fallback={work.fallback}
              alt={`${work.title} for ${work.client}`}
              sizes="100vw"
              eager
              containClassName="aspect-square w-[min(86vw,42svh)] md:w-[86svh] md:max-w-[86vw]"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Warm the next slide's image so transitions never land on an empty frame */}
      <link rel="preload" as="image" href={workStill(works[(index + 1) % works.length])} />

      {/* Vignette keeps the overlay text legible on any image */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* Thirds grid + focus brackets */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {[33.333, 66.666].map((v) => (
          <span key={`v${v}`} className="absolute top-0 bottom-0 w-px bg-ivory/10" style={{ left: `${v}%` }} />
        ))}
        {[33.333, 66.666].map((v) => (
          <span key={`h${v}`} className="absolute left-0 right-0 h-px bg-ivory/10" style={{ top: `${v}%` }} />
        ))}
        <motion.div
          key={`af-${work.slug}`}
          className="absolute left-1/2 top-1/2 h-28 w-40 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE_LUXE }}
        >
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
            <span key={c} className={`absolute h-4 w-4 border-gold ${c}`} />
          ))}
        </motion.div>
      </div>

      {/* Top chrome */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-4 pt-20 text-[11px] tracking-[0.18em] uppercase md:px-10 md:pt-24">
        <button
          type="button"
          onClick={onBack}
          className="group flex min-h-11 items-center gap-2 rounded-full border border-ivory/25 bg-black/20 px-4 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden>
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to camera
        </button>
        <div className="flex items-center gap-4 font-medium tabular-nums">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 10 10" className="h-2 w-2" aria-hidden><path d="M1 0l9 5-9 5z" fill="currentColor" /></svg>
            Playback
          </span>
          <span aria-live={paused ? "polite" : "off"}>
            {String(index + 1).padStart(2, "0")}/{String(works.length).padStart(2, "0")}
          </span>
          <span className="hidden items-center gap-1 sm:flex" aria-hidden>
            <span className="relative inline-block h-2.5 w-5 rounded-[2px] border border-ivory/70">
              <span className="absolute inset-[1.5px] right-[5px] rounded-[1px] bg-ivory/80" />
            </span>
          </span>
        </div>
      </div>

      {/* Caption + controls */}
      <div
        className="absolute inset-x-0 bottom-0 px-4 pb-6 md:px-10 md:pb-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={work.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE_LUXE }}
              className="max-w-xl"
            >
              <p className="label text-gold">{work.service}</p>
              <h2 className="display mt-3 text-[clamp(2.4rem,6vw,5.2rem)]">{work.title}</h2>
              <p className="mt-3 text-sm text-ivory/75">
                {work.client} · {work.year}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[13px] font-semibold text-emerald">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M4 16l5-5 4 4 7-8M15 7h5v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {work.result}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="text-[11px] tracking-[0.14em] text-ivory/65 uppercase tabular-nums">{work.exif}</p>
            {work.credit && <p className="-mt-2 text-[11px] text-ivory/50">Placeholder photo · {work.credit}</p>}
            <div className="flex gap-2">
              {[
                { dir: -1, label: "Previous project", d: "M15 6l-6 6 6 6" },
                { dir: 1, label: "Next project", d: "M9 6l6 6-6 6" },
              ].map((b) => (
                <button
                  key={b.dir}
                  type="button"
                  onClick={() => go(b.dir)}
                  aria-label={b.label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ivory/30 transition-colors hover:border-gold hover:bg-gold hover:text-emerald"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                    <path d={b.d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Segmented progress, also a jump-to control. On large screens each segment gets a thumbnail. */}
        <div className="mt-6 flex gap-1.5 lg:gap-2.5" role="group" aria-label="Choose a project">
          {works.map((w, i) => (
            <button
              key={w.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${w.title}`}
              aria-current={i === index}
              className="group relative h-6 flex-1 lg:h-auto lg:w-14 lg:flex-none"
            >
              <span
                className={`relative mb-2 hidden aspect-square w-14 overflow-hidden rounded-[2px] transition-[opacity,box-shadow] duration-300 lg:block ${
                  i === index ? "opacity-100 ring-1 ring-gold" : "opacity-45 group-hover:opacity-80"
                }`}
                style={{ backgroundColor: w.tone }}
              >
                <WorkImage src={workStill(w)} fallback={w.fallback} alt="" sizes="56px" containPadding="p-1" />
              </span>
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-ivory/20 lg:static lg:block lg:translate-y-0">
                <span
                  key={i === index ? `run-${index}` : `idle-${i}`}
                  className="block h-full origin-left bg-gold"
                  style={
                    i === index && open && !reduced
                      ? { animation: `seg ${SLIDE_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }
                      : { transform: `scaleX(${i <= index ? 1 : 0})` }
                  }
                />
              </span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes seg { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </section>
  );
}
