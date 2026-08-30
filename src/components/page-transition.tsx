"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  born: number;
  r: number;
  spark: boolean;
};

const DUR = 980;
const BURST = 170; // free outward flight before the homing force ramps in
const HOLD = 640; // particles have landed by here; fade after

// Fires on every route change: particles burst from the centre, then home
// onto the bounding boxes of the freshly-rendered page so the explosion
// resolves into the layout. The DOM content fades up from blur underneath
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h * 0.42;

    // On-screen content boxes of the new page — particle targets.
    const boxes: { x: number; y: number; w: number; h: number; area: number }[] =
      [];
    let totalArea = 0;
    const nodes = document.querySelectorAll<HTMLElement>(
      "main h1, main h2, main h3, main p, main li, main a, main button, main input, main textarea, main img, main svg",
    );
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(0, r.left);
      const y = Math.max(0, r.top);
      const bw = Math.min(w, r.right) - x;
      const bh = Math.min(h, r.bottom) - y;
      if (bw < 6 || bh < 6) return;
      const area = bw * bh;
      boxes.push({ x, y, w: bw, h: bh, area });
      totalArea += area;
    });

    const COUNT = 860;
    const parts: Particle[] = [];
    const push = (tx: number, ty: number) => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 520 + Math.random() * 1120;
      const spark = Math.random() < 0.12;
      parts.push({
        x: cx + (Math.random() - 0.5) * 44,
        y: cy + (Math.random() - 0.5) * 44,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        tx,
        ty,
        born: Math.random() * 90,
        r: spark ? 1.5 + Math.random() * 1.8 : 0.7 + Math.random() * 2,
        spark,
      });
    };

    if (boxes.length && totalArea > 0) {
      boxes.forEach((b) => {
        const n = Math.max(5, Math.round((b.area / totalArea) * COUNT));
        for (let i = 0; i < n; i++) {
          push(b.x + Math.random() * b.w, b.y + Math.random() * b.h);
        }
      });
    } else {
      for (let i = 0; i < COUNT; i++) {
        const a = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * Math.min(w, h) * 0.34;
        push(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.7);
      }
    }

    let raf = 0;
    let start = 0;
    let prev = 0;

    const frame = (now: number) => {
      if (!start) start = prev = now;
      const dt = Math.min(now - prev, 40) / 1000;
      prev = now;
      const t = now - start;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Central bloom at the origin of the burst.
      if (t < 260) {
        const fa = (1 - t / 260) * 0.5;
        const g = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.min(w, h) * 0.55,
        );
        g.addColorStop(0, `rgba(150,235,255,${fa})`);
        g.addColorStop(1, "rgba(150,235,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of parts) {
        const life = t - p.born;
        if (life < 0) continue;

        const homing = Math.min(1, Math.max(0, (life - BURST) / 260));
        const k = 27 * homing;
        p.vx += (p.tx - p.x) * k * dt;
        p.vy += (p.ty - p.y) * k * dt;
        const drag = Math.pow(homing > 0 ? 0.85 : 0.94, dt * 60);
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        let a: number;
        if (life < 130) a = life / 130;
        else if (life < HOLD) a = 1;
        else a = Math.max(0, 1 - (life - HOLD) / (DUR - HOLD));
        a *= p.spark ? 1 : 0.72;
        if (a <= 0) continue;

        ctx.fillStyle = p.spark
          ? `rgba(210,248,255,${a})`
          : `rgba(120,226,255,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t < DUR) {
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
