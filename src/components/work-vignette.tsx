"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectShape } from "@/content/work";
import { usePrefersReducedMotion } from "@/lib/media";

// A small animated mock of each project, framed like a browser window
// with its live domain in the address bar. DOM + CSS only; the keyframes
// (vg-rise / vg-sweep / vg-blink / vg-dot) live in globals.css under
// "Services vignettes". Under reduced motion every shape renders its
// finished state and no timers run.

const CYCLE_MS = 9000;

export function WorkVignette({
  shape,
  label,
}: {
  shape: ProjectShape;
  label: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Only loop while the frame is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, inView]);

  const animate = !reduced && inView;

  return (
    <div
      ref={ref}
      className="vg-frame absolute inset-0 overflow-hidden rounded-xl border border-border bg-surface-2"
    >
      <div className="flex h-7 items-center gap-2 border-b border-border px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="ml-1 truncate font-mono text-[10px] tracking-wide text-muted">
          {label}
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-[#4ade80]">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-[#4ade80] ${
              animate ? "vg-blink" : ""
            }`}
          />
          live
        </span>
      </div>

      {/* Remounting on `cycle` restarts every CSS animation inside. */}
      <div key={cycle} className="absolute inset-x-0 bottom-0 top-7">
        {shape === "listings" && <Listings animate={animate} />}
        {shape === "editorial" && <Editorial animate={animate} />}
        {shape === "portfolio" && <Portfolio animate={animate} />}
      </div>
    </div>
  );
}

const rise = (ms: number, animate: boolean) =>
  animate ? { animationDelay: `${ms}ms` } : undefined;

/* -------------------------------------------------------------------- */
/* listings — a housing search: result cards + a map                    */
/* -------------------------------------------------------------------- */

function Listings({ animate }: { animate: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center gap-1.5">
        <div className="h-4 flex-1 rounded-full border border-border bg-white/[0.04]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 w-8 rounded-full bg-white/[0.06]" />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 rounded-md border border-border bg-white/[0.03] p-1.5 ${
                animate ? "vg-rise" : ""
              }`}
              style={rise(120 + i * 110, animate)}
            >
              <div className="h-6 rounded bg-gradient-to-br from-brand/30 to-accent/20" />
              <div className="h-1.5 w-3/4 rounded bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-1/3 rounded bg-white/[0.07]" />
                <div className="h-1.5 w-6 rounded bg-accent/40" />
              </div>
            </div>
          ))}
        </div>

        <div className="relative w-20 shrink-0 overflow-hidden rounded-md border border-border bg-white/[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <Pin top="38%" left="44%" animate={animate} delay={500} />
          <Pin top="64%" left="70%" animate={animate} delay={900} />
        </div>
      </div>
    </div>
  );
}

function Pin({
  top,
  left,
  animate,
  delay,
}: {
  top: string;
  left: string;
  animate: boolean;
  delay: number;
}) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
    >
      <span
        className={`block h-2 w-2 rounded-full border border-background bg-accent ${
          animate ? "vg-blink" : ""
        }`}
        style={rise(delay, animate)}
      />
    </span>
  );
}

/* -------------------------------------------------------------------- */
/* editorial — a marketing home: hero + a row of sub-brand tiles        */
/* -------------------------------------------------------------------- */

function Editorial({ animate }: { animate: boolean }) {
  return (
    <div className="relative flex h-full flex-col gap-2 p-3">
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-3 rounded bg-accent/70" />
        <div className="h-2 w-14 rounded bg-white/15" />
        <div className="ml-auto flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1.5 w-6 rounded bg-white/10" />
          ))}
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-1.5">
        <div
          className={`h-3 w-5/6 rounded bg-white/15 ${animate ? "vg-rise" : ""}`}
          style={rise(120, animate)}
        />
        <div
          className={`h-3 w-2/3 rounded bg-white/15 ${animate ? "vg-rise" : ""}`}
          style={rise(220, animate)}
        />
        <div
          className={`mt-1 h-1.5 w-1/2 rounded bg-white/[0.08] ${
            animate ? "vg-rise" : ""
          }`}
          style={rise(320, animate)}
        />
        <div className="mt-1 flex gap-1.5">
          <div className="h-4 w-16 rounded-full bg-brand/70" />
          <div className="h-4 w-16 rounded-full border border-border" />
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 rounded-md border border-border bg-white/[0.03] p-2 ${
              animate ? "vg-rise" : ""
            }`}
            style={rise(460 + i * 140, animate)}
          >
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-accent/40 to-brand/30" />
            <div className="h-1.5 w-10 rounded bg-white/10" />
            <div className="h-1.5 w-6 rounded bg-white/[0.06]" />
          </div>
        ))}
      </div>

      {animate && (
        <div className="vg-sweep pointer-events-none absolute inset-0" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* portfolio — a name, project tiles, and a chatting "AI twin"          */
/* -------------------------------------------------------------------- */

function Portfolio({ animate }: { animate: boolean }) {
  return (
    <div className="relative flex h-full flex-col gap-2 p-3">
      <div
        className={`h-4 w-2/3 rounded bg-white/20 ${animate ? "vg-rise" : ""}`}
        style={rise(120, animate)}
      />
      <div
        className={`h-2 w-1/2 rounded bg-accent/50 ${animate ? "vg-rise" : ""}`}
        style={rise(240, animate)}
      />

      <div className="mt-1 grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 rounded-md border border-border bg-white/[0.03] p-1.5 ${
              animate ? "vg-rise" : ""
            }`}
            style={rise(380 + i * 140, animate)}
          >
            <div className="h-7 rounded bg-gradient-to-br from-brand/25 to-accent/20" />
            <div className="h-1.5 w-3/4 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <div className="h-1.5 w-1/3 rounded bg-white/[0.06]" />
        <div className="h-1.5 w-1/4 rounded bg-white/[0.06]" />
      </div>

      <div
        className={`absolute bottom-2 right-2 w-28 rounded-lg rounded-br-sm border border-accent/30 bg-accent/[0.12] p-2 ${
          animate ? "vg-rise" : ""
        }`}
        style={rise(700, animate)}
      >
        <div className="text-[8px] font-medium uppercase tracking-wide text-accent">
          AI twin
        </div>
        <div className="mt-1">
          {animate ? (
            <span className="flex items-center gap-[3px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full bg-accent"
                  style={{
                    animation: "vg-dot 1s ease-in-out infinite",
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </span>
          ) : (
            <span className="block h-1 w-12 rounded-full bg-accent/40" />
          )}
        </div>
      </div>
    </div>
  );
}
