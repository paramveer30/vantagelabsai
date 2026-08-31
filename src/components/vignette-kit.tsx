"use client";

import { useEffect, useState, type ReactNode, type Ref } from "react";

// Shared building blocks for the small animated product mocks on the
// services and industries pages. The keyframes these lean on live in
// globals.css under "Services vignettes" (vg-*) and "Industries" (ind-*).
// Each piece renders a finished, motionless state when `animate` is false
// so the reduced-motion branch needs no timers.

/* -------------------------------------------------------------------- */
/* frame — the bordered "app window" chrome                            */
/* -------------------------------------------------------------------- */

export function VignetteFrame({
  ref,
  label,
  children,
}: {
  ref: Ref<HTMLDivElement>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      ref={ref}
      className="vg-frame absolute inset-0 overflow-hidden rounded-xl border border-border bg-surface-2"
    >
      <div className="flex h-7 items-center gap-2 border-b border-border px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="ml-1 font-mono text-[10px] tracking-wide text-muted">
          {label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-7">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* small composables                                                   */
/* -------------------------------------------------------------------- */

// A rounded stat card with a label and a counting value.
export function StatTile({
  label,
  value,
  prefix,
  suffix,
  animate,
  delay = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  animate: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`rounded-md border border-border bg-white/[0.03] px-2 py-1.5 ${
        animate ? "vg-rise" : ""
      }`}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="text-[9px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="font-mono text-sm text-foreground">
        {prefix}
        <CountUp end={value} animate={animate} delay={delay + 280} />
        {suffix}
      </div>
    </div>
  );
}

// A chat bubble; `side` picks the corner and colour.
export function Bubble({
  side,
  animate,
  delay = 0,
  children,
}: {
  side: "start" | "end";
  animate: boolean;
  delay?: number;
  children: ReactNode;
}) {
  const skin =
    side === "start"
      ? "self-start rounded-bl-sm bg-white/[0.06] text-foreground/80"
      : "self-end rounded-br-sm border border-accent/30 bg-accent/[0.12] text-accent";
  return (
    <div
      className={`max-w-[85%] rounded-lg px-2.5 py-1.5 ${skin} ${
        animate ? "vg-rise" : ""
      }`}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

// The green check SVG used in log / done lists.
export function Check({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} shrink-0 text-[#4ade80]`}
      aria-hidden
    >
      <path
        d="M3 8.5l3.5 3.5L13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A jagged line drawn at double width so scrolling it left by 50% loops
// seamlessly; `seed` varies the shape between scenes.
export function Sparkline({
  animate,
  seed = [22, 26, 18, 30, 24, 33, 20, 28, 25, 31, 19, 27],
}: {
  animate: boolean;
  seed?: number[];
}) {
  const half = seed.map((y, i) => `${(i / (seed.length - 1)) * 100},${y}`);
  const full = [
    ...half,
    ...seed.map((y, i) => `${100 + (i / (seed.length - 1)) * 100},${y}`),
  ];
  const d = "M" + full.join(" L");
  return (
    <svg
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      className="h-full w-[200%]"
      aria-hidden
    >
      <path
        className={animate ? "vg-spark" : ""}
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------- */
/* timing helpers                                                      */
/* -------------------------------------------------------------------- */

export function CountUp({
  end,
  animate,
  delay = 0,
}: {
  end: number;
  animate: boolean;
  delay?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let start = 0;
    const dur = 900;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start - delay) / dur);
      if (p < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, animate, delay]);

  return <>{animate ? n : end}</>;
}

export function Streamed({
  text,
  animate,
  startAfter,
  perWord,
}: {
  text: string;
  animate: boolean;
  startAfter: number;
  perWord: number;
}) {
  const words = text.split(" ");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const timers: number[] = [];
    const startId = window.setTimeout(() => {
      for (let i = 1; i <= words.length; i++) {
        timers.push(window.setTimeout(() => setCount(i), i * perWord));
      }
    }, startAfter);
    return () => {
      window.clearTimeout(startId);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [text, animate, startAfter, perWord, words.length]);

  return <>{(animate ? words.slice(0, count) : words).join(" ")}</>;
}
