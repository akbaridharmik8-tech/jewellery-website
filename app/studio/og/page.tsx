import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";

// Internal 1200×630 card used to export app/opengraph-image.png (see README). Not linked anywhere.
export const metadata: Metadata = { title: "Share card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="grain relative flex h-[630px] w-[1200px] overflow-hidden bg-emerald text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_75%_20%,#1d4a3f_0%,#0c2620_60%,#07170f_100%)]" />
      <div className="relative z-10 flex w-[640px] flex-col justify-between p-16">
        <p className="flex items-baseline gap-3">
          <span className="display text-5xl leading-none">{site.brand}</span>
          <span className="label text-gold">Studio</span>
        </p>
        <h1 className="display text-8xl">
          We shoot jewellery that <em className="text-gold">sells.</em>
        </h1>
        <p className="text-xl text-mist">Photography · Reels · 3D · Ads · Websites</p>
      </div>
      <div className="relative z-10 flex-1">
        <Image src="/renders/camera-poster.png" alt="" fill sizes="560px" className="object-contain p-6" priority />
      </div>
    </div>
  );
}
