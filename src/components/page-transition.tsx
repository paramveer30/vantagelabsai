"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  spark: boolean;
};

const SWEEP = 700;
const TAIL = 520;

// Fires on every route change: a bright scan line sweeps top → bottom
// "printing" the new page, shedding cyan particles along its edge as the
// old page vaporizes. The incoming page resolves from blur underneath
// (see .page-resolve in globals.css). No-ops under prefers-reduced-motion.
export function PageTransition() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const parts: Particle[] = [];
    const spawn = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const spark = Math.random() < 0.16;
        parts.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 90,
          vy: -20 - Math.random() * 140,
          life: 0,
          max: 360 + Math.random() * 420,
          r: spark ? 1.4 + Math.random() * 1.6 : 0.7 + Math.random() * 2.2,
          spark,
        });
      }
    };

    // A thin ambient scatter so the whole frame feels like it's breaking up,
    // not just the wipe edge.
    const ambient = Math.min(220, Math.round((w * h) / 9000));
    for (let i = 0; i < ambient; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 30,
        life: 0,
        max: 300 + Math.random() * 360,
        r: 0.6 + Math.random() * 1.6,
        spark: false,
      });
    }

    let raf = 0;
    let start = 0;
    let prev = 0;
    let emitAcc = 0;

    const frame = (now: number) => {
      if (!start) start = prev = now;
      const dt = Math.min(now - prev, 40) / 1000;
      prev = now;
      const elapsed = now - start;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Scan line + emission along its edge.
      if (elapsed < SWEEP) {
        const p = elapsed / SWEEP;
        const y = p * h;
        const g = ctx.createLinearGradient(0, y - 90, 0, y + 8);
        g.addColorStop(0, "rgba(47,107,255,0)");
        g.addColorStop(0.7, "rgba(58,208,255,0.12)");
        g.addColorStop(1, "rgba(58,208,255,0.4)");
        ctx.fillStyle = g;
        ctx.fillRect(0, y - 90, w, 96);
        ctx.fillStyle = "rgba(200,245,255,0.95)";
        ctx.fillRect(0, y - 1.5, w, 3);

        emitAcc += dt * 900;
        while (emitAcc > 1) {
          spawn(Math.random() * w, y, 1);
          emitAcc -= 1;
        }
      }

      let alive = 0;
      for (const pt of parts) {
        pt.life += dt * 1000;
        if (pt.life >= pt.max) continue;
        alive++;
        const k = pt.life / pt.max;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.986;
        pt.vy = pt.vy * 0.986 + 46 * dt;
        const a = (1 - k) * (pt.spark ? 1 : 0.8);
        ctx.fillStyle = pt.spark
          ? `rgba(210,248,255,${a})`
          : `rgba(122,228,255,${a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * (1 - k * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }

      if (alive || elapsed < SWEEP + TAIL) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    };
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ viewTransitionName: "page-particles" }}
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
