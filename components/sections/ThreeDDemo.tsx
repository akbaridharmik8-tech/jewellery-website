"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { metals, stones, waLink, type MetalKey, type StoneKey } from "@/lib/site";
import { MaskLines, Reveal, SectionLabel } from "@/components/ui/Reveal";
import { useWebGL, WebGLBoundary } from "@/components/ui/webgl";

const ConfiguratorScene = dynamic(() => import("@/components/three/ConfiguratorScene"), { ssr: false });

const METAL_SWATCH: Record<MetalKey, string> = {
  yellow: "linear-gradient(135deg,#f6dc9c,#c9973a 55%,#8a5a12)",
  rose: "linear-gradient(135deg,#f6d2c2,#d99a80 55%,#9a5a45)",
  platinum: "linear-gradient(135deg,#ffffff,#c9cdd1 55%,#7d8287)",
};
const STONE_SWATCH: Record<StoneKey, string> = {
  diamond: "linear-gradient(135deg,#ffffff,#d6e2f2 50%,#9fb0c8)",
  emerald: "linear-gradient(135deg,#5fd39d,#1f9a66 50%,#0b5a38)",
  ruby: "linear-gradient(135deg,#ff6a7f,#c3122e 50%,#6e0716)",
  sapphire: "linear-gradient(135deg,#6f8ff0,#2448b8 50%,#0f2366)",
};

function Swatches<K extends string>({
  legend,
  options,
  value,
  onChange,
  swatch,
}: {
  legend: string;
  options: Record<K, { label: string }>;
  value: K;
  onChange: (k: K) => void;
  swatch: Record<K, string>;
}) {
  return (
    <fieldset>
      <legend className="label text-mist">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(options) as K[]).map((k) => (
          <label
            key={k}
            className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
              value === k ? "border-gold bg-gold/10 text-ivory" : "border-line-dark text-ivory/70 hover:border-gold/50"
            }`}
          >
            <input type="radio" name={legend} value={k} checked={value === k} onChange={() => onChange(k)} className="sr-only" />
            <span className="h-7 w-7 rounded-full ring-1 ring-black/20" style={{ background: swatch[k] }} aria-hidden />
            {options[k].label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ThreeDDemo() {
  const [metal, setMetal] = useState<MetalKey>("yellow");
  const [stone, setStone] = useState<StoneKey>("diamond");
  const webgl = useWebGL();
  const still = <Image src="/renders/solitaire-ring.png" alt="3D render of a gold solitaire ring" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain p-[8%]" />;

  return (
    <section id="3d" data-header="dark" className="grain relative overflow-hidden bg-emerald py-[clamp(88px,11vw,160px)] text-ivory">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel no="04" dark>
            3D product viewers
          </SectionLabel>
          <h2 className="display mt-6 text-[clamp(2.6rem,5.4vw,5.4rem)]">
            <MaskLines lines={["Your catalogue,", <em key="e" className="text-gold">in three dimensions.</em>]} />
          </h2>
          <Reveal>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">
              This ring isn&rsquo;t a photo. It&rsquo;s a real-time 3D model we built from references, the same way we&rsquo;d build yours. Drag it, then change the metal and the stone.
            </p>
          </Reveal>
          <Reveal className="mt-10 space-y-8" delay={0.1}>
            <Swatches legend="Metal" options={metals} value={metal} onChange={setMetal} swatch={METAL_SWATCH} />
            <Swatches legend="Centre stone" options={stones} value={stone} onChange={setStone} swatch={STONE_SWATCH} />
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href={waLink("Hi! I'd like 3D product viewers for my jewellery catalogue.")}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-6 text-[15px] font-semibold text-emerald transition-colors hover:bg-ivory"
            >
              Get 3D for your catalogue
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative aspect-square w-full bg-[radial-gradient(60%_55%_at_50%_45%,#1d4a3f_0%,transparent_70%)] md:aspect-[5/4]">
            {webgl === false ? still : webgl && <WebGLBoundary fallback={still}><ConfiguratorScene metal={metal} stone={stone} /></WebGLBoundary>}
            <p className="label pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-mist/80" aria-live="polite">
              {metals[metal].label} · {stones[stone].label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
