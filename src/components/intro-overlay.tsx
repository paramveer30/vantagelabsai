"use client";

import { useEffect, useRef, useState } from "react";

const TEXT = "Welcome to Vantage Labs";
type Phase = "pending" | "typing" | "particles" | "out" | "gone";

function initialPhase(): Phase {
  if (typeof window === "undefined") return "pending";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "gone";
  }
  return "typing";
}

// Load sequence: the greeting types out, scatters into cyan particles,
// and those particles reassemble into the V before the overlay clears to
// the page. Runs on every full page load; skipped on a click or under
// prefers-reduced-motion.
export function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [typed, setTyped] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (phase !== "typing") return;

    let i = 0;
    const type = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= TEXT.length) {
        window.clearInterval(type);
        window.setTimeout(() => setPhase("particles"), 450);
      }
    }, 52);
    const failsafe = window.setTimeout(() => setPhase("gone"), 7000);

    return () => {
      window.clearInterval(type);
      window.clearTimeout(failsafe);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "particles") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const bail = () => window.setTimeout(() => setPhase("out"), 0);
    if (!canvas || !ctx) {
      bail();
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sample = (
      draw: (o: CanvasRenderingContext2D) => void,
      step: number,
    ) => {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d");
      const pts: { x: number; y: number }[] = [];
      if (!o) return pts;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      draw(o);
      const d = o.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (d[(y * w + x) * 4 + 3] > 40) pts.push({ x, y });
        }
      }
      return pts;
    };

    const cs = labelRef.current ? getComputedStyle(labelRef.current) : null;
    const family = cs?.fontFamily ?? "sans-serif";
    const rect = labelRef.current?.getBoundingClientRect();
    const labelY = rect ? rect.top + rect.height / 2 : h * 0.4;

    const src = sample((o) => {
      o.font = `${cs?.fontWeight ?? "600"} ${cs?.fontSize ?? "32px"} ${family}`;
      o.fillText(TEXT, w / 2, labelY);
    }, 2);
    const target = sample((o) => {
      o.font = `700 ${Math.min(w, h) * 0.6}px ${family}`;
      o.fillText("V", w / 2, h / 2);
    }, 3);

    if (!src.length || !target.length) {
      bail();
      return;
    }

    const count = Math.min(src.length, 4500);
    const parts = Array.from({ length: count }, (_, i) => {
      const s = src[Math.floor((i * src.length) / count)];
      const t = target[Math.floor(Math.random() * target.length)];
      return { sx: s.x, sy: s.y, tx: t.x, ty: t.y };
    });

    let raf = 0;
    let start = 0;
    const DUR = 1500;
    const frame = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / DUR);
      const e = 1 - Math.pow(1 - p, 3);
      const jitter = (1 - p) * 7;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(122,228,255,${0.85 - p * 0.2})`;
      for (const pt of parts) {
        const x = pt.sx + (pt.tx - pt.sx) * e + (Math.random() - 0.5) * jitter;
        const y = pt.sy + (pt.ty - pt.sy) * e + (Math.random() - 0.5) * jitter;
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        window.setTimeout(() => setPhase("out"), 280);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("gone"), 620);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "pending" || phase === "gone") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("out")}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-[600ms] ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <p
        ref={labelRef}
        className={`display text-2xl font-semibold tracking-tight text-foreground transition-opacity duration-200 sm:text-4xl ${
          phase === "typing" ? "opacity-100" : "opacity-0"
        }`}
      >
        {TEXT.slice(0, typed)}
        <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse bg-accent" />
      </p>
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 h-full w-full ${
          phase === "particles" || phase === "out" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
