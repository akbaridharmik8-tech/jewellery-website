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

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/* --------------------------------------------------------------------------
   Portfolio, shown on the DSLR's screen and in "Selected work".
   Replace `media` with your own shoots: put files in /public/work/ and use
   { type: "image", src: "/work/x.jpg" } or { type: "video", src: "/work/x.mp4", poster: "/work/x.jpg" }.
   `tone` is the backdrop colour behind transparent placeholder renders.
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
};

export const works: Work[] = [
  { slug: "solitaire", title: "The Solitaire Edit", client: "Placeholder Jewellers", service: "Product photography", year: 2026, result: "+38% add-to-cart on PDPs", media: { type: "image", src: "/renders/solitaire-ring.png" }, tone: "#0c2620", exif: "ISO 100 · f/11 · 1/160s · 100mm macro" },
  { slug: "riviera", title: "Riviera Campaign", client: "Placeholder Fine Jewels", service: "Campaign & social", year: 2026, result: "2.1M organic reach in 3 weeks", media: { type: "image", src: "/renders/riviera-necklace.png" }, tone: "#3a1d22", exif: "ISO 200 · f/8 · 1/125s · 85mm" },
  { slug: "nisha", title: "Nisha Bridal Reels", client: "Placeholder Bridal House", service: "Reels & short film", year: 2025, result: "4.6x ROAS on Meta ads", media: { type: "image", src: "/renders/nisha-drops.png" }, tone: "#1c2b3a", exif: "4K · 120fps · 1/250s · 65mm" },
  { slug: "line", title: "Line Tennis Launch", client: "Placeholder Diamonds", service: "3D visualisation", year: 2025, result: "Returns down 22% after 3D viewer", media: { type: "image", src: "/renders/tennis-bracelet.png" }, tone: "#141414", exif: "Rendered · 8K · path traced" },
  { slug: "verde", title: "Verde Cocktail Rings", client: "Placeholder Atelier", service: "E-commerce shoot", year: 2025, result: "180 SKUs shot in 4 days", media: { type: "image", src: "/renders/emerald-ring.png" }, tone: "#e9e1d3", exif: "ISO 100 · f/16 · 1/200s · 100mm macro" },
  { slug: "midnight", title: "Midnight Pendant", client: "Placeholder Gems", service: "Performance ads", year: 2024, result: "CPA cut from ₹2,400 to ₹890", media: { type: "image", src: "/renders/sapphire-necklace.png" }, tone: "#0f1a2e", exif: "ISO 160 · f/9 · 1/125s · 90mm" },
];

export const services = [
  { no: "01", title: "Jewellery photography", line: "Macro product, on-model and lifestyle shoots, lit for metal and stone, retouched to catalogue standard.", preview: "/renders/solitaire-ring.png" },
  { no: "02", title: "Reels & campaign films", line: "Scroll-stopping 9:16 reels, launch films and bridal stories, scripted, shot and edited in house.", preview: "/renders/nisha-drops.png" },
  { no: "03", title: "3D & AR product viewers", line: "Photoreal 3D of every SKU: spin it, change the metal, try it on in AR. No sample needed.", preview: "/renders/emerald-ring.png" },
  { no: "04", title: "Social media management", line: "Content calendars, community and creator collaborations that keep your feed looking like a magazine.", preview: "/renders/riviera-necklace.png" },
  { no: "05", title: "Performance ads", line: "Meta and Google campaigns built around festive and wedding seasons, measured to the rupee.", preview: "/renders/sapphire-necklace.png" },
  { no: "06", title: "Websites & e-commerce", line: "Fast Shopify and Next.js storefronts with the product pages your photography deserves.", preview: "/renders/tennis-bracelet.png" },
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
