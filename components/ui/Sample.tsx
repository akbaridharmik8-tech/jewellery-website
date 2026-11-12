import { site } from "@/lib/site";

const TITLE = "Sample figure. Replace with a real result before launch.";

/** Small dashed tag beside an invented number or quote (landing-page-design B8). */
export function SampleTag({ dark = false }: { dark?: boolean }) {
  if (!site.sampleContent) return null;
  return (
    <span
      title={TITLE}
      className={`inline-flex shrink-0 items-center rounded-full border border-dashed px-2 py-0.5 align-middle text-xs font-semibold ${
        dark ? "border-ivory/40 text-ivory/70" : "border-ink/30 text-taupe"
      }`}
    >
      Sample
    </span>
  );
}

/** One line under a block of sample figures. */
export function SampleNote({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  if (!site.sampleContent) return null;
  return (
    <p className={`mt-6 flex items-center gap-2 text-xs ${dark ? "text-greige" : "text-taupe"}`}>
      <SampleTag dark={dark} />
      {children}
    </p>
  );
}
