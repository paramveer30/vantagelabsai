"use client";

import { useRef } from "react";
import { MathUtils } from "three";
import type { Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei";

function Shape() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.18;
    g.rotation.x = MathUtils.lerp(g.rotation.x, state.pointer.y * 0.35, 0.04);
    g.rotation.z = MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.35, 0.04);
  });

  return (
    <group ref={group}>
      <Icosahedron args={[1.7, 4]}>
        <MeshDistortMaterial
          color="#2f6bff"
          emissive="#3ad0ff"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.6}
          distort={0.32}
          speed={1.6}
          wireframe
        />
      </Icosahedron>
    </group>
  );
}

export default function HeroObject() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.8]}>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 5]} intensity={2.5} color="#3ad0ff" />
      <pointLight position={[-5, -3, -2]} intensity={1.5} color="#2f6bff" />
      <Shape />
    </Canvas>
  );
}
