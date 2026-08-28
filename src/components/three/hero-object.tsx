"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const COUNT = 22000;
const BG_COUNT = 3500;

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

// Timeline for the shatter/reform loop: hold assembled, blow apart, hold
// scattered, pull back together, repeat.
function shatterProgress(time: number) {
  const cycle = 22;
  const p = (time % cycle) / cycle;
  if (p < 0.6) return 0; // assembled, held
  if (p < 0.72) return smoothstep((p - 0.6) / 0.12); // blow apart
  if (p < 0.82) return 1; // dispersed, brief
  return 1 - smoothstep((p - 0.82) / 0.18); // pull back together
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

    let minY = Infinity;
    let maxY = -Infinity;
    const pts: THREE.Vector3[] = [];
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
      const dist = 1.4 + hashUnit(i) * 3.2;
      scatter.set(
        [
          pt.x + dir.x * dist + (hashUnit(i * 2.1) - 0.5),
          pt.y + dir.y * dist + (hashUnit(i * 3.7) - 0.5),
          pt.z + dir.z * dist + (hashUnit(i * 5.3) - 0.5) * 2,
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
    m.uniforms.uTime.value = t;
    m.uniforms.uProgress.value = shatterProgress(t);
    pts.rotation.y = Math.sin(t * 0.3) * 0.45 + state.pointer.x * 0.3;
    pts.rotation.x = THREE.MathUtils.lerp(
      pts.rotation.x,
      state.pointer.y * 0.2,
      0.04,
    );
  });

  return (
    <points ref={points}>
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
        uniforms={{ uTime: { value: 0 }, uProgress: { value: 0 } }}
        vertexShader={`
          attribute vec3 aScatter;
          attribute vec3 aColor;
          attribute float aSeed;
          uniform float uTime;
          uniform float uProgress;
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
            vAlpha = mix(1.0, 0.55, uProgress);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (28.0 / -mv.z) * (0.7 + 0.6 * sin(uTime + aSeed));
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

function BackdropField() {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(BG_COUNT * 3);
    const colors = new Float32Array(BG_COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < BG_COUNT; i++) {
      positions.set(
        [
          (hashUnit(i * 1.7) - 0.5) * 60,
          (hashUnit(i * 2.9) - 0.5) * 40,
          -8 - hashUnit(i * 4.1) * 40,
        ],
        i * 3,
      );
      c.copy(LOW).lerp(HIGH, hashUnit(i * 6.7));
      c.multiplyScalar(0.4 + hashUnit(i * 8.3) * 0.5);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    const pts = points.current;
    if (!pts) return;
    pts.rotation.y += delta * 0.015;
    pts.position.y = (pts.position.y - delta * 0.4) % 8;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
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

export default function HeroObject() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.6]}>
      <BackdropField />
      <ParticleV />
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={0.9}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.35}
        />
      </EffectComposer>
    </Canvas>
  );
}
