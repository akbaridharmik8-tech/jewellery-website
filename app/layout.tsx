import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: `${site.brand} Studio | ${site.descriptor}`,
  description: "Jewellery photography, reels, social media and performance ads for jewellery brands.",
  openGraph: {
    title: `${site.brand} Studio | ${site.descriptor}`,
    description: site.tagline,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#2d2926" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="paper">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-champagne px-4 py-2 text-sm font-semibold text-onyx focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
