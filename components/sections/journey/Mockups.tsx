import WorkImage from "@/components/ui/WorkImage";
import type { ServiceLayout, Shot } from "@/lib/site";

/*
  Work mockups for each service stop. Sizes are in `em`, so the parent's
  font-size scales the whole composition. Layers use translateZ for depth;
  the parent must have transform-style: preserve-3d.
*/

const Img = ({ shot, sizes, pad }: { shot: Shot; sizes: string; pad?: string }) => (
  <WorkImage src={shot.src} fallback={shot.fallback} alt={shot.label ?? ""} sizes={sizes} containPadding={pad ?? "p-[8%]"} />
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute bottom-[0.9em] left-[0.9em] rounded-full bg-black/55 px-[0.9em] py-[0.35em] text-[0.85em] font-medium text-ivory backdrop-blur-sm">
    {children}
  </span>
);

const card = "absolute overflow-hidden rounded-[0.35em] bg-emerald-3 shadow-[0_2.5em_5em_-1.5em_rgb(0_0_0/0.7)]";

function Gallery({ shots }: { shots: Shot[] }) {
  return (
    <>
      <div className={card} style={{ width: "26em", height: "32em", left: "-13em", top: "-16em" }}>
        <Img shot={shots[0]} sizes="420px" />
        {shots[0].label && <Tag>{shots[0].label}</Tag>}
      </div>
      <div className={card} style={{ width: "15em", height: "19em", left: "8em", top: "-20em", transform: "translateZ(90px) rotateY(-6deg)" }}>
        <Img shot={shots[1]} sizes="260px" />
      </div>
      <div className={card} style={{ width: "14em", height: "14em", left: "-21em", top: "6em", transform: "translateZ(150px) rotateY(8deg)" }}>
        <Img shot={shots[2]} sizes="240px" />
      </div>
    </>
  );
}

function Phone({ children, w = 13, style }: { children: React.ReactNode; w?: number; style?: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-[1.8em] bg-[#0a0a0a] p-[0.45em] shadow-[0_2.5em_5em_-1.5em_rgb(0_0_0/0.8)] ring-1 ring-white/10"
      style={{ width: `${w}em`, height: `${w * 1.95}em`, ...style }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.4em] bg-emerald-3">{children}</div>
    </div>
  );
}

function Reels({ shots }: { shots: Shot[] }) {
  const pos = [
    { left: "-21em", top: "-11em", transform: "translateZ(-60px) rotateY(18deg)" },
    { left: "-6.5em", top: "-14em", transform: "translateZ(60px)" },
    { left: "8em", top: "-11em", transform: "translateZ(-60px) rotateY(-18deg)" },
  ];
  return (
    <>
      {shots.slice(0, 3).map((s, i) => (
        <Phone key={i} style={pos[i]}>
          <Img shot={s} sizes="220px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <span className="absolute top-[0.9em] left-[0.9em] text-[0.8em] font-semibold tracking-wide text-ivory">Reels</span>
          <span className="absolute top-1/2 left-1/2 grid h-[3em] w-[3em] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 backdrop-blur-sm">
            <svg viewBox="0 0 10 10" className="ml-[0.15em] h-[1.1em] w-[1.1em] text-white" aria-hidden><path d="M1 0l9 5-9 5z" fill="currentColor" /></svg>
          </span>
          <span className="absolute bottom-[1em] left-[0.9em] flex items-center gap-[0.4em] text-[0.85em] font-semibold text-ivory">
            <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
            {s.label}
          </span>
        </Phone>
      ))}
    </>
  );
}

function Render({ shots }: { shots: Shot[] }) {
  return (
    <>
      <div className={card} style={{ width: "28em", height: "28em", left: "-14em", top: "-15em", background: "radial-gradient(60% 60% at 50% 45%, #1d4a3f, #0c2620)" }}>
        <Img shot={shots[0]} sizes="440px" pad="p-[10%]" />
        <span className="absolute top-[1em] left-[1em] rounded-full border border-gold/60 px-[0.8em] py-[0.3em] text-[0.75em] font-semibold tracking-[0.15em] text-gold uppercase">
          Live 3D · 360°
        </span>
        <svg viewBox="0 0 120 30" className="absolute bottom-[1.2em] left-1/2 w-[9em] -translate-x-1/2 text-gold/80" aria-hidden>
          <ellipse cx="60" cy="15" rx="56" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
          <path d="M100 6l6 3-6 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <div className={card} style={{ width: "12em", height: "12em", left: "10em", top: "-19em", transform: "translateZ(120px) rotateY(-10deg)", background: "#141414" }}>
        <Img shot={shots[1]} sizes="200px" />
      </div>
      <div className={card} style={{ width: "12em", height: "12em", left: "-23em", top: "4em", transform: "translateZ(160px) rotateY(10deg)", background: "#3a1d22" }}>
        <Img shot={shots[2]} sizes="200px" />
      </div>
    </>
  );
}

function Social({ shots }: { shots: Shot[] }) {
  return (
    <>
      <Phone w={17} style={{ left: "-8.5em", top: "-16.5em" }}>
        <div className="flex h-full flex-col bg-[#101010] text-ivory">
          <div className="flex items-center gap-[0.8em] px-[1em] pt-[1.4em] pb-[0.8em]">
            <span className="grid h-[3.2em] w-[3.2em] shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-[#8a5a12] p-[0.15em]">
              <span className="display grid h-full w-full place-items-center rounded-full bg-emerald text-[1.3em] text-gold">V</span>
            </span>
            <div className="grid flex-1 grid-cols-3 text-center text-[0.75em] leading-tight">
              <span><b className="block text-[1.2em]">412</b>posts</span>
              <span><b className="block text-[1.2em]">48.6k</b>followers</span>
              <span><b className="block text-[1.2em]">180</b>following</span>
            </div>
          </div>
          <p className="px-[1.2em] pb-[0.8em] text-[0.8em] font-semibold">yourbrand.jewels</p>
          <div className="grid grid-cols-3 gap-[0.15em]">
            {shots.slice(0, 9).map((s, i) => (
              <div key={i} className="relative aspect-square bg-emerald-3">
                <Img shot={s} sizes="110px" pad="p-[6%]" />
              </div>
            ))}
          </div>
        </div>
      </Phone>
      <div className="absolute flex items-center gap-[0.6em] rounded-full bg-ivory px-[1em] py-[0.6em] text-[0.95em] font-semibold text-ink shadow-xl" style={{ left: "7em", top: "-12em", transform: "translateZ(140px)" }}>
        <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em] text-garnet" aria-hidden><path d="M12 21s-7.5-4.6-9.6-9.3A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.6 5.7C19.5 16.4 12 21 12 21z" fill="currentColor" /></svg>
        12.4k likes
      </div>
      <div className="absolute flex items-center gap-[0.6em] rounded-full bg-gold px-[1em] py-[0.6em] text-[0.95em] font-semibold text-emerald shadow-xl" style={{ left: "-19em", top: "5em", transform: "translateZ(180px)" }}>
        <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em]" aria-hidden><path d="M16 11a4 4 0 1 0-8 0M3 20c0-3 4-5 9-5s9 2 9 5M19 8v6M16 11h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        +3,280 followers
      </div>
    </>
  );
}

function Ads({ shots }: { shots: Shot[] }) {
  const ad = (s: Shot, style: React.CSSProperties, key: number) => (
    <div key={key} className="absolute overflow-hidden rounded-[0.5em] bg-[#121212] text-ivory shadow-[0_2.5em_5em_-1.5em_rgb(0_0_0/0.8)] ring-1 ring-white/10" style={{ width: "17em", ...style }}>
      <div className="flex items-center gap-[0.6em] px-[0.9em] py-[0.7em]">
        <span className="display grid h-[2em] w-[2em] place-items-center rounded-full bg-emerald text-gold">V</span>
        <span className="text-[0.8em] leading-tight">
          <b className="block">yourbrand.jewels</b>
          <span className="text-ivory/60">Sponsored</span>
        </span>
      </div>
      <div className="relative aspect-square bg-emerald-3">
        <Img shot={s} sizes="280px" />
      </div>
      <div className="flex items-center justify-between bg-[#1c1c1c] px-[0.9em] py-[0.7em] text-[0.8em]">
        <span className="font-semibold">{s.label}</span>
        <span className="rounded-[0.3em] bg-ivory px-[0.7em] py-[0.25em] font-semibold text-ink">Shop now</span>
      </div>
    </div>
  );
  return (
    <>
      {ad(shots[0], { left: "-18em", top: "-15em", transform: "rotateY(10deg)" }, 0)}
      {ad(shots[1], { left: "1em", top: "-11em", transform: "translateZ(80px) rotateY(-8deg)" }, 1)}
      <div className="absolute rounded-[0.5em] bg-ivory px-[1.1em] py-[0.8em] text-ink shadow-xl" style={{ left: "13em", top: "-19em", transform: "translateZ(170px)" }}>
        <p className="text-[0.7em] font-semibold tracking-[0.15em] text-stone uppercase">ROAS</p>
        <p className="display text-[2.2em] leading-none">4.6x</p>
      </div>
      <div className="absolute rounded-[0.5em] bg-gold px-[1.1em] py-[0.8em] text-emerald shadow-xl" style={{ left: "-22em", top: "9em", transform: "translateZ(190px)" }}>
        <p className="text-[0.7em] font-semibold tracking-[0.15em] uppercase">Cost per sale</p>
        <p className="display text-[2.2em] leading-none">-63%</p>
      </div>
    </>
  );
}

function Browser({ shots }: { shots: Shot[] }) {
  return (
    <>
      <div className="absolute overflow-hidden rounded-[0.6em] bg-ivory text-ink shadow-[0_2.5em_5em_-1.5em_rgb(0_0_0/0.8)]" style={{ width: "38em", height: "25em", left: "-21em", top: "-13em" }}>
        <div className="flex items-center gap-[0.4em] bg-bone px-[0.9em] py-[0.6em]">
          {["#e46b5f", "#e5bd4f", "#62c15a"].map((c) => (
            <span key={c} className="h-[0.7em] w-[0.7em] rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-[0.8em] flex-1 rounded-[0.3em] bg-ivory px-[0.8em] py-[0.2em] text-[0.75em] text-stone">yourbrand.com/necklaces/heritage</span>
        </div>
        <div className="grid h-[calc(100%-2.3em)] grid-cols-[1.1fr_1fr]">
          <div className="relative bg-emerald-3">
            <Img shot={shots[0]} sizes="380px" />
          </div>
          <div className="flex flex-col justify-center gap-[0.6em] px-[1.6em]">
            <p className="text-[0.7em] font-semibold tracking-[0.18em] text-gold-ink uppercase">New collection</p>
            <p className="display text-[2em] leading-none">{shots[0].label}</p>
            <p className="text-[0.85em] text-stone">22K gold · Hallmarked</p>
            <p className="text-[1.1em] font-semibold">₹1,48,000</p>
            <span className="mt-[0.4em] w-fit rounded-full bg-ink px-[1.2em] py-[0.5em] text-[0.8em] font-semibold text-ivory">Add to cart</span>
          </div>
        </div>
      </div>
      <Phone w={9.5} style={{ left: "12em", top: "-4em", transform: "translateZ(160px) rotateY(-12deg)" }}>
        <div className="flex h-full flex-col bg-ivory text-ink">
          <div className="relative h-[55%] bg-emerald-3">
            <Img shot={shots[1]} sizes="160px" />
          </div>
          <div className="space-y-[0.35em] p-[0.7em]">
            <p className="display text-[1.05em] leading-none">Crystal Set</p>
            <p className="text-[0.65em] text-stone">₹86,000</p>
            <span className="block rounded-full bg-ink py-[0.35em] text-center text-[0.6em] font-semibold text-ivory">Add to cart</span>
          </div>
        </div>
      </Phone>
    </>
  );
}

export function Mockup({ layout, shots }: { layout: ServiceLayout; shots: Shot[] }) {
  switch (layout) {
    case "gallery":
      return <Gallery shots={shots} />;
    case "reels":
      return <Reels shots={shots} />;
    case "render":
      return <Render shots={shots} />;
    case "phone":
      return <Social shots={shots} />;
    case "ads":
      return <Ads shots={shots} />;
    case "browser":
      return <Browser shots={shots} />;
  }
}
