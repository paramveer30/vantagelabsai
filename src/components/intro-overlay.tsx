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

    // Where the letters break apart from.
    const src = sample((o) => {
      o.font = `${cs?.fontWeight ?? "600"} ${cs?.fontSize ?? "32px"} ${family}`;
      o.fillText(TEXT, w / 2, labelY);
    }, 2);

    // A bold V they reassemble into, placed where the hero's particle V
    // sits so the panel can clear straight onto it.
    const s = Math.min(w, h);
    const vx = Math.max(s * 0.42, w * 0.28);
    const vy = h * 0.54;
    const vw = s * 0.34;
    const vh = s * 0.34;
    const target = sample((o) => {
      o.strokeStyle = "#fff";
      o.lineCap = "round";
      o.lineJoin = "round";
      o.lineWidth = s * 0.13;
      o.beginPath();
      o.moveTo(vx - vw, vy - vh);
      o.lineTo(vx, vy + vh);
      o.lineTo(vx + vw, vy - vh);
      o.stroke();
    }, 2);

    if (!src.length || !target.length) {
      bail();
      return;
    }

    // One particle per V pixel (down-sampled), each pulled from a text pixel.
    const step2 = Math.max(1, Math.ceil(target.length / 4600));
    const parts: { sx: number; sy: number; tx: number; ty: number }[] = [];
    for (let i = 0; i < target.length; i += step2) {
      const t = target[i];
      const from = src[(i * 7919) % src.length];
      parts.push({ sx: from.x, sy: from.y, tx: t.x, ty: t.y });
    }

    const FORM = 1350;
    const HOLD = 850;
    let raf = 0;
    let start = 0;
    const frame = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (t < FORM) {
        const p = t / FORM;
        const e = 1 - Math.pow(1 - p, 3);
        const jitter = (1 - p) * 9;
        ctx.fillStyle = `rgba(122,228,255,${0.55 + p * 0.35})`;
        for (const pt of parts) {
          const x =
            pt.sx + (pt.tx - pt.sx) * e + (Math.random() - 0.5) * jitter;
          const y =
            pt.sy + (pt.ty - pt.sy) * e + (Math.random() - 0.5) * jitter;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
        raf = requestAnimationFrame(frame);
      } else if (t < FORM + HOLD) {
        // formed — sit on the V with a faint shimmer
        const fade = 1 - Math.max(0, (t - FORM - (HOLD - 260)) / 260);
        ctx.fillStyle = `rgba(140,232,255,${0.92 * fade})`;
        for (const pt of parts) {
          ctx.fillRect(
            pt.tx - 1 + (Math.random() - 0.5) * 1.4,
            pt.ty - 1 + (Math.random() - 0.5) * 1.4,
            2,
            2,
          );
        }
        raf = requestAnimationFrame(frame);
      } else {
        window.setTimeout(() => setPhase("out"), 0);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("gone"), 720);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  // "pending" only exists for the server render — paint an opaque panel
  // straight away so the page never flashes behind it before the client
  // takes over.
  if (phase === "pending") {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  return (
    <div
      aria-hidden
      suppressHydrationWarning
      onClick={() => setPhase("out")}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
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
