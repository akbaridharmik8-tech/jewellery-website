"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { stats } from "@/lib/site";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";

function Count({ to, decimals = 0, suffix }: { to: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = to.toFixed(decimals);
      return;
    }
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = v.toFixed(decimals)) });
    return () => c.stop();
  }, [inView, to, decimals]);
  return (
    <span className="tabular-nums">
      <span ref={ref}>{to.toFixed(decimals)}</span>
      <span className="text-gold-ink">{suffix}</span>
    </span>
  );
}

export default function Results() {
  return (
    <section data-header="light" className="bg-ivory py-[clamp(88px,10vw,150px)]">
      <div className="container-x">
        <SectionLabel no="05">In numbers</SectionLabel>
        <dl className="mt-12 grid grid-cols-2 border-t border-line-light lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className={`flex flex-col-reverse border-b border-line-light py-10 pr-4 lg:border-b-0 ${i % 2 ? "pl-6" : ""} lg:pl-0 ${i ? "lg:border-l lg:pl-8" : ""}`}>
              <dt className="mt-3 text-sm text-stone">{s.label}</dt>
              <dd className="display text-[clamp(3.4rem,7vw,6.5rem)] leading-none">
                <Count to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
