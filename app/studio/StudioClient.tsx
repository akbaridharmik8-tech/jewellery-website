"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const CameraRender = dynamic(() => import("@/components/three/CameraRender"), { ssr: false });

export default function StudioClient({ angle }: { angle: number }) {
  useEffect(() => {
    document.body.style.background = "transparent";
  }, []);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CameraRender angle={angle} />
    </div>
  );
}
