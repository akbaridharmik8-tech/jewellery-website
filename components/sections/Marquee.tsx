import { services } from "@/lib/site";
import { DiamondIcon } from "@phosphor-icons/react/dist/ssr";

const Gem = () => (
  <DiamondIcon weight="light" className="mx-8 h-4 w-4 shrink-0 text-champagne/70" aria-hidden />
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
    <div data-header="dark" className="overflow-hidden border-y border-line-dark bg-ink py-6 text-champagne" aria-label="Services">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        <div aria-hidden className="flex">{row}</div>
      </div>
    </div>
  );
}
