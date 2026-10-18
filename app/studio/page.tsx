import type { Metadata } from "next";
import type { MetalKey, PieceKind, StoneKey } from "@/lib/site";
import StudioClient from "./StudioClient";

// Internal render page for product shots: /studio?kind=ring&metal=yellow&stone=diamond
// and for the DSLR poster: /studio?model=camera&angle=-0.6
// Run `npm run renders` to regenerate /public/renders from lib/site.ts.
export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default async function StudioPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <StudioClient
      model={q.model === "camera" ? "camera" : "piece"}
      angle={Number(q.angle ?? -0.6)}
      kind={(q.kind as PieceKind) ?? "ring"}
      metal={(q.metal as MetalKey) ?? "yellow"}
      stone={(q.stone as StoneKey) ?? "diamond"}
    />
  );
}
