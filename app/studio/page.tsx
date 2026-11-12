import type { Metadata } from "next";
import StudioClient from "./StudioClient";

// Internal render page for the DSLR poster (shown when a device has no WebGL):
// /studio?angle=-0.55. Run `npm run renders` to regenerate /public/renders/camera-poster.png.
export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default async function StudioPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return <StudioClient angle={Number(q.angle ?? -0.55)} />;
}
