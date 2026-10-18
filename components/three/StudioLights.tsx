"use client";

import { Environment, Lightformer } from "@react-three/drei";

// A loose sphere of small hard lights: each facet of a stone picks up a different one.
const SPARKS = Array.from({ length: 22 }, (_, i) => {
  const a = i * 2.39996; // golden angle
  const y = 1 - (i / 21) * 2;
  const r = Math.sqrt(1 - y * y);
  return { position: [Math.cos(a) * r * 6, y * 6, Math.sin(a) * r * 6] as [number, number, number], i };
});

/**
 * A photographic softbox rig built from Lightformers, so reflections on metal
 * and facets on stones come from "real" light shapes, with no HDR download.
 * Warm key + cool rim mirrors the gold / emerald palette of the site.
 */
export function StudioLights({ warmth = 1 }: { warmth?: number }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#fff3dd" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#bfe3d4" />
      <Environment resolution={512} frames={1}>
        {/* Mid-grey "sweep": like a light tent, it keeps facets from reflecting pure black */}
        <color attach="background" args={["#2a2825"]} />
        {/* Overhead key */}
        <Lightformer form="rect" intensity={4} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} color="#fff6e6" />
        {/* Strip lights left/right give long highlights on the band */}
        <Lightformer form="rect" intensity={3 * warmth} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 0.6, 1]} color="#ffd9a0" />
        <Lightformer form="rect" intensity={2.4} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[10, 0.6, 1]} color="#d9fff0" />
        {/* Front fill + ring light for catch-lights in the stones */}
        <Lightformer form="ring" intensity={3} position={[0, 0.5, 6]} scale={2.5} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[6, 2, 1]} color="#f2e2c4" />
        {/* Small hard sources = sparkle */}
        <Lightformer form="circle" intensity={8} position={[2.5, 3, 3]} scale={0.4} />
        <Lightformer form="circle" intensity={8} position={[-2.8, 2.2, 2.5]} scale={0.3} />
        <Lightformer form="circle" intensity={6} position={[0.5, -2.5, 3.5]} scale={0.3} />
        {SPARKS.map(({ position, i }) => (
          <Lightformer
            key={i}
            form="rect"
            intensity={i % 3 === 0 ? 6 : 3}
            position={position}
            scale={[2.2, 2.2, 1]}
            target={[0, 0, 0]}
            color={i % 4 === 0 ? "#ffe2b0" : "#ffffff"}
          />
        ))}
        {/* Soft panel behind the camera so tables/front facets never go fully black */}
        <Lightformer form="rect" intensity={1.4} position={[0, 0, 7]} scale={[3, 3, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}
