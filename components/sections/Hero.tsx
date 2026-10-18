"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { isRender, site, works, workStill } from "@/lib/site";
import { MaskLines, EASE_LUXE } from "@/components/ui/Reveal";
import { scrollToY } from "@/components/ui/scrollTo";
import { useWebGL, WebGLBoundary } from "@/components/ui/webgl";
import WorkDisplay from "./WorkDisplay";

const HeroCameraScene = dynamic(() => import("@/components/three/HeroCameraScene"), { ssr: false });

// Scroll choreography (fraction of the hero track):
// 0.03–0.36 camera turns to show its screen · 0.20–0.60 dolly into the LCD
// 0.58–0.68 display crossfades in · 0.68–1 display holds while you browse the work
const OPEN_AT = 0.8;

export default function Hero() {
  const track = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const webgl = useWebGL();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  const textOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);
  const canvasOpacity = useTransform(scrollYProgress, [0.6, 0.68], [1, 0]);
  const displayOpacity = useTransform(scrollYProgress, [0.58, 0.68], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (p) => setOpen(p > 0.64));

  const trackY = (fraction: number) => {
    const el = track.current!;
    return el.offsetTop + (el.offsetHeight - window.innerHeight) * fraction;
  };
  const openDisplay = () => scrollToY(lenis, trackY(OPEN_AT), 2.4);
  const backToCamera = () => scrollToY(lenis, trackY(0), 2.2);

  const first = works[0];
  const firstSrc = workStill(first);

  return (
    <section ref={track} id="top" data-header="dark" className="relative h-[300svh] bg-emerald">
      <div className="grain sticky top-0 h-svh overflow-hidden">
        {/* Studio backdrop: a soft key light from above and a floor falloff, nothing decorative */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_62%_8%,#1d4a3f_0%,#0c2620_55%,#07170f_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />

        {/* Viewfinder frame */}
        <div className="pointer-events-none absolute inset-3 md:inset-6" aria-hidden>
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-gold/40 md:h-10 md:w-10 ${c}`} />
          ))}
        </div>

        {/* 3D camera */}
        <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
          {(() => {
            const poster = (
              <button type="button" onClick={openDisplay} className="absolute inset-0 cursor-pointer" tabIndex={-1} aria-hidden>
                <Image src="/renders/camera-poster.png" alt="" fill sizes="100vw" className="object-contain object-[75%_45%] p-[12%] md:p-[8%]" priority />
              </button>
            );
            if (webgl === false) return poster;
            if (!webgl) return null;
            return (
              <WebGLBoundary fallback={poster}>
                <HeroCameraScene
                  progress={scrollYProgress}
                  onOpen={openDisplay}
                  screenSrc={firstSrc}
                  screenFallback={first.fallback}
                  screenTone={first.tone}
                  screenFit={isRender(firstSrc) ? "contain" : "cover"}
                />
              </WebGLBoundary>
            );
          })()}
        </motion.div>

        {/* Copy */}
        <motion.div
          className="pointer-events-none absolute inset-0 text-ivory"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="container-x relative h-full">
            <motion.p
              className="label absolute top-24 text-gold md:top-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {site.descriptor} · {site.city} · Since {site.since}
            </motion.p>

            <h1 className="display absolute top-40 text-[clamp(3.1rem,9.5vw,9.5rem)] md:top-auto md:bottom-[15svh]">
              <MaskLines
                animateOnMount
                delay={0.35}
                lines={[
                  "We shoot",
                  "jewellery",
                  <>
                    that <em className="text-gold">sells.</em>
                  </>,
                ]}
              />
            </h1>

            <motion.div
              className="pointer-events-auto absolute right-[clamp(16px,4vw,56px)] bottom-8 left-[clamp(16px,4vw,56px)] flex flex-col gap-5 md:left-auto md:bottom-[15svh] md:w-[22rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: EASE_LUXE }}
            >
              <p className="hidden text-[15px] leading-relaxed text-ivory/75 md:block">
                Photography, reels, 3D and performance ads for jewellery brands. Built to make metal glow, stones sparkle and products sell.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  type="button"
                  onClick={openDisplay}
                  className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-6 text-[15px] font-semibold text-emerald transition-[background-color,transform] duration-300 hover:bg-ivory active:scale-[0.98]"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald text-gold transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 10 10" className="ml-0.5 h-2.5 w-2.5" aria-hidden><path d="M1 0l9 5-9 5z" fill="currentColor" /></svg>
                  </span>
                  See our work
                </button>
                <a href="#contact" className="text-[15px] font-medium underline decoration-gold/60 underline-offset-[6px] transition-colors hover:text-gold">
                  Start a project
                </a>
              </div>
            </motion.div>

            <motion.p
              className="label absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 text-ivory/55 lg:flex"
              style={{ bottom: "6svh" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Drag to rotate · Click or scroll to see the work
            </motion.p>
          </div>
        </motion.div>

        {/* The camera's screen, full-bleed */}
        <motion.div
          className={`absolute inset-0 ${open ? "" : "pointer-events-none"}`}
          style={{ opacity: displayOpacity }}
        >
          <WorkDisplay open={open} onBack={backToCamera} />
        </motion.div>
      </div>
    </section>
  );
}
