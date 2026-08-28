"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

// Adapted from React Bits' "Beams" (reactbits.dev) — a stack of thin planes
// displaced by 3D perlin noise, lit from the front so the ridges catch the
// light. Ported to TypeScript, recoloured for the brand, and left with a
// transparent background so the page palette shows through.

type ExtendConfig = {
  header: string;
  vertexHeader?: string;
  fragmentHeader?: string;
  vertex?: Record<string, string>;
  fragment?: Record<string, string>;
  material?: { fog?: boolean };
  uniforms?: Record<string, THREE.IUniform | number | THREE.Color>;
};

function extendStandardMaterial(cfg: ExtendConfig): THREE.ShaderMaterial {
  const physical = THREE.ShaderLib.physical;
  const uniforms = THREE.UniformsUtils.clone(physical.uniforms);
  const defaults = new THREE.MeshStandardMaterial();

  uniforms.diffuse.value = defaults.color;
  uniforms.roughness.value = defaults.roughness;
  uniforms.metalness.value = defaults.metalness;

  for (const [key, u] of Object.entries(cfg.uniforms ?? {})) {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u ? u : { value: u };
  }

  let vert = `${cfg.header}\n${cfg.vertexHeader ?? ""}\n${physical.vertexShader}`;
  let frag = `${cfg.header}\n${cfg.fragmentHeader ?? ""}\n${physical.fragmentShader}`;

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}\n${code}`);
  }
  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}\n${code}`);
  }

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: Boolean(cfg.material?.fog),
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
}

// Classic GLSL perlin noise (Stefan Gustavson / Ashima Arts) plus a cheap
// value-noise helper used for the grain in the fragment stage.
const noiseGLSL = `
float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

function stackedPlanes(
  count: number,
  width: number,
  height: number,
  segments: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const vertexCount = count * (segments + 1) * 2;
  const faceCount = count * segments * 2;
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = new Uint32Array(faceCount * 3);

  const totalWidth = count * width;
  const xBase = -totalWidth / 2;
  let vOffset = 0;
  let iOffset = 0;
  let uvOffset = 0;

  for (let i = 0; i < count; i++) {
    const x = xBase + i * width;
    const uvSeedX = Math.random() * 300;
    const uvSeedY = Math.random() * 300;

    for (let j = 0; j <= segments; j++) {
      const y = height * (j / segments - 0.5);
      positions.set([x, y, 0, x + width, y, 0], vOffset * 3);

      const uvY = j / segments;
      uvs.set([uvSeedX, uvY + uvSeedY, uvSeedX + 1, uvY + uvSeedY], uvOffset);

      if (j < segments) {
        const a = vOffset;
        const b = vOffset + 1;
        const c = vOffset + 2;
        const d = vOffset + 3;
        indices.set([a, b, c, c, b, d], iOffset);
        iOffset += 6;
      }
      vOffset += 2;
      uvOffset += 4;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

type BeamsProps = {
  beamWidth?: number;
  beamHeight?: number;
  beamCount?: number;
  beamColor?: string;
  lightColor?: string;
  lightIntensity?: number;
  ambientIntensity?: number;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
};

type BeamFieldProps = Required<
  Pick<
    BeamsProps,
    | "beamWidth"
    | "beamHeight"
    | "beamCount"
    | "beamColor"
    | "speed"
    | "noiseIntensity"
    | "scale"
  >
>;

function BeamField({
  beamWidth = 2,
  beamHeight = 15,
  beamCount = 12,
  beamColor = "#05070f",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
}: BeamFieldProps) {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      extendStandardMaterial({
        header: `
          varying vec2 vUv;
          uniform float time;
          uniform float uSpeed;
          uniform float uNoiseIntensity;
          uniform float uScale;
          ${noiseGLSL}`,
        vertexHeader: `
          float ridge(vec3 pos) {
            vec3 p = vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
            return cnoise(p);
          }
          vec3 shifted(vec3 pos) { vec3 p = pos; p.z += ridge(pos); return p; }
          vec3 ridgeNormal(vec3 pos) {
            vec3 c = shifted(pos);
            vec3 nx = shifted(pos + vec3(0.01, 0.0, 0.0));
            vec3 nz = shifted(pos + vec3(0.0, -0.01, 0.0));
            return normalize(cross(normalize(nz - c), normalize(nx - c)));
          }`,
        vertex: {
          "#include <begin_vertex>": "transformed.z += ridge(transformed.xyz);",
          "#include <beginnormal_vertex>":
            "objectNormal = ridgeNormal(position.xyz);",
        },
        fragment: {
          "#include <dithering_fragment>": `
            float grain = noise(gl_FragCoord.xy);
            gl_FragColor.rgb -= grain / 15. * uNoiseIntensity;`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToRgb(beamColor)),
          time: { value: 0 },
          roughness: { value: 0.3 },
          metalness: { value: 0.3 },
          uSpeed: { value: speed },
          uNoiseIntensity: { value: noiseIntensity },
          uScale: { value: scale },
          envMapIntensity: { value: 10 },
        },
      }),
    [beamColor, speed, noiseIntensity, scale],
  );

  const geometry = useMemo(
    () => stackedPlanes(beamCount, beamWidth, beamHeight, 100),
    [beamCount, beamWidth, beamHeight],
  );

  useFrame((_, delta) => {
    const m = mesh.current?.material as THREE.ShaderMaterial | undefined;
    if (m) m.uniforms.time.value += delta * 0.1;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamCount = 12,
  beamColor = "#05070f",
  lightColor = "#3ad0ff",
  lightIntensity = 1,
  ambientIntensity = 0.9,
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}: BeamsProps) {
  return (
    <Canvas dpr={[1, 1.75]} className="h-full w-full">
      <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
        <BeamField
          beamWidth={beamWidth}
          beamHeight={beamHeight}
          beamCount={beamCount}
          beamColor={beamColor}
          speed={speed}
          noiseIntensity={noiseIntensity}
          scale={scale}
        />
        <directionalLight
          color={lightColor}
          intensity={lightIntensity}
          position={[0, 3, 10]}
        />
      </group>
      <ambientLight intensity={ambientIntensity} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </Canvas>
  );
}
