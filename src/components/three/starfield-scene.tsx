"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CAMERA, dotTexture, DPR, hashUnit, HIGH, LOW } from "./util";

const STAR_COUNT = 2600;
const DUST_COUNT = 500;

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

export default function StarfieldScene() {
  return (
    <Canvas camera={CAMERA} dpr={DPR}>
      <StarField />
      <DustField />
    </Canvas>
  );
}
