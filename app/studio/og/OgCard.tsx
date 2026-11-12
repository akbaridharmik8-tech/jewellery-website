"use client";

import { useMotionValue } from "motion/react";
import PendantRing from "@/components/sections/hero/PendantRing";
import { site } from "@/lib/site";

/** 1200×630 share card: the hero's pendant and ring, held still. */
export default function OgCard() {
  const still = useMotionValue(0);
  return (
    <div className="paper relative flex h-[630px] w-[1200px] items-center overflow-hidden bg-ivory text-ink">
      <div className="relative z-10 flex h-full w-[600px] flex-col justify-between p-16">
        <p className="flex items-baseline gap-3">
          <span className="display text-5xl leading-none">{site.brand}</span>
          <span className="label text-taupe">Studio</span>
        </p>
        <h1 className="display text-8xl">
          We shoot jewellery that <em className="text-taupe">sells.</em>
        </h1>
        <p className="text-xl text-taupe">Photography · Reels · Social · Ads · Websites</p>
      </div>
      <div className="relative w-[540px] translate-y-6">
        <PendantRing scrollTurn={still} reduced onOpen={() => {}} />
      </div>
    </div>
  );
}
