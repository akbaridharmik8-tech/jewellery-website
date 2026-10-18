"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { MetalKey, PieceKind, StoneKey } from "@/lib/site";
import { Piece } from "./jewels";
import { StudioLights } from "./StudioLights";

// Per-piece "camera angle" so every product shot is framed consistently.
const POSE: Record<PieceKind, { rotation: [number, number, number]; position: [number, number, number]; scale: number }> = {
  ring: { rotation: [0.42, 0.55, 0.06], position: [0, -0.5, 0], scale: 0.95 },
  necklace: { rotation: [0.05, 0, 0], position: [0, 0.2, 0], scale: 0.92 },
  earrings: { rotation: [0, 0, 0], position: [0, -0.35, 0], scale: 1.15 },
  bracelet: { rotation: [0, 0.4, 0], position: [0, 0, 0], scale: 0.95 },
};

/** Renders one piece on a transparent background. Used to export product shots. */
export default function StudioRender({ kind, metal, stone }: { kind: PieceKind; metal: MetalKey; stone: StoneKey }) {
  const pose = POSE[kind];
  return (
    <Canvas
      dpr={2}
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={() => setTimeout(() => document.body.setAttribute("data-ready", "true"), 800)}
    >
      <StudioLights />
      <group rotation={pose.rotation} position={pose.position} scale={pose.scale}>
        <Piece kind={kind} metal={metal} stone={stone} />
      </group>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={7} blur={2.8} far={2.5} />
    </Canvas>
  );
}
