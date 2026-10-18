"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";

/** Lenis smooth scrolling + global motion settings. Both step aside for reduced-motion users. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const content = <MotionConfig reducedMotion="user">{children}</MotionConfig>;
  if (!enabled) return content;
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true, anchors: true }}>
      {content}
    </ReactLenis>
  );
}
