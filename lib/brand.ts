// Brand palette: the Pantone reference is the source of truth. HEX values are
// screen approximations (Pantone publishes no official HEX); check print work
// against a physical Pantone guide. Mirrors the tokens in app/globals.css.

export type BrandColour = {
  token: string;
  name: string;
  pantone: string;
  hex: string;
  role: string;
  group: "Base" | "Dark" | "Accent" | "Support";
};

export const palette: BrandColour[] = [
  { token: "ivory", name: "Ivory", pantone: "PANTONE 11-0602 TCX Snow White", hex: "#F2F0EB", role: "The background of the whole landing page, with a faint paper grain.", group: "Base" },
  { token: "cream", name: "Cream", pantone: "PANTONE 11-0507 TCX Winter White", hex: "#F5ECD2", role: "Soft fills behind photos and small surfaces.", group: "Base" },
  { token: "onyx", name: "Onyx", pantone: "PANTONE Black C", hex: "#2D2926", role: "Dark surfaces: the work viewer, device mockups, button hover.", group: "Dark" },
  { token: "ink", name: "Ink", pantone: "PANTONE Neutral Black C", hex: "#222223", role: "All headings and body text, primary buttons.", group: "Dark" },
  { token: "champagne", name: "Champagne", pantone: "PANTONE 7502 C", hex: "#CEB888", role: "The accent: buttons, labels, one highlighted word. About 10%.", group: "Accent" },
  { token: "champagne-deep", name: "Deep champagne", pantone: "PANTONE 7503 C", hex: "#A89968", role: "Decorative detail; text only on dark backgrounds.", group: "Accent" },
  { token: "taupe", name: "Taupe", pantone: "PANTONE Warm Gray 11 C", hex: "#6E6259", role: "Secondary text and labels on light backgrounds.", group: "Support" },
  { token: "greige", name: "Greige", pantone: "PANTONE Warm Gray 2 C", hex: "#CBC4BC", role: "Secondary text on dark backgrounds.", group: "Support" },
];

export const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.1 contrast ratio between two colours. */
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const byToken = (t: string) => palette.find((c) => c.token === t)!;

// The text/background pairs the site actually uses.
export const pairs = (
  [
    ["ink", "ivory"],
    ["taupe", "ivory"],
    ["ivory", "onyx"],
    ["champagne", "onyx"],
    ["greige", "onyx"],
    ["champagne-deep", "onyx"],
    ["onyx", "champagne"],
  ] as const
).map(([fg, bg]) => ({ fg: byToken(fg), bg: byToken(bg), ratio: contrast(byToken(fg).hex, byToken(bg).hex) }));
