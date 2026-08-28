"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };
type Node = { p: Pt; jump: boolean };

// Build the loop path from the current viewport: run the monitor bezel,
// vault down the icon column, leap the corners.
function buildPath(): Node[] {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const iconLeftX = 0.5 * W - 0.36 * H + 32; // tile is 64px wide
  const ulTop = 0.2 * H + 40;
  const icon = (i: number): Pt => ({ x: iconLeftX, y: ulTop + i * 84 + 32 });

  const cx = 0.5 * W;
  const cy = 0.428 * H;
  const hw = 0.467 * H;
  const hh = 0.286 * H;
  const TL = { x: cx - hw, y: cy - hh };
  const TR = { x: cx + hw, y: cy - hh };
  const BL = { x: cx - hw, y: cy + hh };
  const BR = { x: cx + hw, y: cy + hh };

  return [
    { p: TL, jump: false },
    { p: { x: cx, y: TL.y }, jump: false },
    { p: icon(0), jump: true },
    { p: icon(1), jump: true },
    { p: icon(2), jump: true },
    { p: icon(3), jump: true },
    { p: icon(4), jump: true },
    { p: BL, jump: true },
    { p: BR, jump: false },
    { p: { x: BR.x, y: cy }, jump: true },
    { p: TR, jump: true },
    { p: TL, jump: false },
  ];
}

export function ParkourFigure({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let path = buildPath();
    let seg = 0;
    let t = 0;
    let dir = 1;
    let raf = 0;
    let last = performance.now();

    const rebuild = () => {
      path = buildPath();
    };
    window.addEventListener("resize", rebuild);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const a = path[seg].p;
      const b = path[(seg + 1) % path.length].p;
      const jump = path[seg].jump;
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const dur = Math.min(1.7, Math.max(0.45, dist / (jump ? 320 : 260)));
      t += dt / dur;

      if (t >= 1) {
        t = 0;
        seg = (seg + 1) % path.length;
      }

      const x = a.x + (b.x - a.x) * t;
      let y = a.y + (b.y - a.y) * t;
      if (jump) {
        const h = Math.min(90, 40 + dist * 0.18);
        y -= Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * h;
      }

      if (Math.abs(b.x - a.x) > 4) dir = b.x > a.x ? 1 : -1;

      const el = ref.current;
      if (el) {
        el.style.transform = `translate(${x - 12}px, ${y - 30}px) scaleX(${dir})`;
        const airborne = jump && t > 0.08 && t < 0.92;
        el.classList.toggle("jump", airborne);
        el.classList.toggle("run", !airborne);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
    };
  }, [active]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pk run pointer-events-none absolute left-0 top-0 z-10 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.4s" }}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="5" r="3.2" />
        <line x1="12" y1="8.2" x2="12" y2="20" />
        <g className="limb arm1">
          <line x1="12" y1="10" x2="12" y2="18" />
        </g>
        <g className="limb arm2">
          <line x1="12" y1="10" x2="12" y2="18" />
        </g>
        <g className="limb leg1">
          <line x1="12" y1="20" x2="12" y2="30" />
        </g>
        <g className="limb leg2">
          <line x1="12" y1="20" x2="12" y2="30" />
        </g>
      </svg>
    </div>
  );
}
