"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { CaretLeftIcon, CaretRightIcon, TrendUpIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";
import { works, workStill } from "@/lib/site";
import { EASE_LUXE } from "@/components/ui/Reveal";
import { SampleTag } from "@/components/ui/Sample";

/**
 * Full-screen viewer for the portfolio, opened from the hero's photo ring.
 * Arrows, keyboard, swipe and thumbnails; Esc closes and focus returns to the opener.
 */
export default function WorkViewer({ index, onIndex, onClose }: { index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const open = index !== null;
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const go = useCallback((dir: number) => index !== null && onIndex((index + dir + works.length) % works.length), [index, onIndex]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      opener.current?.focus();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const work = index !== null ? works[index] : null;

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Our work"
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 text-ivory backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_LUXE }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="label text-champagne tabular-nums" aria-live="polite">
              {String(index! + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-champagne hover:bg-champagne hover:text-onyx"
            >
              <XIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {/* Photo */}
          <div className="relative min-h-0 flex-1 px-4 md:px-24">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={work.slug}
                className="absolute inset-0 mx-4 md:mx-24"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_LUXE }}
              >
                {loaded !== work.slug && <div className="absolute inset-[8%] animate-pulse rounded-2xl bg-ivory/[0.06]" aria-hidden />}
                {work.media.type === "video" ? (
                  <video className="h-full w-full object-contain" src={work.media.src} poster={work.media.poster} autoPlay muted loop playsInline onLoadedData={() => setLoaded(work.slug)} />
                ) : (
                  <Image src={work.media.src} alt={work.alt} fill sizes="90vw" className="object-contain" priority onLoad={() => setLoaded(work.slug)} />
                )}
              </motion.div>
            </AnimatePresence>
            {[
              { dir: -1, label: "Previous project", Icon: CaretLeftIcon, side: "left-2 md:left-6" },
              { dir: 1, label: "Next project", Icon: CaretRightIcon, side: "right-2 md:right-6" },
            ].map(({ dir, label, Icon, side }) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(dir)}
                aria-label={label}
                className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 bg-ink/60 backdrop-blur-sm transition-colors hover:border-champagne hover:bg-champagne hover:text-onyx ${side}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </button>
            ))}
          </div>

          {/* Caption + thumbnails */}
          <div className="px-4 pt-6 pb-6 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label text-champagne">{work.service}</p>
                <h2 className="display mt-2 text-[clamp(2rem,4vw,3.6rem)]">{work.title}</h2>
                <p className="mt-2 text-sm text-greige">
                  {work.client} · {work.year}
                  {work.credit && <span className="text-greige/70"> · Placeholder photo · {work.credit}</span>}
                </p>
              </div>
              <p className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-champagne px-4 py-2 text-xs font-semibold text-onyx">
                  <TrendUpIcon weight="bold" className="h-4 w-4" aria-hidden />
                  {work.result}
                </span>
                <SampleTag dark />
              </p>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Choose a project">
              {works.map((w, i) => (
                <button
                  key={w.slug}
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`Show ${w.title}`}
                  aria-current={i === index}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-opacity duration-300 ${
                    i === index ? "opacity-100 ring-2 ring-champagne" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image src={workStill(w)} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
