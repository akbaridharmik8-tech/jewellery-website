import type { Metadata } from "next";
import OgCard from "./OgCard";

// Internal 1200×630 card used to export app/opengraph-image.jpg (see README). Not linked anywhere.
export const metadata: Metadata = { title: "Share card", robots: { index: false, follow: false } };

export default function OgPage() {
  return <OgCard />;
}
