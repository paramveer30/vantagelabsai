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
  spark: boolean;
};

const DUR = 1320;
const BURST = 170; // free outward flight before a particle starts homing
const FORM = 640; // every particle has locked onto its pixel by here
const HOLD = 900; // the text sits, drawn in particles; fade after

// Fires on every route change. Rasterises the incoming page's text and
// panel edges to an offscreen mask, flings a particle out of a central
// burst for every lit pixel, then reels each one onto its exact pixel so
// the words are spelled out in particles — the real DOM then resolves in
// underneath as they fade (see .page-resolve). No-ops under
// prefers-reduced-motion.
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

    // --- Rasterise the new page's text into an alpha mask ---
    const mask = document.createElement("canvas");
    mask.width = w;
    mask.height = h;
    const m = mask.getContext("2d", { willReadFrequently: true });
    const main = document.querySelector("main");
    if (m && main) {
      m.textBaseline = "middle";
      m.fillStyle = "#fff";
      m.strokeStyle = "#fff";

      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const raw = node.nodeValue;
        const parent = node.parentElement;
        if (raw && raw.trim() && parent) {
          const cs = getComputedStyle(parent);
          m.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = Array.from(range.getClientRects()).filter(
            (r) => r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < h,
          );
          const words = raw.trim().split(/\s+/);
          let wi = 0;
          for (const r of rects) {
            let line = "";
            while (wi < words.length) {
              const trial = line ? `${line} ${words[wi]}` : words[wi];
              if (line && m.measureText(trial).width > r.width + 4) break;
              line = trial;
              wi++;
            }
            if (line) m.fillText(line, r.left, r.top + r.height / 2);
            if (wi >= words.length) break;
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
        m.lineWidth = 1;
        m.strokeRect(r.left, r.top, r.width, r.height);
      });
    }

    // --- Lit pixels become particle targets ---
    const targets: { x: number; y: number }[] = [];
    if (m) {
      const data = m.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += 1.7) {
        const row = Math.round(y);
        for (let x = 0; x < w; x += 1.7) {
          const col = Math.round(x);
          if (data[(row * w + col) * 4 + 3] > 40) targets.push({ x: col, y: row });
        }
      }
    }

    const cap = w < 640 ? 2600 : 5200;
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
      const spd = 780 + Math.random() * 1900;
      parts.push({
        x: cx + (Math.random() - 0.5) * 64,
        y: cy + (Math.random() - 0.5) * 64,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        tx,
        ty,
        born: Math.random() * 120,
        spark: Math.random() < 0.07,
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

      if (t < 220) {
        const fa = (1 - t / 220) * 0.42;
        const g = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(w, h) * 0.55,
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

        if (life < BURST) {
          const drag = Math.pow(0.955, dt * 60);
          p.vx *= drag;
          p.vy *= drag;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        } else {
          const prog = Math.min(1, (life - BURST) / (FORM - BURST));
          const s = 0.03 + prog * prog * 0.34;
          p.x += (p.tx - p.x) * s + p.vx * dt * (1 - prog);
          p.y += (p.ty - p.y) * s + p.vy * dt * (1 - prog);
          p.vx *= 0.9;
          p.vy *= 0.9;
        }

        let a: number;
        if (life < 110) a = life / 110;
        else if (life < HOLD) a = 1;
        else a = Math.max(0, 1 - (life - HOLD) / (DUR - HOLD));
        if (a <= 0) continue;

        if (p.spark) {
          ctx.fillStyle = `rgba(224,251,255,${a})`;
          ctx.fillRect(p.x - 1.3, p.y - 1.3, 2.6, 2.6);
        } else {
          ctx.fillStyle = `rgba(128,230,255,${a})`;
          ctx.fillRect(p.x - 0.9, p.y - 0.9, 1.8, 1.8);
        }
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
