// Everything a client-specific build needs to change lives in this file.

export const site = {
  brand: "Verdane",
  descriptor: "Jewellery Marketing Studio",
  tagline: "We make jewellery impossible to scroll past.",
  // Your live domain, e.g. "https://verdane.studio". Used for share previews; leave "" until you have one.
  url: "",
  // International format, digits only (e.g. 919876543210).
  whatsapp: "910000000000",
  phone: "+91 00000 00000",
  email: "hello@verdane.example",
  city: "Mumbai",
  address: ["Studio 4, Heritage Arcade", "Zaveri Bazaar, Mumbai 400002"],
  since: 2016,
  locale: "en-IN",
  // Leave a link empty ("") to hide it; no dead "#" links are shown.
  social: { instagram: "", behance: "", youtube: "", linkedin: "" },
  /**
   * Stats, client quotes and project results on this site are SAMPLES until you
   * replace them with your own. While true, each one carries a visible "Sample" tag.
   * Set to false only once every figure and quote is real.
   */
  sampleContent: true,
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
   If a remote photo ever fails to load, a neutral placeholder is shown instead.
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
  credit?: string;
};

/** Pexels CDN URL for a photo id, resized on their side. */
export const pexels = (id: number, w = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const works: Work[] = [
  { slug: "solitaire", title: "The Solitaire Edit", client: "Placeholder Jewellers", service: "Product photography", year: 2026, result: "+38% add to cart on PDPs", media: { type: "image", src: pexels(8398936) }, tone: "#0b0b0b", exif: "ISO 100 · f/11 · 1/160s · 100mm macro", credit: "The Glorious Studio / Pexels" },
  { slug: "golden-hour", title: "Golden Hour Campaign", client: "Placeholder Fine Jewels", service: "Campaign & social", year: 2026, result: "2.1M organic reach in 3 weeks", media: { type: "image", src: pexels(5050491) }, tone: "#2a1a12", exif: "ISO 200 · f/2.8 · 1/250s · 85mm", credit: "Ketut Subiyanto / Pexels" },
  { slug: "nisha", title: "Nisha Bridal Reels", client: "Placeholder Bridal House", service: "Reels & short film", year: 2025, result: "4.6x ROAS on Meta ads", media: { type: "image", src: pexels(12144990) }, tone: "#1c1410", exif: "4K · 120fps · 1/250s · 65mm", credit: "Pexels" },
  { slug: "bangles", title: "Festive Bangles Edit", client: "Placeholder Heritage Jewellers", service: "Campaign & social", year: 2025, result: "+52% festive season enquiries", media: { type: "image", src: pexels(1191531) }, tone: "#1c1612", exif: "ISO 200 · f/4 · 1/200s · 50mm", credit: "Pexels" },
  { slug: "diamond-line", title: "Diamond Line Online Store", client: "Placeholder Atelier", service: "Ecommerce shoot", year: 2025, result: "180 SKUs shot in 4 days", media: { type: "image", src: pexels(12194325) }, tone: "#ece8e2", exif: "ISO 100 · f/16 · 1/200s · 100mm macro", credit: "Melike B / Pexels" },
  { slug: "pearl", title: "Pearl Season", client: "Placeholder Gems", service: "Performance ads", year: 2024, result: "CPA cut from ₹2,400 to ₹890", media: { type: "image", src: pexels(11365012) }, tone: "#141414", exif: "ISO 160 · f/9 · 1/125s · 90mm", credit: "Pexels" },
];

/** Image to show for a work item (video poster, or the image itself). */
export const workStill = (w: Work) => (w.media.type === "video" ? (w.media.poster ?? "") : w.media.src);

/* --------------------------------------------------------------------------
   Services journey: each service is a stop in the scroll-driven section,
   shown with the kind of work it produces (`layout` picks the mockup).
   `shots` are TEMPORARY free Pexels photos; replace with your own work,
   e.g. { src: "/work/x.webp", label: "..." }.
   -------------------------------------------------------------------------- */
export type Shot = { src: string; label?: string };
export type ServiceLayout = "gallery" | "reels" | "phone" | "ads" | "browser";


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
    line: "Macro product, on model and lifestyle shoots, lit for metal and stone, retouched to catalogue standard.",
    layout: "gallery",
    points: ["Macro on white", "On model & lifestyle", "Hand retouching"],
    result: "+38% add to cart on product pages",
    shots: [
      { src: pexels(8398936, 1200), label: "Solitaire · macro" },
      { src: pexels(2735981, 900), label: "Pear diamond" },
      { src: pexels(1457801, 900), label: "Pavé band" },
    ],
  },
  {
    no: "02",
    title: "Reels & campaign films",
    line: "Scroll stopping 9:16 reels, launch films and bridal stories, scripted, shot and edited in house.",
    layout: "reels",
    points: ["Concept & script", "4K / 120fps shoots", "Edit, colour & sound"],
    result: "2.1M organic reach in 3 weeks",
    shots: [
      { src: pexels(5050491, 900), label: "1.2M views" },
      { src: pexels(14825057, 900), label: "860K views" },
      { src: pexels(19021379, 900), label: "2.4M views" },
    ],
  },
  {
    no: "03",
    title: "Social media management",
    line: "Content calendars, community and creator collaborations that keep your feed looking like a magazine.",
    layout: "phone",
    points: ["Content calendar", "Daily posting & stories", "Community & creators"],
    result: "+3,280 followers a month",
    shots: [
      { src: pexels(9509032, 500) },
      { src: pexels(12144990, 500) },
      { src: pexels(11365012, 500) },
      { src: pexels(10983783, 500) },
      { src: pexels(6467618, 500) },
      { src: pexels(39070291, 500) },
      { src: pexels(5376556, 500) },
      { src: pexels(3641056, 500) },
      { src: pexels(29228980, 500) },
    ],
  },
  {
    no: "04",
    title: "Performance ads",
    line: "Meta and Google campaigns built around festive and wedding seasons, measured to the rupee.",
    layout: "ads",
    points: ["Meta & Google ads", "Festive & wedding campaigns", "Weekly ROAS reports"],
    result: "4.6x return on ad spend",
    shots: [
      { src: pexels(12194325, 900), label: "Diamond Line Bracelet" },
      { src: pexels(1191531, 900), label: "Festive Bangles" },
    ],
  },
  {
    no: "05",
    title: "Websites & ecommerce",
    line: "Fast Shopify and Next.js storefronts with the product pages your photography deserves.",
    layout: "browser",
    points: ["Shopify & Next.js", "Product pages that convert", "Speed & SEO"],
    result: "1.8x conversion after redesign",
    shots: [
      { src: pexels(19646999, 1200), label: "Heritage Necklace" },
      { src: pexels(15684108, 600) },
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
  { no: "01", title: "Brief & moodboard", line: "A 30 minute call, then a moodboard with lighting refs, props and shot list within 48 hours." },
  { no: "02", title: "Shoot", line: "Controlled macro studio for product, location and models for campaign. You can join live on video." },
  { no: "03", title: "Retouch & edit", line: "Dust, reflections and metal tones corrected by hand. Reels cut, coloured and sound designed in house." },
  { no: "04", title: "Launch & scale", line: "Assets cut for every placement, ads launched, and a weekly report on what is selling." },
];

// Placeholder testimonials: replace with real client quotes.
export const testimonials = [
  { quote: "Our diamonds finally look the way they do under the loupe. The first reel did more for us than a year of posting.", name: "Client Name", detail: "Founder, Placeholder Jewellers" },
  { quote: "They understand metal. Yellow gold looks warm, platinum looks cold, and nothing looks fake. That is rarer than it sounds.", name: "Client Name", detail: "Marketing Head, Placeholder Fine Jewels" },
  { quote: "Our product pages finally show the stone's true colour. The 'is this the real colour?' calls have almost stopped.", name: "Client Name", detail: "Ecommerce Lead, Placeholder Diamonds" },
];

/* --------------------------------------------------------------------------
   FAQ. Anything in {{double braces}} is a fact only you can supply (prices,
   timings, policies); it shows highlighted on the site until you replace it.
   The FAQ schema for search engines is added once no {{placeholders}} remain.
   -------------------------------------------------------------------------- */
export const faq: { q: string; a: string }[] = [
  { q: "How much does a jewellery shoot cost?", a: "Product photography starts at {{price per piece}}. Campaigns and reels are quoted per project after a 30 minute call, and every quote is itemised so you can see where the budget goes." },
  { q: "How soon do we get the final photos?", a: "A standard product shoot is delivered in {{turnaround time}}. Campaigns take longer because of planning, models and locations, so you get a dated schedule with the quote." },
  { q: "Do we send our jewellery to your studio?", a: "Either works. We shoot at our studio in " + site.city + " or at your store. {{How pieces are logged, insured and returned}}" },
  { q: "Can you match our existing brand style?", a: "Yes. We start from your current catalogue and brand guidelines and share a moodboard for you to approve before anything is shot." },
  { q: "Do you shoot on models?", a: "Yes. We cast and style models for on model and campaign shoots, and share options with you before the shoot. {{How model and styling fees are charged}}" },
  { q: "Do you also run our Instagram and ads?", a: "Yes. Book a single service, or hand us content, posting and ads together as a monthly plan starting at {{monthly plan price}}." },
  { q: "Who owns the photos and videos?", a: "Usage is set out in every quote. {{Your standard ownership and usage terms}}" },
  { q: "What if we are not happy with the edits?", a: "{{Your revision policy, for example how many retouching rounds are included}}" },
];

