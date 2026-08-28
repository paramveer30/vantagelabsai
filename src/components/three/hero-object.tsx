"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const COUNT = 24000;
const STAR_COUNT = 2600;
const DUST_COUNT = 500;

const LOW = new THREE.Color("#0b4fd6");
const MID = new THREE.Color("#2aa8ee");
const HIGH = new THREE.Color("#7fe4ff");

function gradient(t: number, out: THREE.Color) {
  if (t < 0.5) out.copy(LOW).lerp(MID, t / 0.5);
  else out.copy(MID).lerp(HIGH, (t - 0.5) / 0.5);
}

function hashUnit(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

// Soft round sprite so pointsMaterial doesn't render hard squares.
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

let sharedDot: THREE.Texture | null = null;
function dotTexture() {
  if (!sharedDot) sharedDot = makeDotTexture();
  return sharedDot;
}

// Assembled most of the cycle, a quick blow-apart, a brief hold, then a
// slower pull back together.
function shatterProgress(time: number) {
  const cycle = 22;
  const p = (time % cycle) / cycle;
  if (p < 0.6) return 0;
  if (p < 0.72) return smoothstep((p - 0.6) / 0.12);
  if (p < 0.82) return 1;
  return 1 - smoothstep((p - 0.82) / 0.18);
}

function vShape() {
  const s = new THREE.Shape();
  s.moveTo(-1.1, 1.0);
  s.lineTo(-0.16, -1.0);
  s.lineTo(0.16, -1.0);
  s.lineTo(1.1, 1.0);
  s.lineTo(0.55, 1.0);
  s.lineTo(0.0, -0.34);
  s.lineTo(-0.55, 1.0);
  s.closePath();
  return s;
}

function useParticleData() {
  return useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(vShape(), {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 1,
    }).center();

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();

    const base = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3);
    const color = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);

    const p = new THREE.Vector3();
    const c = new THREE.Color();
    const pts: THREE.Vector3[] = [];
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < COUNT; i++) {
      sampler.sample(p);
      pts.push(p.clone());
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    for (let i = 0; i < COUNT; i++) {
      const pt = pts[i];
      base.set([pt.x, pt.y, pt.z], i * 3);

      const dir = pt.clone().normalize();
      const dist = 2 + hashUnit(i) * 5;
      scatter.set(
        [
          pt.x + dir.x * dist + (hashUnit(i * 2.1) - 0.5) * 1.5,
          pt.y + dir.y * dist + (hashUnit(i * 3.7) - 0.5) * 1.5,
          pt.z + dir.z * dist + (hashUnit(i * 5.3) - 0.5) * 3,
        ],
        i * 3,
      );

      gradient((pt.y - minY) / (maxY - minY), c);
      c.multiplyScalar(0.8 + hashUnit(i * 7.9) * 0.5);
      color.set([c.r, c.g, c.b], i * 3);
      seed[i] = hashUnit(i * 11.3) * 6.283;
    }

    return { base, scatter, color, seed };
  }, []);
}

function ParticleV() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { base, scatter, color, seed } = useParticleData();

  useFrame((state, delta) => {
    const m = mat.current;
    const pts = points.current;
    if (!m || !pts) return;
    const t = m.uniforms.uTime.value + delta;
    const prog = shatterProgress(t);
    m.uniforms.uTime.value = t;
    m.uniforms.uProgress.value = prog;

    // Fade and lift the mark as the hero scrolls away so the rest of the
    // page reads over a calm starfield instead of the full letter.
    const scrolled = typeof window === "undefined" ? 0 : window.scrollY;
    const fade = Math.max(0, Math.min(1, 1 - scrolled / 620));
    m.uniforms.uFade.value += (fade - m.uniforms.uFade.value) * 0.1;

    pts.rotation.y = Math.sin(t * 0.3) * 0.4 + state.pointer.x * 0.3;
    pts.rotation.x = THREE.MathUtils.lerp(
      pts.rotation.x,
      state.pointer.y * 0.18,
      0.04,
    );
    pts.rotation.z = prog * Math.sin(t * 0.8) * 0.5;
    pts.position.y = (1 - m.uniforms.uFade.value) * 2.2;
  });

  return (
    <points ref={points} scale={1.1} position={[-1.7, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[scatter, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[color, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uFade: { value: 1 },
        }}
        vertexShader={`
          attribute vec3 aScatter;
          attribute vec3 aColor;
          attribute float aSeed;
          uniform float uTime;
          uniform float uProgress;
          uniform float uFade;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = aColor;
            vec3 pos = mix(position, aScatter, uProgress);
            pos += 0.04 * vec3(
              sin(uTime * 0.8 + aSeed),
              cos(uTime * 0.7 + aSeed * 1.3),
              sin(uTime * 0.6 + aSeed * 0.7)
            );
            vAlpha = mix(1.0, 0.4, uProgress) * uFade;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float twinkle = 0.7 + 0.6 * sin(uTime + aSeed);
            gl_PointSize = (26.0 / -mv.z) * twinkle * (1.0 + uProgress * 0.6);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.05, d) * vAlpha;
            gl_FragColor = vec4(vColor, a);
          }
        `}
      />
    </points>
  );
}

function StarField() {
  const points = useRef<THREE.Points>(null);
  const map = useMemo(() => dotTexture(), []);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < STAR_COUNT; i++) {
      positions.set(
        [
          (hashUnit(i * 1.7) - 0.5) * 70,
          (hashUnit(i * 2.9) - 0.5) * 48,
          -14 - hashUnit(i * 4.1) * 46,
        ],
        i * 3,
      );
      c.copy(LOW).lerp(HIGH, hashUnit(i * 6.7));
      c.multiplyScalar(0.3 + hashUnit(i * 8.3) * 0.4);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={0.09}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DustField() {
  const points = useRef<THREE.Points>(null);
  const map = useMemo(() => dotTexture(), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      arr.set(
        [
          (hashUnit(i * 3.1) - 0.5) * 24,
          (hashUnit(i * 5.7) - 0.5) * 16,
          -2 - hashUnit(i * 7.3) * 12,
        ],
        i * 3,
      );
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    p.position.y = (state.clock.elapsedTime * 0.15) % 6;
    p.rotation.z += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={0.16}
        sizeAttenuation
        color="#4fb8ff"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroObject() {
  return (
    <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.6]}>
      <StarField />
      <DustField />
      <ParticleV />
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={1}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.4}
        />
      </EffectComposer>
    </Canvas>
  );
}
