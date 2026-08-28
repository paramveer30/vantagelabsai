"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Canvas, useFrame } from "@react-three/fiber";
import { gradient, hashUnit, smoothstep } from "./util";

const COUNT = 24000;

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

function vGeometry() {
  return new THREE.ExtrudeGeometry(vShape(), {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 1,
  }).center();
}

// A blocky desktop computer: screen slab, neck, base. Sampled by surface
// area so the big screen faces get the most particles.
function computerGeometry() {
  const screen = new THREE.BoxGeometry(4.6, 3.0, 0.22);
  screen.translate(0, 0.2, 0);
  const inner = new THREE.BoxGeometry(4.0, 2.4, 0.24); // denser screen face
  inner.translate(0, 0.2, 0.02);
  const neck = new THREE.BoxGeometry(0.5, 0.55, 0.35);
  neck.translate(0, -1.55, 0);
  const foot = new THREE.BoxGeometry(2.0, 0.2, 0.9);
  foot.translate(0, -1.9, 0);
  const merged = mergeGeometries([screen, inner, neck, foot]);
  return merged ?? screen;
}

function sample(geo: THREE.BufferGeometry, out: Float32Array) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();
  const p = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    sampler.sample(p);
    out.set([p.x, p.y, p.z], i * 3);
  }
}

function useParticleData() {
  return useMemo(() => {
    const base = new Float32Array(COUNT * 3);
    const computer = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3);
    const color = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);

    sample(vGeometry(), base);
    sample(computerGeometry(), computer);

    const c = new THREE.Color();
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < COUNT; i++) {
      minY = Math.min(minY, base[i * 3 + 1]);
      maxY = Math.max(maxY, base[i * 3 + 1]);
    }

    for (let i = 0; i < COUNT; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z = base[i * 3 + 2];
      const len = Math.hypot(x, y, z) || 1;
      const dist = 2.6 + hashUnit(i) * 6;
      scatter.set(
        [
          x + (x / len) * dist + (hashUnit(i * 2.1) - 0.5) * 2,
          y + (y / len) * dist + (hashUnit(i * 3.7) - 0.5) * 2,
          z + (z / len) * dist + (hashUnit(i * 5.3) - 0.5) * 3.5,
        ],
        i * 3,
      );

      gradient((y - minY) / (maxY - minY), c);
      c.multiplyScalar(0.8 + hashUnit(i * 7.9) * 0.5);
      color.set([c.r, c.g, c.b], i * 3);
      seed[i] = hashUnit(i * 11.3) * 6.283;
    }

    return { base, computer, scatter, color, seed };
  }, []);
}

function Cloud({ progressRef }: { progressRef: RefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const scrub = useRef(0);
  const { base, computer, scatter, color, seed } = useParticleData();

  useFrame((_, delta) => {
    const m = mat.current;
    const pts = points.current;
    if (!m || !pts) return;

    const t = m.uniforms.uTime.value + delta;
    m.uniforms.uTime.value = t;

    scrub.current += (progressRef.current - scrub.current) * 0.12;
    const p = scrub.current;

    const travel = smoothstep((p - 0.12) / 0.32);
    const burst = smoothstep((p - 0.3) / 0.2);
    const form = smoothstep((p - 0.5) / 0.3);
    const explode = burst * (1 - form);

    pts.position.x = -1.7 * (1 - travel);
    pts.position.y = -Math.sin(Math.min(travel, 1) * Math.PI) * 0.9 * (1 - form);
    pts.scale.setScalar(1.1 + travel * 0.26 + form * 0.14);

    const sway = Math.sin(t * 0.3) * 0.35 + travel * Math.PI * 2.4 + explode * t * 0.3;
    pts.rotation.y = THREE.MathUtils.lerp(sway, 0, form);
    pts.rotation.z = THREE.MathUtils.lerp(
      travel * 0.3 * Math.sin(t * 0.6) + explode * 0.4,
      0,
      form,
    );

    m.uniforms.uExplode.value = explode;
    m.uniforms.uForm.value = form;
    m.uniforms.uFade.value = 1 - explode * 0.3;
  });

  return (
    <points ref={points} scale={1.1} position={[-1.7, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base, 3]} />
        <bufferAttribute attach="attributes-aComputer" args={[computer, 3]} />
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
          uExplode: { value: 0 },
          uForm: { value: 0 },
          uFade: { value: 1 },
        }}
        vertexShader={`
          attribute vec3 aComputer;
          attribute vec3 aScatter;
          attribute vec3 aColor;
          attribute float aSeed;
          uniform float uTime;
          uniform float uExplode;
          uniform float uForm;
          uniform float uFade;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = aColor;
            vec3 vpos = mix(position, aScatter, uExplode);
            vec3 pos = mix(vpos, aComputer, uForm);
            pos += 0.04 * (1.0 - uForm * 0.7) * vec3(
              sin(uTime * 0.8 + aSeed),
              cos(uTime * 0.7 + aSeed * 1.3),
              sin(uTime * 0.6 + aSeed * 0.7)
            );
            vAlpha = uFade * mix(1.0, 0.5, uExplode);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float twinkle = 0.75 + 0.55 * sin(uTime + aSeed);
            gl_PointSize = (34.0 / -mv.z) * twinkle * (1.0 + uExplode * 0.6) * (1.0 - uForm * 0.35);
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

export default function VCloud({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.6]}>
      <Cloud progressRef={progressRef} />
    </Canvas>
  );
}
