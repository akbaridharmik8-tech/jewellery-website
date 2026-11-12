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

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/* --------------------------------------------------------------------------
   Portfolio: the photos turning around the hero pendant, and the work viewer.

   The photos are TEMPORARY free-licence stock photos from Pexels
   (https://www.pexels.com/license/), saved in /public/work/, until your own
   work is ready. To use yours: put files in /public/work/ and set
     media: { type: "image", src: "/work/x.webp" }
     media: { type: "video", src: "/work/x.mp4", poster: "/work/x.webp" }
   then delete the `credit` line (it prints "Placeholder photo · ...").
   Results are samples (see site.sampleContent).
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
  alt: string;
  credit?: string;
};

// Order matters: this is the order the tiles sit around the hero pendant.
export const works: Work[] = [
  { slug: "solitaire", title: "The Solitaire Edit", client: "Placeholder Jewellers", service: "Product photography", year: 2026, result: "+38% add to cart on product pages", media: { type: "image", src: "/work/solitaire.webp" }, alt: "Diamond solitaire ring on a dark stand", credit: "The Glorious Studio / Pexels" },
  { slug: "nisha", title: "Nisha Bridal Reels", client: "Placeholder Bridal House", service: "Reels & short film", year: 2025, result: "4.6x ROAS on Meta ads", media: { type: "image", src: "/work/bride-red.webp" }, alt: "Bride in red with kundan necklace, nath and maang tikka", credit: "Pexels" },
  { slug: "rose-gold", title: "Rose Gold Edit", client: "Placeholder Atelier", service: "Ecommerce shoot", year: 2026, result: "120 pieces shot in 3 days", media: { type: "image", src: "/work/rose-earrings.webp" }, alt: "Rose gold diamond drop earrings on blue paper", credit: "Pexels" },
  { slug: "golden-hour", title: "Golden Hour Campaign", client: "Placeholder Fine Jewels", service: "Campaign & social", year: 2026, result: "2.1M organic reach in 3 weeks", media: { type: "image", src: "/work/gold-collar.webp" }, alt: "Woman in window light wearing a gold collar necklace", credit: "cottonbro studio / Pexels" },
  { slug: "kundan", title: "Kundan Heritage Story", client: "Placeholder Heritage Jewellers", service: "Product photography", year: 2025, result: "+64% saves on Instagram", media: { type: "image", src: "/work/kundan-choker.webp" }, alt: "Kundan choker and maang tikka with red and green stones", credit: "Pexels" },
  { slug: "bangles", title: "Festive Bangles Edit", client: "Placeholder Heritage Jewellers", service: "Campaign & social", year: 2025, result: "+52% festive season enquiries", media: { type: "image", src: "/work/festive-bangles.webp" }, alt: "Hands wearing layered gold bracelets", credit: "Pexels" },
  { slug: "diamond-line", title: "Diamond Line Online Store", client: "Placeholder Atelier", service: "Ecommerce shoot", year: 2025, result: "180 SKUs shot in 4 days", media: { type: "image", src: "/work/crystal-set.webp" }, alt: "Diamond necklace, bracelet, ring and earrings set on pale blue", credit: "Pexels" },
  { slug: "pearl", title: "Pearl Season", client: "Placeholder Gems", service: "Performance ads", year: 2024, result: "CPA cut from ₹2,400 to ₹890", media: { type: "image", src: "/work/pearls.webp" }, alt: "Pearl necklace and earrings in an open jewellery box", credit: "Pexels" },
];

/** Image to show for a work item (video poster, or the image itself). */
export const workStill = (w: Work) => (w.media.type === "video" ? (w.media.poster ?? "") : w.media.src);

/** The centrepiece of the hero: a real photo, shown in a round champagne frame. */
export const heroPendant = { src: "/work/pendant.webp", alt: "Emerald and diamond flower pendant" };

/* --------------------------------------------------------------------------
   Services journey: each service is a stop in the scroll-driven section,
   shown with the kind of work it produces (`layout` picks the mockup).
   `shots` are TEMPORARY free Pexels photos (in /public/work/); replace them
   with your own work, e.g. { src: "/work/x.webp", label: "..." }.
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
      { src: "/work/solitaire.webp", label: "Solitaire · macro" },
      { src: "/work/pear-diamond.webp", label: "Pear diamond" },
      { src: "/work/two-tone-ring.webp", label: "Two tone band" },
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
      { src: "/work/golden-hour.webp", label: "1.2M views" },
      { src: "/work/bridal-ear.webp", label: "860K views" },
      { src: "/work/bride-purple.webp", label: "2.4M views" },
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
      { src: "/work/gold-collar.webp" },
      { src: "/work/gold-hoops.webp" },
      { src: "/work/pearls.webp" },
      { src: "/work/rose-earrings.webp" },
      { src: "/work/gold-chain.webp" },
      { src: "/work/pearl-studs.webp" },
      { src: "/work/bride-red.webp" },
      { src: "/work/rose-cuff.webp" },
      { src: "/work/kundan-choker.webp" },
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
      { src: "/work/rose-cuff.webp", label: "Rose Gold Cuff" },
      { src: "/work/festive-bangles.webp", label: "Festive Bangles" },
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
      { src: "/work/diamond-necklace.webp", label: "Heritage Necklace" },
      { src: "/work/crystal-set.webp" },
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

