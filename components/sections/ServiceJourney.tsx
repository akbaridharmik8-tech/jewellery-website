"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/site";
import { SectionLabel } from "@/components/ui/Reveal";
import { scrollToY } from "@/components/ui/scrollTo";
import { useMedia } from "@/components/ui/useMedia";
import { Mockup } from "./journey/Mockups";

/*
  Scroll-driven 3D journey through the services, like a camera flying forward:
  each service's work floats in depth on one side, its name and pitch on the
  other. `s` is the continuous stop position: s = i means stop i is in focus.
*/

const N = services.length;
const START = -0.55; // the first stop flies in from the distance
const END = N - 1 + 0.45;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function useStop(s: MotionValue<number>, i: number, desktop: boolean) {
  const side = desktop ? (i % 2 ? -1 : 1) : 0; // +1: work on the right, text on the left
  const cluster = useTransform(s, (v) => {
    const t = v - i;
    const z = t < 0 ? t * 1700 : t * 1300;
    const x = side * (desktop ? 23 : 0);
    const y = desktop ? 0 : 14;
    const ry = side * -10 * (1 - Math.min(1, Math.abs(t)));
    return `translate3d(${x}vw, ${y}svh, ${z}px) rotateY(${ry - side * 4}deg) rotateX(${t * -6}deg)`;
  });
  const clusterOpacity = useTransform(s, (v) => {
    const t = v - i;
    if (t < 0) return clamp01((t + 0.95) / 0.5);
    return 1 - clamp01((t - 0.3) / 0.35);
  });
  const textOpacity = useTransform(s, (v) => 1 - clamp01((Math.abs(v - i) - 0.14) / 0.24));
  const textY = useTransform(s, (v) => `${(v - i) * -70}px`);
  return { side, cluster, clusterOpacity, textOpacity, textY };
}

function Stop({ i, s, desktop, active }: { i: number; s: MotionValue<number>; desktop: boolean; active: boolean }) {
  const svc = services[i];
  const { side, cluster, clusterOpacity, textOpacity, textY } = useStop(s, i, desktop);
  return (
    <>
      {/* Work, in depth */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 h-0 w-0 text-[clamp(7px,0.82vw,13px)] [transform-style:preserve-3d] max-md:text-[clamp(6px,1.9vw,9px)]"
        style={{ transform: cluster, opacity: clusterOpacity }}
        aria-hidden
      >
        <Mockup layout={svc.layout} shots={svc.shots} />
      </motion.div>

      {/* Name + pitch */}
      <motion.article
        className={`absolute z-10 w-[min(30rem,86vw)] text-ivory ${
          desktop
            ? `top-1/2 -translate-y-1/2 ${side === 1 ? "left-[clamp(16px,5vw,80px)]" : "right-[clamp(72px,8vw,150px)]"}`
            : "top-24 left-4"
        } ${active ? "" : "pointer-events-none"}`}
        style={{ opacity: textOpacity, y: textY }}
        aria-hidden={!active}
      >
        <p className="label flex items-center gap-3 text-gold">
          <span className="tabular-nums">
            {svc.no} / {String(N).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-gold/50" />
          <span>Service</span>
        </p>
        <h3 className="display mt-4 text-[clamp(2.6rem,5.2vw,5.2rem)]">{svc.title}</h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist max-md:text-[14px]">{svc.line}</p>
        <ul className="mt-5 flex flex-wrap gap-2 max-md:hidden">
          {svc.points.map((p) => (
            <li key={p} className="rounded-full border border-line-dark px-3.5 py-1.5 text-[13px] text-ivory/85">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-gold max-md:mt-4">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path d="M4 16l5-5 4 4 7-8M15 7h5v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {svc.result}
        </p>
      </motion.article>
    </>
  );
}

/** Static two-column version for reduced-motion visitors. */
function StaticJourney() {
  return (
    <div className="container-x space-y-28 py-24">
      {services.map((svc, i) => (
        <div key={svc.no} className="grid items-center gap-10 md:grid-cols-2">
          <div className={i % 2 ? "md:order-2" : ""}>
            <p className="label text-gold">
              {svc.no} / {String(N).padStart(2, "0")}
            </p>
            <h3 className="display mt-4 text-[clamp(2.4rem,5vw,4.6rem)]">{svc.title}</h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist">{svc.line}</p>
            <p className="mt-5 text-[14px] font-semibold text-gold">{svc.result}</p>
          </div>
          <div className="relative h-[28rem] text-[clamp(6px,0.8vw,11px)]" aria-hidden>
            <div className="absolute top-1/2 left-1/2 h-0 w-0">
              <Mockup layout={svc.layout} shots={svc.shots} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ServiceJourney() {
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const desktop = useMedia("(min-width: 900px)", true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const s = useTransform(scrollYProgress, [0, 1], [START, END]);
  // The floor grid streams toward the viewer as you fly forward.
  const floorY = useTransform(s, (v) => `${v * 520}px`);

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useMotionValueEvent(s, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.round(v)))));

  const jumpTo = (i: number) => {
    const el = track.current!;
    const p = (i - START) / (END - START);
    scrollToY(lenis, el.offsetTop + (el.offsetHeight - window.innerHeight) * p, 1.6);
  };

  const intro = (
    <div className="container-x relative z-10 pt-[clamp(96px,12vw,160px)]">
      <SectionLabel no="02" dark>
        Services &amp; work
      </SectionLabel>
      <h2 className="display mt-6 max-w-4xl text-[clamp(2.6rem,6vw,6rem)] text-ivory">
        Everything a jewellery brand needs to be seen.
      </h2>
      <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-mist">
        Scroll through what we do. Each service comes with the kind of work it delivers.
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section id="services" data-header="dark" className="grain relative bg-emerald text-ivory">
        {intro}
        <StaticJourney />
      </section>
    );
  }

  return (
    <section id="services" data-header="dark" className="relative bg-emerald text-ivory">
      {intro}
      <div ref={track} className="relative" style={{ height: `${N * 115 + 60}svh` }}>
        <div className="grain sticky top-0 h-svh overflow-hidden [perspective:1100px] [perspective-origin:50%_42%]">
          {/* Depth: a soft horizon glow and a gold floor grid that streams past */}
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_42%,#1d4a3f_0%,#0c2620_55%,#06130e_100%)]" />
          <div className="pointer-events-none absolute inset-x-[-50%] bottom-[-30%] h-[90%] origin-top [transform:rotateX(72deg)] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black)]">
            <motion.div
              className="absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(207 174 114 / .6) 1px, transparent 1px), linear-gradient(to bottom, rgb(207 174 114 / .6) 1px, transparent 1px)",
                backgroundSize: "120px 120px",
                backgroundPositionY: floorY,
              }}
            />
          </div>

          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {services.map((svc, i) => (
              <Stop key={svc.no} i={i} s={s} desktop={desktop} active={active === i} />
            ))}
          </div>

          {/* Progress rail: also a jump-to menu */}
          <nav
            aria-label="Services"
            className={`absolute z-20 ${desktop ? "top-1/2 right-[clamp(16px,2.5vw,40px)] -translate-y-1/2" : "right-4 bottom-6 left-4"}`}
          >
            <ol className={desktop ? "space-y-1" : "flex justify-between gap-1"}>
              {services.map((svc, i) => (
                <li key={svc.no} className={desktop ? "" : "flex-1"}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={active === i}
                    className={`group flex w-full items-center gap-3 text-left transition-colors ${desktop ? "min-h-8 justify-end" : "min-h-11 flex-col justify-end gap-1.5"} ${
                      active === i ? "text-gold" : "text-ivory/45 hover:text-ivory/80"
                    }`}
                  >
                    {desktop && <span className="text-[12px] font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{svc.title}</span>}
                    <span className="text-[11px] font-semibold tabular-nums">{svc.no}</span>
                    <span className={`block bg-current transition-all ${desktop ? `h-px ${active === i ? "w-10" : "w-5"}` : "h-[2px] w-full"}`} />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
