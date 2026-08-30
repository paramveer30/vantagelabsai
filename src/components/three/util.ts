import * as THREE from "three";

// Both hero canvases frame the same virtual space — keep them on one camera.
export const CAMERA = {
  position: [0, 0, 5.4] as [number, number, number],
  fov: 42,
};
export const DPR: [number, number] = [1, 1.6];

// The hero V and the welcome implosion draw the same particles.
export const WELCOME_PARTICLE_COUNT = 24000;

export const LOW = new THREE.Color("#0b4fd6");
export const MID = new THREE.Color("#2aa8ee");
export const HIGH = new THREE.Color("#7fe4ff");

export function gradient(t: number, out: THREE.Color) {
  if (t < 0.5) out.copy(LOW).lerp(MID, t / 0.5);
  else out.copy(MID).lerp(HIGH, (t - 0.5) / 0.5);
}

// Deterministic hash in [0, 1) so generated buffers are reproducible.
export function hashUnit(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

let sharedDot: THREE.Texture | null = null;

// Soft round sprite so pointsMaterial doesn't render hard squares.
export function dotTexture() {
  if (sharedDot) return sharedDot;
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
  sharedDot = new THREE.CanvasTexture(canvas);
  sharedDot.colorSpace = THREE.SRGBColorSpace;
  return sharedDot;
}
