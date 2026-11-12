"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { DslrCamera } from "./DslrCamera";
import { StudioLights } from "./StudioLights";

function Cam({ angle }: { angle: number }) {
  return <DslrCamera screen={null} rotation={[0.18, angle, 0]} position={[0, -0.1, 0]} scale={0.9} />;
}

/** Poster / QA render of the DSLR. /studio?angle=-0.55 */
export default function CameraRender({ angle }: { angle: number }) {
  return (
    <Canvas
      dpr={2}
      camera={{ position: [0, 0.4, 9], fov: 30 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={() => setTimeout(() => document.body.setAttribute("data-ready", "true"), 1200)}
    >
      <StudioLights />
      <Suspense fallback={null}>
        <Cam angle={angle} />
      </Suspense>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2.6} far={2.5} />
    </Canvas>
  );
}
