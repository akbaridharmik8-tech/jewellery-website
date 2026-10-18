"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { MetalKey, PieceKind, StoneKey } from "@/lib/site";

const StudioRender = dynamic(() => import("@/components/three/StudioRender"), { ssr: false });
const CameraRender = dynamic(() => import("@/components/three/CameraRender"), { ssr: false });

type Props = { model: "piece" | "camera"; angle: number; kind: PieceKind; metal: MetalKey; stone: StoneKey };

export default function StudioClient({ model, angle, ...piece }: Props) {
  useEffect(() => {
    document.body.style.background = "transparent";
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {model === "camera" ? <CameraRender angle={angle} /> : <StudioRender {...piece} />}
    </div>
  );
}
