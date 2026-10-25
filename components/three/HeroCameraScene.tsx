"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { cameraModel } from "@/lib/site";
import { CameraBody, PROCEDURAL_SCREEN, type ScreenRect } from "./DslrModel";
import { StudioLights } from "./StudioLights";

const TAU = Math.PI * 2;
const START_YAW = -0.55; // front three-quarter view
const INTRO_SECONDS = 2.8;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const range = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Scale/offset a texture so it is "contained" or "covers" a plane of the given aspect. */
function fitTexture(tex: THREE.Texture, planeAspect: number, mode: "contain" | "cover", pad = 0.86) {
  const img = tex.image as { width: number; height: number } | undefined;
  if (!img?.width) return;
  const imgAspect = img.width / img.height;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  const r = planeAspect / imgAspect;
  // "contain" leaves a margin (pad) so the frame matches the playback display's layout.
  const k = mode === "contain" ? 1 / pad : 1;
  if ((mode === "contain") === r > 1) {
    tex.repeat.set(r * k, k);
  } else {
    tex.repeat.set(k, (1 / r) * k);
  }
  tex.offset.set((1 - tex.repeat.x) / 2, (1 - tex.repeat.y) / 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
}

/** Loads the LCD image; if the remote photo fails (offline, CORS), uses the local render instead. */
function useScreenTexture(src: string, fallback: string) {
  const [state, setState] = useState<{ texture: THREE.Texture; fallback: boolean } | null>(null);
  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const done = (isFallback: boolean) => (t: THREE.Texture) => {
      if (alive) setState({ texture: t, fallback: isFallback });
      else t.dispose();
    };
    loader.load(src, done(false), undefined, () => {
      if (src !== fallback) loader.load(fallback, done(true));
    });
    return () => {
      alive = false;
    };
  }, [src, fallback]);
  return state;
}

type RigProps = {
  progress: MotionValue<number>;
  reduced: boolean;
  drag: React.RefObject<number>;
  onOpen: () => void;
  screenSrc: string;
  screenFallback: string;
  screenTone: string;
  screenFit: "contain" | "cover";
};

function Rig({ progress, reduced, drag, screenSrc, screenFallback, screenTone, screenFit }: RigProps) {
  const dslr = useRef<THREE.Group>(null);
  const holder = useRef<THREE.Group>(null);
  const marker = useMemo(() => new THREE.Object3D(), []);
  const { camera, size } = useThree();
  const cam = camera as THREE.PerspectiveCamera;

  // The screen rectangle comes from whichever camera is mounted (real GLB or built-in).
  const [rect, setRect] = useState<ScreenRect>(PROCEDURAL_SCREEN);
  const onRect = useCallback((r: ScreenRect) => setRect(r), []);

  const screen = useScreenTexture(screenSrc, screenFallback);
  useEffect(() => {
    if (screen) fitTexture(screen.texture, rect.width / rect.height, screen.fallback ? "contain" : screenFit);
  }, [screen, screenFit, rect]);

  const s = useRef({ intro: reduced ? 1 : 0, idle: 0, frozen: null as null | { from: number; to: number } });
  const tmp = useMemo(
    () => ({ lcd: new THREE.Vector3(), home: new THREE.Vector3(), target: new THREE.Vector3(), look: new THREE.Vector3(), lookHome: new THREE.Vector3() }),
    [],
  );

  // Marker sits on the LCD surface; its world position is where we fly to.
  useEffect(() => {
    marker.position.set(rect.x, rect.y, rect.z - 0.01);
    dslr.current?.add(marker);
  }, [marker, rect]);

  useFrame((state, dt) => {
    const st = s.current;
    const p = progress.get();
    const mobile = size.width < 900;
    const turn = easeInOut(range(p, 0.03, 0.36));
    const dolly = easeInOut(range(p, 0.2, 0.6));

    // 1) Yaw: one full 360° on load, then a slow turntable (plus drag), then ease to back-facing.
    st.intro = Math.min(1, st.intro + dt / INTRO_SECONDS);
    if (st.intro >= 1 && turn === 0) {
      st.idle += (reduced ? 0 : dt * 0.22) + (drag.current ?? 0);
    }
    if (drag.current) drag.current *= 0.9; // inertia
    let yaw = START_YAW + st.idle - TAU * (1 - easeInOut(st.intro));
    if (turn > 0) {
      if (!st.frozen) {
        const to = Math.PI + TAU * Math.round((yaw - Math.PI) / TAU);
        st.frozen = { from: yaw, to };
      }
      yaw = THREE.MathUtils.lerp(st.frozen.from, st.frozen.to, turn);
    } else {
      st.frozen = null;
    }

    const g = dslr.current!;
    // Fade the LCD's cover-glass reflection as we approach, so the work reads clean.
    const glass = g.getObjectByName("lcd-glass") as THREE.Mesh | undefined;
    if (glass) (glass.material as THREE.MeshPhysicalMaterial).opacity = 0.18 * (1 - dolly);
    const h = holder.current!;
    const settle = 1 - turn;
    const t = state.clock.elapsedTime;
    g.rotation.y = yaw;
    g.rotation.x = 0.16 * settle + (reduced ? 0 : -state.pointer.y * 0.06 * settle);
    g.rotation.z = reduced ? 0 : state.pointer.x * -0.04 * settle;

    // 2) Placement: off-centre on desktop (headline on the left), centred on mobile; drifts to centre as it turns.
    const scale = mobile ? 0.52 : 0.82;
    const introRise = easeOut(Math.min(1, st.intro * 1.6));
    h.scale.setScalar(scale * (0.85 + 0.15 * introRise));
    h.position.x = (mobile ? 0 : 1.5) * settle;
    h.position.y = ((mobile ? -0.35 : 0.3) + Math.sin(t * 0.9) * 0.05 - (1 - introRise) * 0.6) * settle;

    // 3) Camera dolly into the LCD so the screen covers the viewport.
    h.updateMatrixWorld(true);
    marker.getWorldPosition(tmp.lcd);
    const aspect = size.width / size.height;
    const endFov = 24;
    const lcdW = rect.width * scale;
    const lcdH = rect.height * scale;
    const visibleH = Math.min(lcdH, lcdW / aspect) * 0.97;
    const dist = visibleH / (2 * Math.tan(THREE.MathUtils.degToRad(endFov / 2)));
    tmp.home.set(0, 0.35, mobile ? 11.5 : 10);
    tmp.lookHome.set(0, 0, 0);
    tmp.target.set(tmp.lcd.x, tmp.lcd.y, tmp.lcd.z + dist);
    cam.position.lerpVectors(tmp.home, tmp.target, dolly);
    tmp.look.lerpVectors(tmp.lookHome, tmp.lcd, dolly);
    cam.lookAt(tmp.look);
    const fov = THREE.MathUtils.lerp(30, endFov, dolly);
    if (Math.abs(cam.fov - fov) > 1e-3) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return (
    <group ref={holder}>
      <CameraBody ref={dslr} config={cameraModel} screen={screen?.texture ?? null} screenTone={screenTone} onRect={onRect} />
    </group>
  );
}

type Props = Omit<RigProps, "reduced" | "drag">;

export default function HeroCameraScene(props: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    // Stop rendering once the display has fully covered the camera.
    const unsub = props.progress.on("change", (p) => setActive(p < 0.72));
    return () => {
      io.disconnect();
      unsub();
    };
  }, [props.progress]);

  // Horizontal drag spins the camera (vertical movement is left to page scroll).
  // A tap/click anywhere on the stage, without dragging, opens the screen.
  const onOpen = useRef(props.onOpen);
  onOpen.current = props.onOpen;
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let x: number | null = null;
    let travel = 0;
    const down = (e: PointerEvent) => {
      x = e.clientX;
      travel = 0;
    };
    const move = (e: PointerEvent) => {
      if (x === null) return;
      travel += Math.abs(e.clientX - x);
      drag.current = (e.clientX - x) * 0.012;
      x = e.clientX;
    };
    const up = () => {
      if (x !== null && travel < 6 && props.progress.get() < 0.05) onOpen.current();
      x = null;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
  }, [props.progress]);

  return (
    <div ref={wrap} className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" aria-hidden>
      <Canvas
        frameloop={visible && active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 10], fov: 30, near: 0.05, far: 60 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <StudioLights />
        <Suspense fallback={null}>
          <Rig {...props} reduced={reduced} drag={drag} />
        </Suspense>
        <ContactShadows position={[0, -1.6, 0]} opacity={0.55} scale={12} blur={2.8} far={3} resolution={256} color="#000000" />
        {!reduced && <Sparkles count={40} scale={[10, 5, 4]} size={2} speed={0.2} opacity={0.5} color="#f3dcae" />}
      </Canvas>
    </div>
  );
}
