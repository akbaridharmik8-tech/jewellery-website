"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MetalKey, PieceKind, StoneKey } from "@/lib/site";

/* --------------------------------------------------------------------------
   Materials
   -------------------------------------------------------------------------- */

export const METAL_COLORS: Record<MetalKey, string> = {
  yellow: "#e9c27b",
  rose: "#e7b199",
  platinum: "#dfe2e4",
};

type GemSpec = {
  color: string;
  ior: number;
  transmission: number;
  attenuation?: string;
  iridescence: number;
  metalness?: number;
  env?: number;
};
const GEMS: Record<StoneKey, GemSpec> = {
  // Diamond: rendered as a faceted mirror of the light rig (high-contrast windows and
  // extinction), with iridescence standing in for fire. Reads better than glass.
  diamond: { color: "#ffffff", ior: 2.42, transmission: 0, iridescence: 0.5, metalness: 0.95, env: 4 },
  emerald: { color: "#1f9a66", ior: 1.58, transmission: 0.55, attenuation: "#0b6b43", iridescence: 0.15 },
  ruby: { color: "#c3122e", ior: 1.77, transmission: 0.55, attenuation: "#8a0a1d", iridescence: 0.15 },
  sapphire: { color: "#2448b8", ior: 1.77, transmission: 0.55, attenuation: "#122c86", iridescence: 0.15 },
};

export function useMetalMaterial(metal: MetalKey) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        metalness: 1,
        roughness: 0.16,
        clearcoat: 0.6,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.5,
      }),
    [],
  );
  useLayoutEffect(() => {
    mat.color.set(METAL_COLORS[metal]);
  }, [mat, metal]);
  return mat;
}

export function useGemMaterial(stone: StoneKey) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        flatShading: true,
        thickness: 0.9,
        specularIntensity: 1,
        envMapIntensity: 3.2,
        iridescenceIOR: 1.6,
      }),
    [],
  );
  useLayoutEffect(() => {
    const g = GEMS[stone];
    mat.color.set(g.color);
    mat.ior = g.ior;
    mat.metalness = g.metalness ?? 0;
    mat.envMapIntensity = g.env ?? 3.2;
    mat.transmission = g.transmission;
    mat.iridescence = g.iridescence;
    mat.attenuationColor.set(g.attenuation ?? "#ffffff");
    mat.attenuationDistance = g.attenuation ? 0.5 : Infinity;
    mat.needsUpdate = true;
  }, [mat, stone]);
  return mat;
}

/* --------------------------------------------------------------------------
   Geometry
   -------------------------------------------------------------------------- */

// Round brilliant proportions (girdle radius = 1): 57% table, ~16% crown, ~43% pavilion.
// A lathe with 16 radial segments and flat normals reads as a cut stone.
function brilliantGeometry(segments = 16) {
  const profile = [
    [0.001, -0.86],
    [0.46, -0.48],
    [1, 0],
    [1, 0.045],
    [0.8, 0.2],
    [0.57, 0.34],
    [0.001, 0.34],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(profile, segments).toNonIndexed();
  g.computeVertexNormals();
  return g;
}

const UP = new THREE.Vector3(0, 1, 0);

function Capsule({ from, to, radius, material }: { from: THREE.Vector3; to: THREE.Vector3; radius: number; material: THREE.Material }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = to.clone().sub(from);
    return {
      length: dir.length(),
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <capsuleGeometry args={[radius, length, 4, 10]} />
    </mesh>
  );
}

/** Instanced stones, each placed at a point with its table facing `normal`. */
function StoneRow({
  points,
  size,
  material,
  segments = 12,
}: {
  points: { p: THREE.Vector3; n: THREE.Vector3 }[];
  size: number;
  material: THREE.Material;
  segments?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => brilliantGeometry(segments), [segments]);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(size, size, size);
    points.forEach(({ p, n }, i) => {
      q.setFromUnitVectors(UP, n);
      m.compose(p, q, s);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [points, size]);
  return <instancedMesh ref={ref} args={[geometry, material, points.length]} />;
}

/* --------------------------------------------------------------------------
   Pieces
   -------------------------------------------------------------------------- */

type PieceProps = { metal: MetalKey; stone: StoneKey; detail?: "high" | "low" };

export function Ring({ metal, stone, detail = "high" }: PieceProps) {
  const metalMat = useMetalMaterial(metal);
  const gemMat = useGemMaterial(stone);
  const paveMat = useGemMaterial("diamond");
  const gem = useMemo(() => brilliantGeometry(detail === "high" ? 16 : 12), [detail]);
  const coloured = stone !== "diamond";

  const prongs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return {
          from: new THREE.Vector3(Math.cos(a) * 0.16, 1.02, Math.sin(a) * 0.16),
          to: new THREE.Vector3(Math.cos(a) * 0.37 * (coloured ? 1.08 : 1), 1.45, Math.sin(a) * 0.37 * (coloured ? 0.82 : 1)),
        };
      }),
    [coloured],
  );

  // Pavé along the shoulders of the band, tables facing outward.
  const pave = useMemo(() => {
    const out: { p: THREE.Vector3; n: THREE.Vector3 }[] = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const t = side * (0.32 + i * 0.085);
        const n = new THREE.Vector3(Math.sin(t), Math.cos(t), 0);
        out.push({ p: n.clone().multiplyScalar(1.072), n });
      }
    }
    return out;
  }, []);

  return (
    <group>
      {/* Band: torus widened along the finger axis for a comfort-fit profile */}
      <mesh material={metalMat} scale={[1, 1, 1.5]}>
        <torusGeometry args={[1, 0.085, detail === "high" ? 40 : 20, detail === "high" ? 220 : 120]} />
      </mesh>
      {/* Gallery rail under the stone */}
      <mesh material={metalMat} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.02, 12, 64]} />
      </mesh>
      {prongs.map((p, i) => (
        <Capsule key={i} from={p.from} to={p.to} radius={0.024} material={metalMat} />
      ))}
      {/* Centre stone: round brilliant, or oval for coloured gems */}
      <mesh geometry={gem} material={gemMat} position={[0, 1.36, 0]} scale={coloured ? [0.42, 0.42, 0.33] : [0.4, 0.4, 0.4]} />
      <StoneRow points={pave} size={0.034} material={paveMat} segments={10} />
    </group>
  );
}

export function Necklace({ metal, stone, detail = "high" }: PieceProps) {
  const metalMat = useMetalMaterial(metal);
  const gemMat = useGemMaterial(stone);
  const gem = useMemo(() => brilliantGeometry(16), []);
  const chainRef = useRef<THREE.InstancedMesh>(null);
  const LINKS = detail === "high" ? 120 : 80;

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.55, 1.9, -0.5),
        new THREE.Vector3(-1.2, 0.6, -0.15),
        new THREE.Vector3(-0.55, -0.42, 0.1),
        new THREE.Vector3(0, -0.68, 0.16),
        new THREE.Vector3(0.55, -0.42, 0.1),
        new THREE.Vector3(1.2, 0.6, -0.15),
        new THREE.Vector3(1.55, 1.9, -0.5),
      ]),
    [],
  );

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const twist = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < LINKS; i++) {
      const t = i / (LINKS - 1);
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      // Torus hole faces Z by default; lay the link along the tangent, alternate 90°.
      q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tan);
      twist.setFromAxisAngle(new THREE.Vector3(1, 0, 0), i % 2 ? Math.PI / 2 : 0);
      q.multiply(twist);
      m.compose(p, q, s);
      chainRef.current!.setMatrixAt(i, m);
    }
    chainRef.current!.instanceMatrix.needsUpdate = true;
  }, [curve, LINKS]);

  const coloured = stone !== "diamond";
  const haloMat = useGemMaterial("diamond");
  const halo = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return {
          p: new THREE.Vector3(Math.cos(a) * 0.45, Math.sin(a) * 0.45 * (coloured ? 1.3 : 1), 0.02),
          n: new THREE.Vector3(0, 0, 1),
        };
      }),
    [coloured],
  );
  return (
    <group>
      <instancedMesh ref={chainRef} args={[undefined, metalMat, LINKS]}>
        <torusGeometry args={[0.032, 0.009, 6, 14]} />
      </instancedMesh>
      <group position={[0, -1.18, 0.18]}>
        {/* Bail */}
        <mesh material={metalMat} position={[0, 0.47, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.07, 0.018, 12, 32]} />
        </mesh>
        {/* Bezel */}
        <mesh material={metalMat} scale={coloured ? [1, 1.3, 1] : 1}>
          <torusGeometry args={[0.36, 0.035, 16, 64]} />
        </mesh>
        <mesh geometry={gem} material={gemMat} rotation={[Math.PI / 2, 0, 0]} scale={coloured ? [0.34, 0.34, 0.44] : 0.35} />
        {/* Halo of small diamonds around the bezel */}
        <StoneRow size={0.035} material={haloMat} segments={10} points={halo} />
      </group>
    </group>
  );
}

function Drop({ metalMat, gemMat, coloured }: { metalMat: THREE.Material; gemMat: THREE.Material; coloured: boolean }) {
  const gem = useMemo(() => brilliantGeometry(16), []);
  const small = useMemo(() => brilliantGeometry(12), []);
  return (
    <group>
      {/* Ear wire */}
      <mesh material={metalMat} position={[0, 1.12, -0.12]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.2, 0.016, 10, 48, Math.PI * 1.25]} />
      </mesh>
      {/* Top stone in a bezel */}
      <mesh material={metalMat} position={[0, 0.9, 0]}>
        <torusGeometry args={[0.13, 0.022, 12, 40]} />
      </mesh>
      <mesh geometry={small} material={gemMat} position={[0, 0.9, 0.01]} rotation={[Math.PI / 2, 0, 0]} scale={0.12} />
      {/* Link */}
      <mesh material={metalMat} position={[0, 0.66, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.07, 0.016, 10, 28]} />
      </mesh>
      {/* Pear-like drop: an elongated brilliant in a bezel */}
      <group position={[0, 0.12, 0]}>
        <mesh material={metalMat} scale={[1, 1.45, 1]}>
          <torusGeometry args={[0.3, 0.03, 14, 56]} />
        </mesh>
        <mesh geometry={gem} material={gemMat} rotation={[Math.PI / 2, 0, 0]} scale={[0.29, 0.3, coloured ? 0.42 : 0.43]} />
      </group>
    </group>
  );
}

export function Earrings({ metal, stone }: PieceProps) {
  const metalMat = useMetalMaterial(metal);
  const gemMat = useGemMaterial(stone);
  const coloured = stone !== "diamond";
  return (
    <group>
      <group position={[-0.62, 0, 0]} rotation={[0, 0.35, 0.05]}>
        <Drop metalMat={metalMat} gemMat={gemMat} coloured={coloured} />
      </group>
      <group position={[0.62, -0.18, -0.2]} rotation={[0, -0.35, -0.05]}>
        <Drop metalMat={metalMat} gemMat={gemMat} coloured={coloured} />
      </group>
    </group>
  );
}

export function Bracelet({ metal, stone }: PieceProps) {
  const metalMat = useMetalMaterial(metal);
  const gemMat = useGemMaterial(stone);
  const cupRef = useRef<THREE.InstancedMesh>(null);
  const COUNT = 34;
  const R = 1.25;

  const points = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const a = (i / COUNT) * Math.PI * 2;
        const n = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
        return { p: n.clone().multiplyScalar(R + 0.07), n };
      }),
    [],
  );

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(1, 1, 1);
    points.forEach(({ n }, i) => {
      q.setFromUnitVectors(UP, n);
      m.compose(n.clone().multiplyScalar(R + 0.03), q, s);
      cupRef.current!.setMatrixAt(i, m);
    });
    cupRef.current!.instanceMatrix.needsUpdate = true;
  }, [points]);

  return (
    <group rotation={[0.62, 0, 0.1]}>
      <mesh material={metalMat} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 2.6]}>
        <torusGeometry args={[R, 0.03, 12, 160]} />
      </mesh>
      <instancedMesh ref={cupRef} args={[undefined, metalMat, COUNT]}>
        <cylinderGeometry args={[0.125, 0.1, 0.08, 16]} />
      </instancedMesh>
      <StoneRow points={points} size={0.118} material={gemMat} segments={12} />
    </group>
  );
}

export function Piece({ kind, ...rest }: PieceProps & { kind: PieceKind }) {
  if (kind === "necklace") return <Necklace {...rest} />;
  if (kind === "earrings") return <Earrings {...rest} />;
  if (kind === "bracelet") return <Bracelet {...rest} />;
  return <Ring {...rest} />;
}
