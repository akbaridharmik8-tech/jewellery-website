"use client";

import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

/*
  A DSLR built from primitives. Orientation: lens points +Z (front), the rear
  LCD faces -Z. Units: the body is 3 wide.
  LCD is exported so the hero can fly the camera into the screen.
*/

export const LCD = { width: 1.86, height: 1.24, x: 0.32, y: -0.12, z: -0.585 };

function useMaterials() {
  return useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({ color: "#141414", roughness: 0.62, metalness: 0.05, clearcoat: 0.25, clearcoatRoughness: 0.35, envMapIntensity: 0.55 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#0f0f0f", roughness: 0.95, metalness: 0, envMapIntensity: 0.5 }),
      metal: new THREE.MeshStandardMaterial({ color: "#c2c2c2", roughness: 0.22, metalness: 1 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.3, metalness: 1 }),
      gold: new THREE.MeshStandardMaterial({ color: "#d8b06a", roughness: 0.2, metalness: 1 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#0b0f14",
        roughness: 0.02,
        metalness: 0.3,
        clearcoat: 1,
        iridescence: 1,
        iridescenceIOR: 1.8,
        iridescenceThicknessRange: [200, 600],
        envMapIntensity: 2.4,
      }),
      black: new THREE.MeshBasicMaterial({ color: "#050505" }),
      screenGlass: new THREE.MeshPhysicalMaterial({
        color: "#000000",
        roughness: 0.04,
        metalness: 0,
        clearcoat: 1,
        transparent: true,
        opacity: 0.18,
        envMapIntensity: 1.5,
      }),
    }),
    [],
  );
}

function Lens({ m }: { m: ReturnType<typeof useMaterials> }) {
  // Barrel profile (radius, z) revolved: mount → zoom ring ribs → gold accent → hood.
  const barrel = useMemo(() => {
    const pts: [number, number][] = [
      [0.7, 0], [0.74, 0.02], [0.74, 0.2], [0.72, 0.24],
    ];
    for (let i = 0; i < 18; i++) pts.push([i % 2 ? 0.79 : 0.765, 0.28 + i * 0.03]);
    pts.push([0.75, 0.84], [0.75, 1.0], [0.77, 1.02]);
    for (let i = 0; i < 12; i++) pts.push([i % 2 ? 0.8 : 0.78, 1.06 + i * 0.025]);
    pts.push([0.77, 1.38], [0.77, 1.56], [0.84, 1.66], [0.84, 1.82], [0.8, 1.84], [0.66, 1.84]);
    const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(r, z)), 96);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  return (
    <group position={[0.15, -0.08, 0.55]}>
      {/* Mount ring */}
      <mesh material={m.metal} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
        <cylinderGeometry args={[0.8, 0.8, 0.07, 96]} />
      </mesh>
      <mesh geometry={barrel} material={m.rubber} position={[0, 0, 0.06]} />
      {/* Gold accent ring: the one warm note on the camera, tied to the brand palette */}
      <mesh material={m.gold} position={[0, 0, 1.53]}>
        <torusGeometry args={[0.775, 0.018, 12, 96]} />
      </mesh>
      {/* Inner black throat + coated front element */}
      <mesh material={m.black} position={[0, 0, 1.5]}>
        <circleGeometry args={[0.7, 64]} />
      </mesh>
      <mesh material={m.darkMetal} position={[0, 0, 1.62]}>
        <torusGeometry args={[0.6, 0.03, 12, 96]} />
      </mesh>
      <mesh material={m.glass} position={[0, 0, 1.52]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.42, 1]}>
        <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
      </mesh>
    </group>
  );
}

function Prism({ m }: { m: ReturnType<typeof useMaterials> }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.78, 0);
    s.lineTo(0.78, 0);
    s.lineTo(0.42, 0.62);
    s.lineTo(-0.42, 0.62);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4 });
    g.translate(0, 0, -0.45);
    return g;
  }, []);
  return (
    <group position={[0.15, 0.92, -0.02]}>
      <mesh geometry={geo} material={m.body} />
      {/* Hot shoe */}
      <mesh material={m.metal} position={[0, 0.7, -0.02]}>
        <boxGeometry args={[0.46, 0.05, 0.52]} />
      </mesh>
      {/* Brand plate (left blank on purpose: add a client logo texture here) */}
      <mesh material={m.darkMetal} position={[0, 0.34, 0.505]} rotation={[-0.52, 0, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.01]} />
      </mesh>
    </group>
  );
}

function ModeDial({ m }: { m: ReturnType<typeof useMaterials> }) {
  const ribs = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      o.position.set(Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3);
      o.rotation.set(0, -a, 0);
      o.updateMatrix();
      ribs.current!.setMatrixAt(i, o.matrix);
    }
    ribs.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group position={[-0.95, 1.12, -0.1]}>
      <mesh material={m.darkMetal}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 48]} />
      </mesh>
      <instancedMesh ref={ribs} args={[undefined, m.darkMetal, 40]}>
        <boxGeometry args={[0.02, 0.18, 0.03]} />
      </instancedMesh>
      <mesh material={m.gold} position={[0, 0.101, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.025, 16]} />
      </mesh>
    </group>
  );
}

type Props = { screen: THREE.Texture | null; screenColor?: string } & ThreeElements["group"];

export const DslrCamera = forwardRef<THREE.Group, Props>(function DslrCamera({ screen, screenColor = "#0c2620", ...rest }, ref) {
  const m = useMaterials();
  const screenMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const screenBg = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);

  useLayoutEffect(() => {
    screenMat.map = screen;
    screenMat.transparent = true;
    screenMat.needsUpdate = true;
    screenBg.color.set(screenColor);
  }, [screen, screenColor, screenMat, screenBg]);

  return (
    <group ref={ref} {...rest}>
      {/* Body */}
      <RoundedBox args={[3, 1.9, 1.1]} radius={0.16} smoothness={6} material={m.body} />
      {/* Hand grip: right-hand side of the camera, which is viewer-left from the front */}
      <RoundedBox args={[0.82, 1.92, 0.7]} radius={0.3} smoothness={6} position={[-1.16, -0.02, 0.5]} material={m.rubber} />
      {/* Leatherette band around the lens side */}
      <RoundedBox args={[1.9, 1.3, 0.04]} radius={0.02} position={[0.42, -0.2, 0.555]} material={m.rubber} />
      <Prism m={m} />
      <ModeDial m={m} />
      {/* Shutter button on the grip */}
      <group position={[-1.18, 0.99, 0.55]}>
        <mesh material={m.darkMetal}>
          <cylinderGeometry args={[0.17, 0.19, 0.06, 32]} />
        </mesh>
        <mesh material={m.metal} position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 32]} />
        </mesh>
      </group>
      {/* Top info screen */}
      <mesh position={[1.05, 0.955, -0.05]} rotation={[-Math.PI / 2, 0, 0]} material={m.black}>
        <planeGeometry args={[0.6, 0.42]} />
      </mesh>
      {/* Strap lugs */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.metal} position={[s * 1.52, 0.72, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.08, 0.022, 8, 24]} />
        </mesh>
      ))}
      <Lens m={m} />

      {/* ---- Rear ---- */}
      {/* Eyepiece */}
      <RoundedBox args={[0.7, 0.46, 0.22]} radius={0.08} position={[0.15, 1.2, -0.6]} material={m.rubber} />
      <mesh position={[0.15, 1.2, -0.712]} rotation={[0, Math.PI, 0]} material={m.black}>
        <planeGeometry args={[0.4, 0.24]} />
      </mesh>
      {/* LCD bezel, screen content and cover glass */}
      <RoundedBox args={[LCD.width + 0.14, LCD.height + 0.14, 0.04]} radius={0.04} position={[LCD.x, LCD.y, LCD.z + 0.03]} material={m.darkMetal} />
      <mesh position={[LCD.x, LCD.y, LCD.z]} rotation={[0, Math.PI, 0]} material={screenBg}>
        <planeGeometry args={[LCD.width, LCD.height]} />
      </mesh>
      <mesh position={[LCD.x, LCD.y, LCD.z - 0.002]} rotation={[0, Math.PI, 0]} material={screenMat}>
        <planeGeometry args={[LCD.width, LCD.height]} />
      </mesh>
      <mesh name="lcd-glass" position={[LCD.x, LCD.y, LCD.z - 0.006]} rotation={[0, Math.PI, 0]} material={m.screenGlass}>
        <planeGeometry args={[LCD.width, LCD.height]} />
      </mesh>
      {/* Rear buttons + control wheel (viewer-left of the LCD when seen from behind) */}
      {[0.38, 0.1, -0.18].map((y) => (
        <mesh key={y} material={m.darkMetal} position={[-1.12, y, -0.57]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 24]} />
        </mesh>
      ))}
      <mesh material={m.darkMetal} position={[-1.08, -0.52, -0.57]}>
        <torusGeometry args={[0.2, 0.045, 12, 48]} />
      </mesh>
      <mesh material={m.metal} position={[-1.08, -0.52, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
      </mesh>
    </group>
  );
});
