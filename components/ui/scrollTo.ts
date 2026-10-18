import type Lenis from "lenis";

/** Smooth-scroll to a y position (or element) through Lenis when present. */
export function scrollToY(lenis: Lenis | undefined, y: number, duration = 2) {
  if (lenis) lenis.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }
}
