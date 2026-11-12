import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";

// Internal 1200×630 card used to export app/opengraph-image.png (see README). Not linked anywhere.
export const metadata: Metadata = { title: "Share card", robots: { index: false, follow: false } };

export default function OgCard() {
  return (
    <div className="grain relative flex h-[630px] w-[1200px] overflow-hidden bg-onyx text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_75%_20%,rgb(206_184_136/0.16)_0%,transparent_60%),radial-gradient(120%_100%_at_50%_0%,#2d2926_0%,#222223_100%)]" />
      <div className="relative z-10 flex w-[640px] flex-col justify-between p-16">
        <p className="flex items-baseline gap-3">
          <span className="display text-5xl leading-none">{site.brand}</span>
          <span className="label text-champagne">Studio</span>
        </p>
        <h1 className="display text-8xl">
          We shoot jewellery that <em className="text-champagne">sells.</em>
        </h1>
        <p className="text-xl text-greige">Photography · Reels · Social · Ads · Websites</p>
      </div>
      <div className="relative z-10 flex-1">
        <Image src="/renders/camera-poster.png" alt="" fill sizes="560px" className="object-contain p-6" priority />
      </div>
    </div>
  );
}
