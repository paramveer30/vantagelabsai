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

const DUR = 1150;
const BURST = 240; // free outward flight before the homing force ramps in
const HOLD = 770; // the layout has formed by here; particles fade after

// Fires on every route change: a wide particle burst from the centre that
// then springs each particle onto a point traced from the freshly-rendered
// page — every text line and panel edge — so the explosion reassembles
// into the actual content. The DOM resolves from blur underneath as the
// particles land (see .page-resolve). No-ops under prefers-reduced-motion.
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

    // Trace the new page: a point cloud over every rendered text line and
    // every bordered panel edge.
    const targets: { x: number; y: number }[] = [];
    const main = document.querySelector("main");
    if (main) {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        if (node.nodeValue && node.nodeValue.trim()) {
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) {
            if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > h) continue;
            for (let y = r.top + 1; y < r.bottom - 1; y += 3.4) {
              for (let x = r.left; x < r.right; x += 3.4) {
                if (Math.random() < 0.5) targets.push({ x, y });
              }
            }
          }
        }
        node = walker.nextNode();
      }

      main.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.borderStyle === "none" || parseFloat(cs.borderTopWidth) === 0) {
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 44 || r.height < 44 || r.bottom < 0 || r.top > h) return;
        for (let x = r.left; x < r.right; x += 7) {
          targets.push({ x, y: r.top }, { x, y: r.bottom });
        }
        for (let y = r.top; y < r.bottom; y += 7) {
          targets.push({ x: r.left, y }, { x: r.right, y });
        }
      });
    }

    const cap = w < 640 ? 1300 : 2600;
    if (targets.length > cap) {
      for (let i = targets.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      targets.length = cap;
    }

    const parts: Particle[] = [];
    const make = (tx: number, ty: number) => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 720 + Math.random() * 1800;
      const spark = Math.random() < 0.1;
      parts.push({
        x: cx + (Math.random() - 0.5) * 64,
        y: cy + (Math.random() - 0.5) * 64,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        tx,
        ty,
        born: Math.random() * 120,
        r: spark ? 1.3 + Math.random() * 1.4 : 0.6 + Math.random() * 1.3,
        spark,
      });
    };
    if (targets.length) {
      targets.forEach((t) => make(t.x, t.y));
    } else {
      for (let i = 0; i < 900; i++) {
        const a = Math.random() * Math.PI * 2;
        const rad = Math.sqrt(Math.random()) * Math.min(w, h) * 0.34;
        make(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.7);
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

      if (t < 340) {
        const fa = (1 - t / 340) * 0.6;
        const g = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(w, h) * 0.62,
        );
        g.addColorStop(0, `rgba(160,238,255,${fa})`);
        g.addColorStop(0.5, `rgba(90,200,255,${fa * 0.4})`);
        g.addColorStop(1, "rgba(90,200,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of parts) {
        const life = t - p.born;
        if (life < 0) continue;

        const homing = Math.min(1, Math.max(0, (life - BURST) / 320));
        const k = 31 * homing;
        p.vx += (p.tx - p.x) * k * dt;
        p.vy += (p.ty - p.y) * k * dt;
        const drag = Math.pow(homing > 0 ? 0.84 : 0.955, dt * 60);
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        let a: number;
        if (life < 120) a = life / 120;
        else if (life < HOLD) a = 1;
        else a = Math.max(0, 1 - (life - HOLD) / (DUR - HOLD));
        a *= p.spark ? 1 : 0.7;
        if (a <= 0) continue;

        ctx.fillStyle = p.spark
          ? `rgba(215,249,255,${a})`
          : `rgba(120,226,255,${a})`;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
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
