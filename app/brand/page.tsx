import type { Metadata } from "next";
import PageBar from "@/components/legal/PageBar";
import CopyHex from "@/components/brand/CopyHex";
import { hexToRgb, palette, pairs } from "@/lib/brand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Brand colours | ${site.brand} Studio`,
  description: "The Verdane Studio palette: Pantone references, screen values, roles and contrast.",
  robots: { index: false, follow: true },
};

// Light swatches take dark text; dark swatches take light text.
const isDark = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
};

const SHARE = [
  { label: "Ivory & cream", pct: 60, hex: "#F2F0EB" },
  { label: "Ink & onyx (type, buttons)", pct: 30, hex: "#2D2926" },
  { label: "Champagne", pct: 10, hex: "#CEB888" },
];

export default function Brand() {
  return (
    <div className="min-h-svh bg-ivory text-ink">
      <PageBar />
      <main id="main" className="container-x py-16 md:py-24">
        <p className="label text-taupe">Brand guidelines</p>
        <h1 className="display mt-4 max-w-3xl text-[clamp(2.8rem,7vw,5.5rem)]">Ivory, champagne and black.</h1>
        <p className="mt-6 max-w-2xl text-base text-taupe">
          A quiet, warm neutral palette with one metallic accent, the way fine jewellery is shown in a vitrine. Every colour is matched to a Pantone reference.
          For print and packaging, specify the Pantone code; HEX and RGB values are screen approximations and should be checked against a physical Pantone guide.
        </p>

        {/* Proportion */}
        <section className="mt-16" aria-labelledby="share">
          <h2 id="share" className="text-xl font-semibold">Proportion</h2>
          <p className="mt-2 text-sm text-taupe">The 60 · 30 · 10 rule keeps champagne precious: if it is everywhere, it stops meaning anything.</p>
          <div className="mt-6 flex h-20 overflow-hidden rounded-2xl border border-line-light">
            {SHARE.map((s) => (
              <div key={s.label} className="flex items-end p-3" style={{ width: `${s.pct}%`, backgroundColor: s.hex, color: isDark(s.hex) ? "#F2F0EB" : "#222223" }}>
                <span className="hidden text-xs font-semibold sm:inline">
                  {s.label} · {s.pct}%
                </span>
              </div>
            ))}
          </div>
          {/* On narrow screens the 10% segment is too small for a label, so list them below */}
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-taupe sm:hidden">
            {SHARE.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border border-line-light" style={{ backgroundColor: s.hex }} aria-hidden />
                {s.label} · {s.pct}%
              </li>
            ))}
          </ul>
        </section>

        {/* Swatches */}
        <section className="mt-16" aria-labelledby="colours">
          <h2 id="colours" className="text-xl font-semibold">Colours</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {palette.map((c) => {
              const dark = isDark(c.hex);
              return (
                <li key={c.token} className="overflow-hidden rounded-2xl border border-line-light bg-ivory">
                  <div className="flex h-40 flex-col justify-between p-4" style={{ backgroundColor: c.hex, color: dark ? "#F2F0EB" : "#222223" }}>
                    <span className="text-xs font-semibold tracking-[0.16em] uppercase">{c.group}</span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="display text-3xl">{c.name}</span>
                      <CopyHex value={c.hex} dark={dark} />
                    </div>
                  </div>
                  <dl className="grid gap-2 p-4 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-taupe">Pantone</dt>
                      <dd className="font-semibold">{c.pantone}</dd>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <dt className="text-xs font-medium text-taupe">HEX</dt>
                        <dd className="tabular-nums">{c.hex}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-taupe">RGB</dt>
                        <dd className="tabular-nums">{hexToRgb(c.hex).join(", ")}</dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-taupe">Use</dt>
                      <dd className="text-taupe">{c.role}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contrast */}
        <section className="mt-16" aria-labelledby="contrast">
          <h2 id="contrast" className="text-xl font-semibold">Text contrast</h2>
          <p className="mt-2 text-sm text-taupe">Only these pairings are used for text. All meet WCAG AA (4.5:1) or better.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pairs.map(({ fg, bg, ratio }) => (
              <li key={fg.token + bg.token} className="flex items-center gap-4 rounded-2xl border border-line-light p-3">
                <span className="display grid h-14 w-14 shrink-0 place-items-center rounded-lg text-2xl" style={{ backgroundColor: bg.hex, color: fg.hex }}>
                  Aa
                </span>
                <span className="text-sm">
                  <b className="block font-semibold">
                    {fg.name} on {bg.name}
                  </b>
                  <span className="text-taupe tabular-nums">
                    {ratio.toFixed(2)} : 1 · {ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "Large text only"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Type */}
        <section className="mt-16" aria-labelledby="type">
          <h2 id="type" className="text-xl font-semibold">Typefaces</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-onyx p-6 text-ivory">
              <p className="text-xs font-semibold tracking-[0.16em] text-champagne uppercase">Display · Instrument Serif</p>
              <p className="display mt-4 text-6xl">
                We shoot jewellery that <em className="text-champagne">sells.</em>
              </p>
              <p className="mt-4 text-sm text-greige">Headlines, large numbers and quotes. One italic accent word per headline, in champagne.</p>
            </div>
            <div className="rounded-2xl border border-line-light p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-taupe uppercase">Text · Manrope</p>
              <p className="mt-4 text-2xl font-semibold">Product photography, reels and ads for jewellery brands.</p>
              <p className="mt-4 text-base text-taupe">Body copy, buttons, labels and interface text, on the Tailwind type scale.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
