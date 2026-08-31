"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceVariant } from "@/content/services";
import { usePrefersReducedMotion } from "@/lib/media";
import { CountUp, Streamed, VignetteFrame } from "@/components/vignette-kit";

// A small animated mock of what each service actually delivers: a
// dashboard assembling itself, an AI reply landing in a support chat, a
// live status board shipping updates. DOM + SVG + CSS so it stays
// pixel-sharp; the keyframes live in globals.css under "Services
// vignettes". Under reduced motion each one renders its finished state
// with no timers.

const CYCLE_MS = 8600;

const LABELS: Record<ServiceVariant, string> = {
  software: "dashboard.app",
  ai: "support-chat",
  support: "status",
};

export function ServiceVignette({ variant }: { variant: ServiceVariant }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Only run the loop while the frame is on screen.
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
    <VignetteFrame ref={ref} label={LABELS[variant]}>
      {/* Remounting on `cycle` restarts every CSS animation inside. */}
      <div key={cycle} className="vg absolute inset-0">
        {variant === "software" && <SoftwareVignette animate={animate} />}
        {variant === "ai" && <AiVignette animate={animate} />}
        {variant === "support" && <SupportVignette animate={animate} />}
      </div>
    </VignetteFrame>
  );
}

/* -------------------------------------------------------------------- */
/* software · a dashboard building itself                               */
/* -------------------------------------------------------------------- */

function SoftwareVignette({ animate }: { animate: boolean }) {
  const bars = [42, 66, 30, 78, 52, 90, 60];
  const step = (n: number) =>
    animate ? { animationDelay: `${n}ms` } : undefined;
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="flex w-9 shrink-0 flex-col gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded bg-white/10 ${animate ? "vg-rise" : ""} ${
              i === 0 ? "bg-accent/40" : ""
            }`}
            style={step(80 * i)}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Orders", v: 128 },
            { k: "On time", v: 94, suffix: "%" },
            { k: "Revenue", v: 12, prefix: "$", suffix: "k" },
          ].map((t, i) => (
            <div
              key={t.k}
              className={`rounded-md border border-border bg-white/[0.03] px-2 py-1.5 ${
                animate ? "vg-rise" : ""
              }`}
              style={step(120 + 90 * i)}
            >
              <div className="text-[9px] uppercase tracking-wider text-muted">
                {t.k}
              </div>
              <div className="font-mono text-sm text-foreground">
                {t.prefix}
                <CountUp end={t.v} animate={animate} delay={400 + 90 * i} />
                {t.suffix}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-1 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm bg-gradient-to-t from-brand to-accent ${
                animate ? "vg-bar" : ""
              }`}
              style={
                animate
                  ? { height: `${h}%`, animationDelay: `${500 + i * 70}ms` }
                  : { height: `${h}%` }
              }
            />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${animate ? "vg-rise" : ""}`}
              style={step(1100 + i * 130)}
            >
              <div className="h-2 w-2 rounded-full bg-accent/50" />
              <div className="h-2 flex-1 rounded bg-white/[0.06]" />
              <div className="h-2 w-8 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      {animate && (
        <div className="vg-sweep pointer-events-none absolute inset-0" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* ai · a chat answering a customer                                    */
/* -------------------------------------------------------------------- */

const AI_REPLY =
  "Yes, we're open Saturday and Sunday, 9am to 2pm. Want me to book you a slot?";

function AiVignette({ animate }: { animate: boolean }) {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-3 text-[11px] leading-snug">
      <div
        className={`max-w-[80%] self-start rounded-lg rounded-bl-sm bg-white/[0.06] px-2.5 py-1.5 text-foreground/80 ${
          animate ? "vg-rise" : ""
        }`}
        style={animate ? { animationDelay: "200ms" } : undefined}
      >
        Do you deliver on weekends?
      </div>

      {animate && (
        <div
          className="vg-typing self-start rounded-lg rounded-bl-sm bg-white/[0.06] px-3 py-2"
          style={{ animationDelay: "900ms" }}
        >
          <span />
          <span />
          <span />
        </div>
      )}

      <div
        className={`relative max-w-[85%] self-end rounded-lg rounded-br-sm border border-accent/30 bg-accent/[0.12] px-2.5 py-1.5 text-accent ${
          animate ? "vg-rise" : ""
        }`}
        style={animate ? { animationDelay: "2300ms" } : undefined}
      >
        <span className="mr-1 text-accent/90">✦</span>
        <Streamed
          text={AI_REPLY}
          animate={animate}
          startAfter={2500}
          perWord={80}
        />
        <span className="absolute -top-2 right-2 rounded-full border border-accent/40 bg-surface-2 px-1.5 text-[8px] font-medium tracking-wide text-accent">
          AI
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* support · a live status board                                       */
/* -------------------------------------------------------------------- */

const DEPLOYS = [
  "Deployed v2.3.1",
  "Fixed: booking timezone bug",
  "Added: CSV export",
];

function SupportVignette({ animate }: { animate: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center gap-2 text-[10px]">
        <span
          className={`h-2 w-2 rounded-full bg-[#4ade80] ${
            animate ? "vg-blink" : ""
          }`}
        />
        <span className="font-mono tracking-wide text-foreground/80">
          All systems operational
        </span>
        <span className="ml-auto font-mono text-muted">99.98%</span>
      </div>

      <div className="relative h-12 overflow-hidden rounded-md border border-border bg-white/[0.02]">
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="h-full w-[200%]"
          aria-hidden
        >
          <path
            className={animate ? "vg-spark" : ""}
            d={SPARK_PATH}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute right-1.5 top-1 font-mono text-[9px] text-accent">
          142ms
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-1">
        {DEPLOYS.map((d, i) => (
          <div
            key={d}
            className={`flex items-center gap-2 text-[10px] ${
              animate ? "vg-rise" : ""
            }`}
            style={
              animate ? { animationDelay: `${300 + i * 260}ms` } : undefined
            }
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 shrink-0 text-[#4ade80]"
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
            <span className="font-mono text-foreground/70">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// A jagged line, drawn wide enough that scrolling it left by 50% loops
// seamlessly (second half repeats the first).
const SPARK_PATH = (() => {
  const pts = [22, 26, 18, 30, 24, 33, 20, 28, 25, 31, 19, 27];
  const half = pts.map((y, i) => `${(i / (pts.length - 1)) * 100},${y}`);
  const full = [
    ...half,
    ...half.map((p, i) => `${100 + (i / (pts.length - 1)) * 100},${pts[i]}`),
  ];
  return "M" + full.join(" L");
})();
