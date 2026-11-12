"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { heroPendant, works, workStill, type Work } from "@/lib/site";
import { EASE_LUXE } from "@/components/ui/Reveal";

const COUNT = 8;
const DEG_PER_MS = 360 / 90000; // one full turn every 90 seconds
const RADIUS = 39; // % of the ring box, from centre to tile centre
const TILE = 21; // % of the ring box

/*
  The centrepiece: a real pendant photo in a round champagne frame, hanging on a
  drawn chain, with the work photos turning around it. Each tile's frame faces
  the centre (square at the top, bottom and sides, diamond on the diagonals)
  while the photo inside always stays upright.
*/

function Tile({ work, index, ring, onOpen, onHover, reduced }: { work: Work; index: number; ring: MotionValue<number>; onOpen: (i: number) => void; onHover: (on: boolean) => void; reduced: boolean }) {
  const base = (index / COUNT) * 360; // 0° = top
  const rad = ((base - 90) * Math.PI) / 180;
  const x = 50 + RADIUS * Math.cos(rad);
  const y = 50 + RADIUS * Math.sin(rad);
  // Undo the ring's turn and the tile's own tilt so the photo stays upright.
  const upright = useTransform(ring, (r) => -(r + base));

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`Open ${work.title}`}
      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[24%] focus-visible:outline-offset-4"
      style={{ left: `${x}%`, top: `${y}%`, width: `${TILE}%`, height: `${TILE}%`, rotate: base }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.5 + index * 0.06 }}
    >
      <span className="absolute inset-0 overflow-hidden rounded-[24%] bg-cream shadow-[0_14px_30px_-16px_rgb(34_34_35/0.45)] transition-transform duration-500 group-hover:scale-[1.08] group-focus-visible:scale-[1.08]">
        {/* 142% so the upright photo still covers the frame when the frame is turned 45° */}
        <motion.span className="absolute -inset-[21%] block" style={{ rotate: upright }}>
          <Image src={workStill(work)} alt="" fill sizes="(min-width: 1024px) 140px, 22vw" className="object-cover" />
        </motion.span>
      </span>
    </motion.button>
  );
}

export default function PendantRing({ scrollTurn, reduced, onOpen }: { scrollTurn: MotionValue<number>; reduced: boolean; onOpen: (i: number) => void }) {
  const spin = useMotionValue(0);
  const speed = useRef(1); // eases to 0 while a tile is hovered or focused
  const target = useRef(1);

  useAnimationFrame((_, dt) => {
    if (reduced) return;
    speed.current += (target.current - speed.current) * Math.min(1, dt / 250);
    spin.set(spin.get() + dt * DEG_PER_MS * speed.current);
  });
  const ring = useTransform([spin, scrollTurn], ([a, b]: number[]) => a + b);
  const hover = (on: boolean) => (target.current = on ? 0 : 1);
  const tiles = works.slice(0, COUNT);

  return (
    <div className="relative aspect-square w-full">
      {/* Chain + pendant, swaying very slightly from a point far above */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[33%] top-[-14%] flex flex-col items-center lg:top-[-70svh]"
        style={{ transformOrigin: "50% 0%" }}
        initial={{ y: reduced ? 0 : -40, opacity: 0 }}
        animate={reduced ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, rotate: [0.35, -0.35, 0.35] }}
        transition={{
          y: { duration: 1.2, ease: EASE_LUXE },
          opacity: { duration: 0.8 },
          rotate: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
      >
        {/* A beaded chain: round-capped dots along two lines meeting at the bail.
            (non-scaling-stroke keeps the beads round on this stretched SVG) */}
        <svg className="w-[30%] flex-1" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {["M2 0 L50 100", "M98 0 L50 100"].map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="var(--color-champagne-deep)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="0.01 4.6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {/* Bail */}
        <span className="-mb-1 h-[3.5%] w-[3%] rounded-full border-2 border-champagne-deep" aria-hidden />
        {/* Medallion: a real photo in a double champagne frame */}
        <div className="relative aspect-square w-[34%] rounded-full bg-gradient-to-b from-champagne to-champagne-deep p-[2.2%] shadow-[0_24px_50px_-20px_rgb(34_34_35/0.55)]">
          <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-ivory/70">
            <Image src={heroPendant.src} alt={heroPendant.alt} fill priority sizes="(min-width: 1024px) 200px, 34vw" className="object-cover" />
          </div>
        </div>
      </motion.div>

      {/* The turning ring of work */}
      <motion.div className="absolute inset-0" style={{ rotate: ring }}>
        {tiles.map((w, i) => (
          <Tile key={w.slug} work={w} index={i} ring={ring} onOpen={onOpen} onHover={hover} reduced={reduced} />
        ))}
      </motion.div>
    </div>
  );
}
