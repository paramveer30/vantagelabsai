"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CAMERA, DPR, gradient, hashUnit, smoothstep } from "./util";
import type { Hit } from "./types";

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

function bar(w: number, h: number, x: number, y: number) {
  const g = new THREE.BoxGeometry(w, h, 0.16);
  g.translate(x, y, 0);
  return g.toNonIndexed();
}

// The monitor: thin bezel frame, a stand, and the brand V on the right of
// the screen as the wallpaper. The desktop icons are drawn as real UI on
// top of this (see DesktopNav).
function monitorGeometry() {
  const w = 4.4;
  const h = 2.7;
  const t = 0.14;
  const frame = [
    bar(w, t, 0, h / 2 - t / 2),
    bar(w, t, 0, -h / 2 + t / 2),
    bar(t, h, -w / 2 + t / 2, 0),
    bar(t, h, w / 2 - t / 2, 0),
  ];

  const neck = new THREE.BoxGeometry(0.46, 0.44, 0.3).toNonIndexed();
  neck.translate(0, -h / 2 - 0.3, 0);
  const foot = new THREE.BoxGeometry(1.9, 0.16, 0.85).toNonIndexed();
  foot.translate(0, -h / 2 - 0.56, 0);

  const v = vGeometry();
  v.scale(1, 1, 0.3);
  const vb = new THREE.Box3().setFromBufferAttribute(
    v.attributes.position as THREE.BufferAttribute,
  );
  const s = (h * 0.55) / (vb.max.y - vb.min.y);
  v.scale(s, s, s);
  v.translate(0.95, -0.05, 0.05);

  const merged = mergeGeometries([...frame, neck, foot, v]);
  if (merged) merged.translate(0, 0.34, 0); // centre monitor + stand in view
  return merged ?? v;
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
    sample(monitorGeometry(), computer);

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

function Cloud({
  progressRef,
  hitRef,
}: {
  progressRef: RefObject<number>;
  hitRef?: RefObject<Hit>;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const lastHit = useRef(0);
  const { base, computer, scatter, color, seed } = useParticleData();
  const canvas = useThree((s) => s.gl.domElement);

  // Track the cursor on the window rather than R3F's state.pointer: the
  // hero copy sits in a div above the canvas, so pointer events over the
  // V's right arm never reach R3F and the opening would stick there.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [canvas]);

  useFrame((state, delta) => {
    const m = mat.current;
    const pts = points.current;
    if (!m || !pts) return;

    const t = m.uniforms.uTime.value + delta;
    m.uniforms.uTime.value = t;

    // Follow the cursor (NDC) with time-based easing so the field parts
    // around it at the same rate on a 60Hz or a 120Hz display.
    const pr = m.uniforms.uPointer.value as THREE.Vector2;
    const k = 1 - Math.exp(-delta * 9);
    pr.x += (pointer.current.x - pr.x) * k;
    pr.y += (pointer.current.y - pr.y) * k;
    if (m.uniforms.uAspect)
      m.uniforms.uAspect.value = state.size.width / state.size.height;

    // Edge slam from the parkour figure → an expanding shock ring at that
    // spot. uHitAge is seconds since impact (-1 = idle); a fresh hitRef
    // timestamp re-arms it.
    const hp = m.uniforms.uHitPos;
    const ha = m.uniforms.uHitAge;
    const hpw = m.uniforms.uHitPow;
    if (hp && ha && hpw) {
      if (ha.value >= 0) {
        ha.value += delta;
        if (ha.value > 1.2) ha.value = -1;
      }
      const hit = hitRef?.current;
      if (hit && hit.t > lastHit.current) {
        lastHit.current = hit.t;
        ha.value = 0;
        hpw.value = hit.power;
        const r = canvas.getBoundingClientRect();
        (hp.value as THREE.Vector2).set(
          ((hit.x - r.left) / r.width) * 2 - 1,
          -((hit.y - r.top) / r.height) * 2 + 1,
        );
      }
    }

    // Progress is already eased + speed-capped upstream (see HomeScene).
    const p = progressRef.current;

    const travel = smoothstep((p - 0.06) / 0.3);
    const burst = smoothstep((p - 0.22) / 0.22);
    const form = smoothstep((p - 0.4) / 0.34);
    const explode = burst * (1 - form);

    pts.position.x = -1.7 * (1 - travel);
    pts.position.y = -Math.sin(Math.min(travel, 1) * Math.PI) * 0.9 * (1 - form);
    pts.scale.setScalar(1.1 + travel * 0.2 - form * 0.42);

    const sway =
      Math.sin(t * 0.3) * 0.35 + travel * Math.PI * 2.4 + explode * t * 0.3;
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
          uPointer: { value: new THREE.Vector2(0, 0) },
          uAspect: { value: 1 },
          uHitPos: { value: new THREE.Vector2(0, 0) },
          uHitAge: { value: -1 },
          uHitPow: { value: 1 },
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
          uniform vec2 uPointer;
          uniform float uAspect;
          uniform vec2 uHitPos;
          uniform float uHitAge;
          uniform float uHitPow;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = aColor;
            vec3 vpos = mix(position, aScatter, uExplode);
            vec3 pos = mix(vpos, aComputer, uForm);
            pos += 0.04 * (1.0 - uForm * 0.85) * vec3(
              sin(uTime * 0.8 + aSeed),
              cos(uTime * 0.7 + aSeed * 1.3),
              sin(uTime * 0.6 + aSeed * 0.7)
            );
            vAlpha = uFade * mix(1.0, 0.5, uExplode);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float twinkle = 0.75 + 0.55 * sin(uTime + aSeed);
            gl_PointSize = (34.0 / -mv.z) * twinkle
              * (1.0 + uExplode * 0.6) * (1.0 - uForm * 0.15);
            vec4 clip = projectionMatrix * mv;

            // Part the field around the cursor — strong on the loose hero
            // V, gentle once the monitor has formed so it stays readable.
            // Measure the gap in aspect-corrected space so the opening is
            // round, not an ellipse that stretches across a wide screen.
            vec2 sp = clip.xy / clip.w;
            vec2 gap = (sp - uPointer) * vec2(uAspect, 1.0);
            float pd = length(gap);
            float push = smoothstep(0.34, 0.04, pd) * (1.0 - uForm * 0.82);
            // Scale the offset rather than normalise it: the shove keeps a
            // steady direction and eases to zero right under the cursor,
            // instead of flipping frame to frame where the gap is ~0.
            vec2 dir = gap / (pd + 0.12);
            clip.xy += (dir / vec2(uAspect, 1.0)) * push * clip.w * 0.08;
            gl_PointSize *= 1.0 + push * 1.4;
            vAlpha *= 1.0 + push * 0.4;

            // Impact where the parkour figure lands on the bezel: an
            // expanding shock ring shoves particles outward as its front
            // passes, trailed by a short decaying shiver — an actual hit,
            // not a vibrating blob.
            if (uHitAge >= 0.0) {
              vec2 hv = (sp - uHitPos) * vec2(uAspect, 1.0);
              float hpd = length(hv);
              float ringR = uHitAge * 0.9;
              float shell = smoothstep(0.055, 0.0, abs(hpd - ringR));
              float reach = 1.0 - smoothstep(0.0, 0.34, hpd);
              float decay = exp(-uHitAge * 3.4);
              float wave = shell * reach * decay * uHitPow;
              float shiver = reach * decay * (1.0 - shell) * uHitPow;
              vec2 rad = (hv / (hpd + 1e-4)) / vec2(uAspect, 1.0);
              clip.xy += rad * wave * clip.w * 0.10;
              clip.xy += vec2(
                sin(uTime * 58.0 + aSeed * 21.0),
                cos(uTime * 53.0 + aSeed * 17.0)
              ) * shiver * clip.w * 0.012;
              gl_PointSize *= 1.0 + wave * 2.4 + shiver * 0.4;
              vAlpha *= 1.0 + wave * 1.2;
            }

            gl_Position = clip;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.32, d);
            float halo = smoothstep(0.5, 0.0, d) * 0.4;
            gl_FragColor = vec4(vColor * (1.0 + core * 0.6), (core + halo) * vAlpha);
          }
        `}
      />
    </points>
  );
}

export default function VCloud({
  progressRef,
  hitRef,
}: {
  progressRef: RefObject<number>;
  hitRef?: RefObject<Hit>;
}) {
  return (
    <Canvas camera={CAMERA} dpr={DPR}>
      <Cloud progressRef={progressRef} hitRef={hitRef} />
    </Canvas>
  );
}
