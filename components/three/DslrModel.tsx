"use client";

import { useGLTF } from "@react-three/drei";
import { Component, forwardRef, useLayoutEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { DslrCamera, LCD } from "./DslrCamera";

/** Rear-screen rectangle in the camera's local space. The screen faces -Z (the camera's back). */
export type ScreenRect = { x: number; y: number; z: number; width: number; height: number };

export const PROCEDURAL_SCREEN: ScreenRect = LCD;

export type CameraModelConfig = {
  src: string;
  /** Euler rotation that turns the file so the lens points +Z and the top is +Y. */
  rotation?: [number, number, number];
  /** Name (or part of a name) of the mesh or material that is the rear LCD. */
  screenMesh?: string;
  /** Manual screen rect (after normalisation), if the file has no usable screen mesh. */
  screenRect?: ScreenRect;
};

type BodyProps = {
  screen: THREE.Texture | null;
  screenTone: string;
  onRect: (r: ScreenRect) => void;
};

const BODY_WIDTH = 3; // matches the procedural camera so framing and zoom stay the same

/** Finds the rear LCD: by name if given, else the largest flat-ish mesh on the back face. */
function findScreen(root: THREE.Object3D, hint?: string, back = -Infinity): THREE.Mesh | null {
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  const matches = (m: THREE.Mesh, re: RegExp) => {
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    return re.test(m.name) || mats.some((x) => re.test(x?.name ?? ""));
  };
  if (hint) {
    const byHint = meshes.find((m) => matches(m, new RegExp(hint, "i")));
    if (byHint) return byHint;
  }
  const named = meshes.filter((m) => matches(m, /screen|lcd|display|monitor/i));
  const pool = named.length ? named : meshes;
  let best: THREE.Mesh | null = null;
  let bestScore = 0;
  const box = new THREE.Box3();
  const size = new THREE.Vector3();
  for (const m of pool) {
    box.setFromObject(m);
    box.getSize(size);
    const flat = size.z < Math.min(size.x, size.y) * 0.25;
    const onBack = box.min.z <= back + 0.25;
    const area = size.x * size.y;
    const score = area * (flat ? 1 : 0.1) * (onBack ? 1 : 0.2);
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return best;
}

/** A real GLB camera, normalised to the site's framing, with our screen layered on its LCD. */
const GlbCamera = forwardRef<THREE.Group, BodyProps & { config: CameraModelConfig }>(function GlbCamera(
  { config, screen, screenTone, onRect },
  ref,
) {
  const gltf = useGLTF(config.src, false, true);

  const { object, rect } = useMemo(() => {
    const root = gltf.scene.clone(true);
    if (config.rotation) root.rotation.set(...config.rotation);
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.updateMatrixWorld(true);

    // Centre and scale so the body is BODY_WIDTH wide.
    const box = new THREE.Box3().setFromObject(wrapper);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = BODY_WIDTH / size.x;
    root.position.sub(center);
    wrapper.scale.setScalar(s);
    wrapper.updateMatrixWorld(true);

    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = false;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) if ("envMapIntensity" in mat) (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
    });

    let r: ScreenRect | undefined = config.screenRect;
    if (!r) {
      const full = new THREE.Box3().setFromObject(wrapper);
      const mesh = findScreen(wrapper, config.screenMesh, full.min.z);
      if (mesh) {
        const b = new THREE.Box3().setFromObject(mesh);
        const c = b.getCenter(new THREE.Vector3());
        const sz = b.getSize(new THREE.Vector3());
        r = { x: c.x, y: c.y, z: b.min.z - 0.004, width: sz.x * 0.98, height: sz.y * 0.98 };
      }
    }
    // Last resort: a 3:2 screen on the back, slightly right of centre (like most DSLRs from behind).
    if (!r) {
      const full = new THREE.Box3().setFromObject(wrapper);
      const fs = full.getSize(new THREE.Vector3());
      r = { x: fs.x * 0.08, y: -fs.y * 0.08, z: full.min.z - 0.004, width: fs.x * 0.6, height: fs.x * 0.4 };
    }
    return { object: wrapper, rect: r };
  }, [gltf.scene, config]);

  useLayoutEffect(() => onRect(rect), [rect, onRect]);

  return (
    <group ref={ref}>
      <primitive object={object} />
      <ScreenLayer rect={rect} screen={screen} tone={screenTone} />
    </group>
  );
});

/** Our image on the LCD: background tone, the work image, and a cover glass. */
function ScreenLayer({ rect, screen, tone }: { rect: ScreenRect; screen: THREE.Texture | null; tone: string }) {
  const bg = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const img = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true }), []);
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#000", roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.18, envMapIntensity: 1.5 }),
    [],
  );
  useLayoutEffect(() => {
    bg.color.set(tone);
    img.map = screen;
    img.opacity = screen ? 1 : 0;
    img.needsUpdate = true;
  }, [bg, img, screen, tone]);
  return (
    <group position={[rect.x, rect.y, rect.z]} rotation={[0, Math.PI, 0]}>
      <mesh material={bg}>
        <planeGeometry args={[rect.width, rect.height]} />
      </mesh>
      <mesh material={img} position={[0, 0, 0.001]}>
        <planeGeometry args={[rect.width, rect.height]} />
      </mesh>
      <mesh name="lcd-glass" material={glass} position={[0, 0, 0.002]}>
        <planeGeometry args={[rect.width, rect.height]} />
      </mesh>
    </group>
  );
}

/** If the GLB fails to load or parse, fall back to the procedural camera. */
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.warn("Camera model failed to load, using the built-in camera.", e);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** The hero camera: the real GLB when configured, otherwise the built-in procedural DSLR. */
export const CameraBody = forwardRef<THREE.Group, BodyProps & { config: CameraModelConfig | null }>(function CameraBody(
  { config, ...props },
  ref,
) {
  const procedural = <ProceduralBody ref={ref} {...props} />;
  if (!config) return procedural;
  return (
    <ModelBoundary fallback={procedural}>
      <GlbCamera ref={ref} config={config} {...props} />
    </ModelBoundary>
  );
});

const ProceduralBody = forwardRef<THREE.Group, BodyProps>(function ProceduralBody({ screen, screenTone, onRect }, ref) {
  useLayoutEffect(() => onRect(PROCEDURAL_SCREEN), [onRect]);
  return <DslrCamera ref={ref} screen={screen} screenColor={screenTone} />;
});
