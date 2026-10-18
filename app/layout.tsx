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
  title: `${site.brand} Studio | ${site.descriptor}`,
  description: "Jewellery photography, reels, 3D product viewers and performance ads for jewellery brands.",
  openGraph: {
    title: `${site.brand} Studio | ${site.descriptor}`,
    description: site.tagline,
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0c2620" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
