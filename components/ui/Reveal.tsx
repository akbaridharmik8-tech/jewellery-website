"use client";

import { motion } from "motion/react";

export const EASE_LUXE = [0.16, 1, 0.3, 1] as const;

/** Fade + rise on first view. Transform/opacity only. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE_LUXE, delay }}
    >
      {children}
    </M>
  );
}

/**
 * Headline whose lines slide up from behind a mask, one after another.
 * The in-view trigger sits on the wrapper: the masked lines themselves are
 * clipped, so they would never count as "in view".
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  animateOnMount = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  animateOnMount?: boolean;
}) {
  const line = {
    hidden: { y: "110%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease: EASE_LUXE, delay: delay + i * 0.09 } }),
  };
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial="hidden"
      {...(animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } })}
    >
      {lines.map((l, i) => (
        <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <motion.span className={`block ${lineClassName ?? ""}`} variants={line} custom={i}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Small uppercase label with a hairline rule, used to open each section. */
export function SectionLabel({ no, children, dark = false }: { no: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`label flex items-center gap-4 ${dark ? "text-gold" : "text-gold-ink"}`}>
      <span>{no}</span>
      <span className={`h-px w-10 ${dark ? "bg-gold/50" : "bg-gold-ink/40"}`} />
      <span>{children}</span>
    </div>
  );
}
