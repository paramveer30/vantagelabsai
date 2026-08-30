"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CAMERA, DPR, gradient, hashUnit, smoothstep } from "./util";
import type { ServiceVariant } from "@/content/services";

// One small particle field per service, sharing the hero's look: the
// blue→cyan gradient, additive points, a cursor that parts the field.
// Each particle knows a "formed" target and a scattered position; the
// scene gathers out of the loose cloud on mount, then keeps a slow life of
// its own — a breathing sway for software, a pulse for AI, an orbiting
// satellite for support.
//
// Targets are built procedurally rather than sampled off meshes: the
// shapes are simple enough that it's lighter and easier to tune than
// pulling MeshSurfaceSampler in for three tiny canvases.

const COUNT = 5200;

type Buffers = {
  position: Float32Array; // formed target
  scatter: Float32Array; // loose-cloud position it gathers from
  color: Float32Array;
  seed: Float32Array; // per-particle randomness for drift/shimmer
  phase: Float32Array; // 0..1 position along the pulse / orbit
};

// Spread a formed target outward into a loose shell so uForm 0→1 reads as
// the shape gathering itself. Kept fairly tight so it lands quickly.
function scatterFrom(x: number, y: number, z: number, i: number) {
  const len = Math.hypot(x, y, z) || 1;
  const dist = 0.9 + hashUnit(i * 1.7) * 1.5;
  return [
    x + (x / len) * dist + (hashUnit(i * 2.3) - 0.5) * 1.1,
    y + (y / len) * dist + (hashUnit(i * 3.9) - 0.5) * 1.1,
    z + (z / len) * dist + (hashUnit(i * 5.1) - 0.5) * 1.6,
  ];
}

function paint(t: number, i: number, color: Float32Array) {
  const c = new THREE.Color();
  gradient(THREE.MathUtils.clamp(t, 0, 1), c);
  c.multiplyScalar(0.85 + hashUnit(i * 7.7) * 0.4);
  color.set([c.r, c.g, c.b], i * 3);
}

// A browser window: a bright outline, a title bar with three dots, and a
// few content lines. Weighted so the frame stays crisp.
function buildSoftware(): Buffers {
  const position = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const color = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);

  const w = 2.6;
  const h = 1.9;
  const lines = [
    { y: 0.34, x0: -w / 2 + 0.26, x1: w / 2 - 0.55 },
    { y: 0.02, x0: -w / 2 + 0.26, x1: w / 2 - 0.22 },
    { y: -0.3, x0: -w / 2 + 0.26, x1: w / 2 - 1.0 },
  ];

  for (let i = 0; i < COUNT; i++) {
    const r = hashUnit(i * 12.9);
    let x: number;
    let y: number;
    if (r < 0.52) {
      // frame outline
      const edge = Math.floor(hashUnit(i * 4.4) * 4);
      const u = hashUnit(i * 9.1);
      if (edge === 0) [x, y] = [THREE.MathUtils.lerp(-w / 2, w / 2, u), h / 2];
      else if (edge === 1)
        [x, y] = [THREE.MathUtils.lerp(-w / 2, w / 2, u), -h / 2];
      else if (edge === 2)
        [x, y] = [-w / 2, THREE.MathUtils.lerp(-h / 2, h / 2, u)];
      else [x, y] = [w / 2, THREE.MathUtils.lerp(-h / 2, h / 2, u)];
    } else if (r < 0.64) {
      // title bar
      x = THREE.MathUtils.lerp(-w / 2, w / 2, hashUnit(i * 6.3));
      y = h / 2 - 0.14 - hashUnit(i * 8.8) * 0.2;
    } else if (r < 0.71) {
      // three window dots
      const k = Math.floor(hashUnit(i * 3.3) * 3);
      x = -w / 2 + 0.28 + k * 0.26 + (hashUnit(i * 2.7) - 0.5) * 0.09;
      y = h / 2 - 0.24 + (hashUnit(i * 5.9) - 0.5) * 0.09;
    } else {
      // content lines
      const ln = lines[Math.floor(hashUnit(i * 7.1) * lines.length)];
      x = THREE.MathUtils.lerp(ln.x0, ln.x1, hashUnit(i * 10.7));
      y = ln.y + (hashUnit(i * 11.5) - 0.5) * 0.045;
    }
    const z = (hashUnit(i * 13.7) - 0.5) * 0.08;

    position.set([x, y, z], i * 3);
    scatter.set(scatterFrom(x, y, z, i), i * 3);
    paint((y + h / 2) / h, i, color);
    seed[i] = hashUnit(i * 14.9) * 6.283;
    phase[i] = hashUnit(i * 2.1);
  }
  return { position, scatter, color, seed, phase };
}

// A hub with outer nodes; particles cluster at nodes and string along the
// edges between them. phase drives a pulse that travels hub → rim.
function buildAi(): Buffers {
  const position = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const color = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);

  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [1.3, 0.35, 0.15],
    [-1.2, 0.62, -0.2],
    [0.55, 1.2, 0.25],
    [-0.62, -1.1, 0.3],
    [0.85, -0.95, -0.25],
    [-1.25, -0.18, 0.35],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 3],
    [4, 5],
  ];
  const nodePhase = nodes.map((n) => Math.hypot(n[0], n[1], n[2]) / 1.6);

  for (let i = 0; i < COUNT; i++) {
    let x: number;
    let y: number;
    let z: number;
    let ph: number;
    if (hashUnit(i * 3.7) < 0.5) {
      // blob around a node
      const ni = Math.floor(hashUnit(i * 8.1) * nodes.length);
      const n = nodes[ni];
      const s = ni === 0 ? 0.16 : 0.11;
      x = n[0] + (hashUnit(i * 2.3) - 0.5) * s * 2;
      y = n[1] + (hashUnit(i * 4.9) - 0.5) * s * 2;
      z = n[2] + (hashUnit(i * 6.7) - 0.5) * s * 2;
      ph = nodePhase[ni];
    } else {
      // strung along an edge
      const e = edges[Math.floor(hashUnit(i * 5.5) * edges.length)];
      const a = nodes[e[0]];
      const b = nodes[e[1]];
      const tt = hashUnit(i * 9.9);
      x = THREE.MathUtils.lerp(a[0], b[0], tt) + (hashUnit(i * 1.9) - 0.5) * 0.04;
      y = THREE.MathUtils.lerp(a[1], b[1], tt) + (hashUnit(i * 3.1) - 0.5) * 0.04;
      z = THREE.MathUtils.lerp(a[2], b[2], tt) + (hashUnit(i * 7.3) - 0.5) * 0.04;
      ph = THREE.MathUtils.lerp(nodePhase[e[0]], nodePhase[e[1]], tt);
    }

    position.set([x, y, z], i * 3);
    scatter.set(scatterFrom(x, y, z, i), i * 3);
    paint(ph, i, color);
    seed[i] = hashUnit(i * 14.9) * 6.283;
    phase[i] = ph;
  }
  return { position, scatter, color, seed, phase };
}

// A torus ring with a small core at its centre; phase is the angle round
// the ring so a bright "satellite" can sweep it.
function buildSupport(): Buffers {
  const position = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const color = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);

  const R = 1.35;
  const r = 0.11;

  for (let i = 0; i < COUNT; i++) {
    let x: number;
    let y: number;
    let z: number;
    let ph: number;
    if (hashUnit(i * 3.7) < 0.14) {
      // the core being kept running
      const s = 0.2;
      x = (hashUnit(i * 2.3) - 0.5) * s;
      y = (hashUnit(i * 4.9) - 0.5) * s;
      z = (hashUnit(i * 6.7) - 0.5) * s;
      ph = hashUnit(i * 5.2);
    } else {
      const theta = hashUnit(i * 8.1) * Math.PI * 2;
      const pnorm = hashUnit(i * 9.4) * Math.PI * 2;
      x = (R + r * Math.cos(pnorm)) * Math.cos(theta);
      y = (R + r * Math.cos(pnorm)) * Math.sin(theta);
      z = r * Math.sin(pnorm);
      ph = theta / (Math.PI * 2);
    }

    position.set([x, y, z], i * 3);
    scatter.set(scatterFrom(x, y, z, i), i * 3);
    paint(ph, i, color);
    seed[i] = hashUnit(i * 14.9) * 6.283;
    phase[i] = ph;
  }
  return { position, scatter, color, seed, phase };
}

const BUILDERS: Record<ServiceVariant, () => Buffers> = {
  software: buildSoftware,
  ai: buildAi,
  support: buildSupport,
};

const MODE: Record<ServiceVariant, number> = { software: 0, ai: 1, support: 2 };

function Particles({ variant }: { variant: ServiceVariant }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(9, 9));
  const mountAt = useRef(0);
  const canvas = useThree((s) => s.gl.domElement);

  const { position, scatter, color, seed, phase } = useMemo(
    () => BUILDERS[variant](),
    [variant],
  );

  // Cursor in canvas-local NDC. Parked far away when the pointer is
  // outside the canvas so the field only reacts on hover.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      const ny = -((e.clientY - b.top) / b.height) * 2 + 1;
      if (nx < -1.3 || nx > 1.3 || ny < -1.3 || ny > 1.3)
        pointer.current.set(9, 9);
      else pointer.current.set(nx, ny);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [canvas]);

  useFrame((state, delta) => {
    const m = mat.current;
    const g = points.current;
    if (!m || !g) return;
    const t = state.clock.elapsedTime;
    m.uniforms.uTime.value = t;

    // Gather on mount, then hold the shape — the "life" is added by the
    // group transform and the shader glow, never by loosening the form.
    // Timed off the wall clock so it still lands cleanly if the tab was
    // backgrounded and frames were dropped while it mounted.
    if (!mountAt.current) mountAt.current = t;
    const gathered = smoothstep((t - mountAt.current) / 0.9);
    m.uniforms.uForm.value = gathered;
    m.uniforms.uAppear.value = gathered;

    const pr = m.uniforms.uPointer.value as THREE.Vector2;
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 10);
    pr.x += (pointer.current.x - pr.x) * k;
    pr.y += (pointer.current.y - pr.y) * k;
    m.uniforms.uAspect.value = state.size.width / state.size.height;

    if (variant === "software") {
      g.rotation.y = Math.sin(t * 0.45) * 0.2;
      g.rotation.x = Math.sin(t * 0.32) * 0.05;
      g.scale.setScalar(1.05 + Math.sin(t * 0.7) * 0.016);
    } else if (variant === "ai") {
      g.rotation.y = Math.sin(t * 0.28) * 0.16;
      g.rotation.x = 0.1;
    } else {
      g.rotation.x = 0.6;
      g.rotation.z = t * 0.07;
    }
  });

  return (
    <points ref={points} scale={1.05}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[position, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[scatter, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[color, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phase, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uForm: { value: 0 },
          uAppear: { value: 0 },
          uMode: { value: MODE[variant] },
          uPointer: { value: new THREE.Vector2(9, 9) },
          uAspect: { value: 1 },
        }}
        vertexShader={`
          attribute vec3 aScatter;
          attribute vec3 aColor;
          attribute float aSeed;
          attribute float aPhase;
          uniform float uTime;
          uniform float uForm;
          uniform float uAppear;
          uniform int uMode;
          uniform vec2 uPointer;
          uniform float uAspect;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            // Per-variant "life": a travelling pulse for AI, a sweeping
            // satellite for support, a faint shimmer for software.
            float glow;
            if (uMode == 1) {
              glow = pow(0.5 + 0.5 * sin(uTime * 2.0 - aPhase * 12.566), 3.0);
            } else if (uMode == 2) {
              float head = fract(uTime * 0.11);
              float d = abs(fract(aPhase - head + 0.5) - 0.5);
              glow = smoothstep(0.09, 0.0, d);
            } else {
              glow = 0.22 * (0.5 + 0.5 * sin(uTime * 1.5 + aSeed * 5.0));
            }

            // A whisper of drift, scaled right down once formed so the
            // outlines stay crisp.
            vec3 drift = 0.02 * vec3(
              sin(uTime * 0.7 + aSeed),
              cos(uTime * 0.6 + aSeed * 1.3),
              sin(uTime * 0.5 + aSeed * 0.7)
            );
            vec3 pos = mix(aScatter, position, uForm) + drift * (0.35 + 0.65 * (1.0 - uForm));

            vColor = aColor * (1.0 + glow * 1.3);
            vAlpha = uAppear * clamp(0.72 + glow * 0.9, 0.0, 1.7);

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (46.0 / -mv.z) * (0.7 + glow) * mix(0.55, 1.0, uAppear);
            vec4 clip = projectionMatrix * mv;

            // Part the field around the cursor, measured in aspect-
            // corrected space so the opening stays round.
            vec2 sp = clip.xy / clip.w;
            vec2 gap = (sp - uPointer) * vec2(uAspect, 1.0);
            float pd = length(gap);
            float push = smoothstep(0.34, 0.04, pd);
            vec2 dir = gap / (pd + 0.12);
            clip.xy += (dir / vec2(uAspect, 1.0)) * push * clip.w * 0.06;
            gl_PointSize *= 1.0 + push * 1.3;
            vAlpha *= 1.0 + push * 0.5;

            gl_Position = clip;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.28, d);
            float halo = smoothstep(0.5, 0.0, d) * 0.4;
            gl_FragColor = vec4(vColor * (1.0 + core * 0.6), (core + halo) * vAlpha);
          }
        `}
      />
    </points>
  );
}

export default function ServiceScene({ variant }: { variant: ServiceVariant }) {
  return (
    <Canvas camera={CAMERA} dpr={DPR} aria-hidden>
      <Particles variant={variant} />
    </Canvas>
  );
}
