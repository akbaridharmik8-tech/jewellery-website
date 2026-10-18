"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { MetalKey, StoneKey } from "@/lib/site";
import { Ring } from "./jewels";
import { StudioLights } from "./StudioLights";

function Turntable({ metal, stone }: { metal: MetalKey; stone: StoneKey }) {
  const g = useRef<THREE.Group>(null);
  const pop = useRef(1);
  const last = useRef(`${metal}-${stone}`);

  useFrame((_, delta) => {
    // A small "settle" bounce whenever the selection changes.
    const key = `${metal}-${stone}`;
    if (key !== last.current) {
      last.current = key;
      pop.current = 0;
    }
    pop.current = Math.min(1, pop.current + delta * 2.2);
    const t = pop.current;
    const bounce = 1 + Math.sin(t * Math.PI) * 0.06 * (1 - t);
    g.current?.scale.setScalar(bounce);
  });

  return (
    <group ref={g} rotation={[-0.25, 0, 0]} position={[0, -0.25, 0]}>
      <Ring metal={metal} stone={stone} />
    </group>
  );
}

export default function ConfiguratorScene({ metal, stone }: { metal: MetalKey; stone: StoneKey }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 5.6], fov: 32 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <StudioLights />
        <Turntable metal={metal} stone={stone} />
        <ContactShadows position={[0, -1.55, 0]} opacity={0.55} scale={6} blur={2.6} far={2} resolution={256} color="#000000" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={!reduced}
          autoRotateSpeed={1.1}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
