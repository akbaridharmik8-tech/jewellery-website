// Everything a client-specific build needs to change lives in this file.

export const site = {
  brand: "Verdane",
  descriptor: "Jewellery Marketing Studio",
  tagline: "We make jewellery impossible to scroll past.",
  // International format, digits only (e.g. 919876543210).
  whatsapp: "910000000000",
  phone: "+91 00000 00000",
  email: "hello@verdane.example",
  city: "Mumbai",
  address: ["Studio 4, Heritage Arcade", "Zaveri Bazaar, Mumbai 400002"],
  since: 2016,
  locale: "en-IN",
  social: { instagram: "#", behance: "#", youtube: "#", linkedin: "#" },
};

/**
 * Real 3D camera for the hero. Set to null to use the built-in coded camera.
 * File goes in /public/models/. `credit` is shown in the footer (required for CC-BY models).
 */
export const cameraModel: (import("@/components/three/DslrModel").CameraModelConfig & { credit: string; creditUrl: string }) | null = null;

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/* --------------------------------------------------------------------------
   Portfolio, shown on the DSLR's screen and in "Selected work".

   The photos below are TEMPORARY free-licence stock photos from Pexels
   (https://www.pexels.com/license/), used until your own work is uploaded.
   To use your work: put files in /public/work/ and set
     media: { type: "image", src: "/work/x.jpg" }
     media: { type: "video", src: "/work/x.mp4", poster: "/work/x.jpg" }
   then delete the `credit` line (it prints "Placeholder photo · ...").
   `fallback` is shown if a remote image ever fails to load.
   -------------------------------------------------------------------------- */
export type Media = { type: "image"; src: string } | { type: "video"; src: string; poster?: string };

export type Work = {
  slug: string;
  title: string;
  client: string;
  service: string;
  year: number;
  result: string;
  media: Media;
  tone: string;
  exif: string;
  fallback: string;
  credit?: string;
};

/** Pexels CDN URL for a photo id, resized on their side. */
export const pexels = (id: number, w = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const works: Work[] = [
  { slug: "solitaire", title: "The Solitaire Edit", client: "Placeholder Jewellers", service: "Product photography", year: 2026, result: "+38% add-to-cart on PDPs", media: { type: "image", src: pexels(8398936) }, tone: "#0b0b0b", exif: "ISO 100 · f/11 · 1/160s · 100mm macro", fallback: "/renders/solitaire-ring.png", credit: "The Glorious Studio / Pexels" },
  { slug: "golden-hour", title: "Golden Hour Campaign", client: "Placeholder Fine Jewels", service: "Campaign & social", year: 2026, result: "2.1M organic reach in 3 weeks", media: { type: "image", src: pexels(5050491) }, tone: "#2a1a12", exif: "ISO 200 · f/2.8 · 1/250s · 85mm", fallback: "/renders/riviera-necklace.png", credit: "Ketut Subiyanto / Pexels" },
  { slug: "nisha", title: "Nisha Bridal Reels", client: "Placeholder Bridal House", service: "Reels & short film", year: 2025, result: "4.6x ROAS on Meta ads", media: { type: "image", src: pexels(12144990) }, tone: "#1c1410", exif: "4K · 120fps · 1/250s · 65mm", fallback: "/renders/nisha-drops.png", credit: "Pexels" },
  { slug: "line", title: "Line Tennis Launch", client: "Placeholder Diamonds", service: "3D visualisation", year: 2025, result: "Returns down 22% after 3D viewer", media: { type: "image", src: "/renders/tennis-bracelet.png" }, tone: "#141414", exif: "Rendered · 8K · path traced", fallback: "/renders/tennis-bracelet.png" },
  { slug: "diamond-line", title: "Diamond Line E-store", client: "Placeholder Atelier", service: "E-commerce shoot", year: 2025, result: "180 SKUs shot in 4 days", media: { type: "image", src: pexels(12194325) }, tone: "#ece8e2", exif: "ISO 100 · f/16 · 1/200s · 100mm macro", fallback: "/renders/ruby-bracelet.png", credit: "Melike B / Pexels" },
  { slug: "pearl", title: "Pearl Season", client: "Placeholder Gems", service: "Performance ads", year: 2024, result: "CPA cut from ₹2,400 to ₹890", media: { type: "image", src: pexels(11365012) }, tone: "#141414", exif: "ISO 160 · f/9 · 1/125s · 90mm", fallback: "/renders/sapphire-necklace.png", credit: "Pexels" },
];

/** Image to show for a work item (video poster, or the image itself). */
export const workStill = (w: Work) => (w.media.type === "video" ? (w.media.poster ?? w.fallback) : w.media.src);
/** Our own transparent 3D renders are shown centred; real photos fill the frame. */
export const isRender = (src: string) => src.startsWith("/renders/");

/* --------------------------------------------------------------------------
   Services journey: each service is a stop in the scroll-driven 3D section,
   shown with the kind of work it produces (`layout` picks the mockup).
   `shots` are TEMPORARY free Pexels photos (falling back to our renders);
   replace with your own work: { src: "/work/x.webp", fallback: "/renders/..." }.
   -------------------------------------------------------------------------- */
export type Shot = { src: string; fallback: string; label?: string };
export type ServiceLayout = "gallery" | "reels" | "render" | "phone" | "ads" | "browser";

const R = {
  ring: "/renders/solitaire-ring.png",
  emerald: "/renders/emerald-ring.png",
  necklace: "/renders/riviera-necklace.png",
  sapphire: "/renders/sapphire-necklace.png",
  drops: "/renders/nisha-drops.png",
  diamondDrops: "/renders/diamond-drops.png",
  tennis: "/renders/tennis-bracelet.png",
  ruby: "/renders/ruby-bracelet.png",
};

export const services: {
  no: string;
  title: string;
  line: string;
  layout: ServiceLayout;
  points: string[];
  result: string;
  shots: Shot[];
}[] = [
  {
    no: "01",
    title: "Jewellery photography",
    line: "Macro product, on-model and lifestyle shoots, lit for metal and stone, retouched to catalogue standard.",
    layout: "gallery",
    points: ["Macro & white-background", "On-model & lifestyle", "Hand retouching"],
    result: "+38% add-to-cart on product pages",
    shots: [
      { src: pexels(8398936, 1200), fallback: R.ring, label: "Solitaire · macro" },
      { src: pexels(2735981, 900), fallback: R.emerald, label: "Pear diamond" },
      { src: pexels(1457801, 900), fallback: R.tennis, label: "Pavé band" },
    ],
  },
  {
    no: "02",
    title: "Reels & campaign films",
    line: "Scroll-stopping 9:16 reels, launch films and bridal stories, scripted, shot and edited in house.",
    layout: "reels",
    points: ["Concept & script", "4K / 120fps shoots", "Edit, colour & sound"],
    result: "2.1M organic reach in 3 weeks",
    shots: [
      { src: pexels(5050491, 900), fallback: R.necklace, label: "1.2M views" },
      { src: pexels(14825057, 900), fallback: R.drops, label: "860K views" },
      { src: pexels(19021379, 900), fallback: R.diamondDrops, label: "2.4M views" },
    ],
  },
  {
    no: "03",
    title: "3D & AR product viewers",
    line: "Photoreal 3D of every SKU: spin it, change the metal, try it on in AR. No sample needed.",
    layout: "render",
    points: ["Photoreal 3D models", "360° web viewers", "AR try-on"],
    result: "Returns down 22% after 3D viewer",
    shots: [
      { src: R.emerald, fallback: R.emerald, label: "Live 3D" },
      { src: R.tennis, fallback: R.tennis },
      { src: R.necklace, fallback: R.necklace },
    ],
  },
  {
    no: "04",
    title: "Social media management",
    line: "Content calendars, community and creator collaborations that keep your feed looking like a magazine.",
    layout: "phone",
    points: ["Content calendar", "Daily posting & stories", "Community & creators"],
    result: "+3,280 followers a month",
    shots: [
      { src: pexels(9509032, 500), fallback: R.necklace },
      { src: pexels(12144990, 500), fallback: R.drops },
      { src: pexels(11365012, 500), fallback: R.sapphire },
      { src: pexels(10983783, 500), fallback: R.diamondDrops },
      { src: pexels(6467618, 500), fallback: R.ring },
      { src: pexels(39070291, 500), fallback: R.emerald },
      { src: pexels(5376556, 500), fallback: R.ruby },
      { src: pexels(3641056, 500), fallback: R.tennis },
      { src: pexels(29228980, 500), fallback: R.necklace },
    ],
  },
  {
    no: "05",
    title: "Performance ads",
    line: "Meta and Google campaigns built around festive and wedding seasons, measured to the rupee.",
    layout: "ads",
    points: ["Meta & Google ads", "Festive & wedding campaigns", "Weekly ROAS reports"],
    result: "4.6x return on ad spend",
    shots: [
      { src: pexels(12194325, 900), fallback: R.tennis, label: "Diamond Line Bracelet" },
      { src: pexels(1191531, 900), fallback: R.ruby, label: "Festive Bangles" },
    ],
  },
  {
    no: "06",
    title: "Websites & e-commerce",
    line: "Fast Shopify and Next.js storefronts with the product pages your photography deserves.",
    layout: "browser",
    points: ["Shopify & Next.js", "Product pages that convert", "Speed & SEO"],
    result: "1.8x conversion after redesign",
    shots: [
      { src: pexels(19646999, 1200), fallback: R.necklace, label: "Heritage Necklace" },
      { src: pexels(15684108, 600), fallback: R.diamondDrops },
    ],
  },
];

// Placeholder numbers: replace with your real results before going live.
export const stats = [
  { value: 140, suffix: "+", label: "Jewellery brands served" },
  { value: 38, suffix: "k", label: "Products photographed" },
  { value: 4.2, suffix: "x", label: "Average ad ROAS", decimals: 1 },
  { value: 9, suffix: "", label: "Years behind the lens" },
];

export const process = [
  { no: "01", title: "Brief & moodboard", line: "A 30-minute call, then a moodboard with lighting refs, props and shot list within 48 hours." },
  { no: "02", title: "Shoot", line: "Controlled macro studio for product, location and models for campaign. You can join live on video." },
  { no: "03", title: "Retouch & 3D", line: "Dust, reflections and metal tones corrected by hand. 3D models built from the same references." },
  { no: "04", title: "Launch & scale", line: "Assets cut for every placement, ads launched, and a weekly report on what is selling." },
];

// Placeholder testimonials: replace with real client quotes.
export const testimonials = [
  { quote: "Our diamonds finally look the way they do under the loupe. The first reel did more for us than a year of posting.", name: "Client Name", detail: "Founder, Placeholder Jewellers" },
  { quote: "They understand metal. Yellow gold looks warm, platinum looks cold, and nothing looks fake. That is rarer than it sounds.", name: "Client Name", detail: "Marketing Head, Placeholder Fine Jewels" },
  { quote: "The 3D viewer cut our 'is this the real colour?' calls almost to zero. Customers just spin it and buy.", name: "Client Name", detail: "E-commerce Lead, Placeholder Diamonds" },
];

/* --------------------------------------------------------------------------
   3D configurator demo + render-script inputs
   -------------------------------------------------------------------------- */
export type MetalKey = "yellow" | "rose" | "platinum";
export type StoneKey = "diamond" | "emerald" | "ruby" | "sapphire";
export type PieceKind = "ring" | "necklace" | "earrings" | "bracelet";

export const metals: Record<MetalKey, { label: string }> = {
  yellow: { label: "Yellow gold" },
  rose: { label: "Rose gold" },
  platinum: { label: "Platinum" },
};

export const stones: Record<StoneKey, { label: string }> = {
  diamond: { label: "Diamond" },
  emerald: { label: "Emerald" },
  ruby: { label: "Ruby" },
  sapphire: { label: "Sapphire" },
};

// Placeholder product shots, exported by `npm run renders` into /public/renders/<slug>.png
export const renders: { slug: string; kind: PieceKind; metal: MetalKey; stone: StoneKey }[] = [
  { slug: "solitaire-ring", kind: "ring", metal: "yellow", stone: "diamond" },
  { slug: "riviera-necklace", kind: "necklace", metal: "yellow", stone: "emerald" },
  { slug: "nisha-drops", kind: "earrings", metal: "rose", stone: "ruby" },
  { slug: "tennis-bracelet", kind: "bracelet", metal: "platinum", stone: "diamond" },
  { slug: "emerald-ring", kind: "ring", metal: "rose", stone: "emerald" },
  { slug: "sapphire-necklace", kind: "necklace", metal: "platinum", stone: "sapphire" },
  { slug: "diamond-drops", kind: "earrings", metal: "yellow", stone: "diamond" },
  { slug: "ruby-bracelet", kind: "bracelet", metal: "yellow", stone: "ruby" },
];
