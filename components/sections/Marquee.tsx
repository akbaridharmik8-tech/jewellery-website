import { services } from "@/lib/site";

const Gem = () => (
  <svg viewBox="0 0 24 24" className="mx-8 h-4 w-4 shrink-0 text-gold/70" aria-hidden>
    <path d="M6 4h12l4 5-10 11L2 9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export default function Marquee() {
  const items = services.map((s) => s.title);
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="display text-[clamp(1.6rem,3vw,2.6rem)] whitespace-nowrap italic">{t}</span>
          <Gem />
        </span>
      ))}
    </div>
  );
  return (
    <div data-header="dark" className="overflow-hidden border-y border-line-dark bg-emerald-2 py-6 text-gold" aria-label="Services">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        <div aria-hidden className="flex">{row}</div>
      </div>
    </div>
  );
}
