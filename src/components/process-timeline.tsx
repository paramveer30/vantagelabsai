"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { processSteps } from "@/content/process";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/media";

// The Process page's centrepiece: a four-stop timeline that plays itself
// through discovery → design → build → launch, with arrows pulling the
// eye left to right and a single product mock that assembles itself in
// step with the active stop. Same machinery as the service scene —
// IntersectionObserver + an interval + reduced-motion guards — and it
// falls back to a plain readable list on small screens or under reduced
// motion. Keyframes: vg-* (shared, "Services vignettes") and pr-*
// ("Process") in globals.css.

const STAGE_MS = 4200;
const HOLD_MS = 9000;

export function ProcessTimeline() {
  const reduced = usePrefersReducedMotion();
  const small = useMediaQuery("(max-width: 768px)");
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  // Hovering / focusing the rail pauses the auto-advance until you leave;
  // clicking a step jumps there and holds for a longer beat before the
  // auto-advance picks back up from wherever you left it.
  const [busy, setBusy] = useState(false);
  const [held, setHeld] = useState(false);

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
    if (reduced || small || !inView || busy || held) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % processSteps.length),
      STAGE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, small, inView, busy, held]);

  // Release the post-click hold after a beat (re-armed by `active`, so a
  // second click restarts the countdown).
  useEffect(() => {
    if (!held) return;
    const id = window.setTimeout(() => setHeld(false), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [held, active]);

  if (reduced || small) return <StaticProcess />;

  const animate = inView;
  const step = processSteps[active];
  const last = processSteps.length - 1;

  const pick = (i: number) => {
    setActive(i);
    setHeld(true);
  };

  return (
    <div>
      <div
        className="flex items-start"
        onMouseEnter={() => setBusy(true)}
        onMouseLeave={() => setBusy(false)}
        onFocusCapture={() => setBusy(true)}
        onBlurCapture={() => setBusy(false)}
      >
        {processSteps.map((s, i) => (
          <div
            key={s.step}
            className={`flex items-start ${i < last ? "flex-1" : ""}`}
          >
            <button
              type="button"
              onClick={() => pick(i)}
              aria-label={`Step ${s.step}: ${s.label}`}
              aria-current={i === active ? "step" : undefined}
              className="flex shrink-0 flex-col items-center gap-1.5 rounded-md outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                  i < active
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : i === active
                      ? "pr-pulse border-accent bg-accent/15 text-accent"
                      : "border-border bg-white/[0.03] text-muted"
                }`}
              >
                {i < active ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  String(s.step).padStart(2, "0")
                )}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  i === active ? "text-foreground" : "text-muted"
                }`}
              >
                {s.label}
              </span>
            </button>

            {i < last && (
              <div className="relative mx-2 mt-4 h-px flex-1" aria-hidden>
                <div className="absolute inset-0 bg-border" />
                <div
                  className="pr-rail-fill absolute inset-0 bg-gradient-to-r from-brand to-accent"
                  style={{ transform: `scaleX(${i < active ? 1 : 0})` }}
                />
                <div className="pr-flow absolute -inset-y-1 inset-x-0" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Chevron lit={i < active} />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted">
        Auto-plays every few seconds · click any step to jump
      </p>

      <div className="mt-8 md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div key={active} className="vg-rise">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-accent">
              {String(step.step).padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="display text-gradient mt-4 text-2xl font-semibold md:text-3xl">
            {step.title}
          </h2>
          <p className="mt-3 text-base text-muted">{step.description}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-accent">
            You get → {step.deliverable}
          </p>
          <ul className="mt-3 space-y-1.5">
            {step.outputs.map((o) => (
              <li
                key={o}
                className="flex items-center gap-2 text-sm text-foreground/75"
              >
                <Check className="h-3.5 w-3.5" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8 aspect-[4/3] w-full max-w-md md:ml-auto md:mt-0">
          <BuildMock stage={active} animate={animate} mockRef={ref} />
        </div>
      </div>

      {/* Every stage's copy, kept in the DOM for search engines and
          assistive tech while the visible panel shows one at a time. */}
      <StepList className="sr-only" />
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* static fallback — small screens and reduced motion                  */
/* -------------------------------------------------------------------- */

function StaticProcess() {
  const mockRef = useRef<HTMLDivElement>(null);
  return (
    <div className="md:grid md:grid-cols-2 md:items-start md:gap-10">
      <StepList />
      <div className="relative mt-8 aspect-[4/3] w-full max-w-md md:mt-0">
        <BuildMock
          stage={processSteps.length - 1}
          animate={false}
          mockRef={mockRef}
        />
      </div>
    </div>
  );
}

function StepList({ className = "" }: { className?: string }) {
  const last = processSteps.length - 1;
  return (
    <ol className={`space-y-6 ${className}`}>
      {processSteps.map((s, i) => (
        <li key={s.step}>
          <div className="flex gap-4">
            <span className="font-mono text-sm text-accent">
              {String(s.step).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="display font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.description}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-accent">
                You get → {s.deliverable}
              </p>
              <ul className="mt-2 space-y-1">
                {s.outputs.map((o) => (
                  <li
                    key={o}
                    className="flex items-center gap-2 text-xs text-foreground/70"
                  >
                    <Check className="h-3 w-3" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {i < last && (
            <span aria-hidden className="ml-1 flex py-2">
              <Chevron down lit />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------- */
/* the arrow                                                           */
/* -------------------------------------------------------------------- */

function Chevron({
  lit = false,
  down = false,
}: {
  lit?: boolean;
  down?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 shrink-0 transition-colors ${
        lit ? "text-accent" : "text-muted/40"
      } ${down ? "rotate-90" : ""}`}
      aria-hidden
    >
      <path
        d="M4 1l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------- */
/* the product, building itself across the four stages                 */
/* -------------------------------------------------------------------- */

const FRAME_LABELS = ["brief.md", "wireframe", "build", "dashboard.app"];

function BuildMock({
  stage,
  animate,
  mockRef,
}: {
  stage: number;
  animate: boolean;
  mockRef: Ref<HTMLDivElement>;
}) {
  return (
    <Frame label={FRAME_LABELS[stage]} innerRef={mockRef}>
      {/* Remounting on `stage` restarts every CSS animation inside. */}
      <div key={stage} className="absolute inset-0">
        <Stage stage={stage} animate={animate} />
      </div>
    </Frame>
  );
}

function Stage({ stage, animate }: { stage: number; animate: boolean }) {
  const step = (n: number) =>
    animate ? { animationDelay: `${n}ms` } : undefined;

  if (stage === 0) {
    const notes = [
      "Goal: quote in minutes, not hours",
      "Users: 4 sales staff",
      "Must work on a phone",
    ];
    return (
      <div className="flex h-full flex-col justify-end gap-2 p-3 text-[11px] leading-snug">
        <Bubble side="start" animate={animate} delay={150}>
          What&apos;s slowing you down?
        </Bubble>
        <Bubble side="end" animate={animate} delay={900}>
          Manual quotes — hours in spreadsheets every week.
        </Bubble>
        <div className="mt-1 flex flex-col gap-1">
          {notes.map((t, i) => (
            <div
              key={t}
              className={`flex items-center gap-2 ${animate ? "vg-rise" : ""}`}
              style={step(1500 + i * 180)}
            >
              <span className="h-1 w-1 rounded-full bg-accent/60" />
              <span className="font-mono text-[10px] text-foreground/70">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="flex h-full gap-2 p-3">
        <div className="flex w-8 shrink-0 flex-col gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded bg-white/10 ${animate ? "vg-rise" : ""}`}
              style={step(80 * i)}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-9 rounded-md border border-dashed border-border bg-white/[0.02] ${
                  animate ? "vg-rise" : ""
                }`}
                style={step(200 + i * 90)}
              />
            ))}
          </div>
          <div
            className={`flex-1 rounded-md border border-dashed border-border bg-white/[0.02] ${
              animate ? "vg-rise" : ""
            }`}
            style={step(520)}
          />
          <div className="flex flex-col gap-1">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`h-2 rounded bg-white/[0.06] ${
                  animate ? "vg-rise" : ""
                }`}
                style={step(760 + i * 120)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 2) {
    const bars = [40, 64, 32, 76, 52, 88];
    const commits = [
      "Add quote builder",
      "Wire up PDF export",
      "Fix mobile layout",
    ];
    return (
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="Quotes" value={128} animate={animate} delay={80} />
          <StatTile
            label="Avg time"
            value={4}
            suffix="m"
            animate={animate}
            delay={170}
          />
          <StatTile
            label="Saved"
            value={9}
            prefix="+"
            suffix="h/wk"
            animate={animate}
            delay={260}
          />
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
                  ? { height: `${h}%`, animationDelay: `${300 + i * 70}ms` }
                  : { height: `${h}%` }
              }
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {commits.map((t, i) => (
            <div
              key={t}
              className={`flex items-center gap-2 ${animate ? "vg-rise" : ""}`}
              style={step(900 + i * 200)}
            >
              <Check className="h-3 w-3" />
              <span className="font-mono text-[10px] text-foreground/70">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center gap-2 text-[10px]">
        <span
          className={`h-2 w-2 rounded-full bg-[#4ade80] ${
            animate ? "vg-blink" : ""
          }`}
        />
        <span className="font-mono tracking-wide text-foreground/80">
          Live · all systems go
        </span>
        <span className="ml-auto font-mono text-muted">99.98%</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="Quotes" value={412} animate={animate} delay={80} />
        <StatTile label="This week" value={37} animate={animate} delay={170} />
        <StatTile
          label="Uptime"
          value={100}
          suffix="%"
          animate={animate}
          delay={260}
        />
      </div>
      <div className="relative h-12 flex-1 overflow-hidden rounded-md border border-border bg-white/[0.02]">
        <Sparkline animate={animate} />
        <span className="absolute right-1.5 top-1 font-mono text-[9px] text-accent">
          142ms
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-3 w-3" />
        <span className="font-mono text-[10px] text-foreground/70">
          Shipped v1.0 · handover complete
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* small self-contained mock primitives (kept local so this file has   */
/* no dependency beyond the shared vg-* keyframes in globals.css)      */
/* -------------------------------------------------------------------- */

function Frame({
  label,
  innerRef,
  children,
}: {
  label: string;
  innerRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div
      ref={innerRef}
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

function StatTile({
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

function Bubble({
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

function Check({ className = "h-3 w-3" }: { className?: string }) {
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

// A jagged line drawn at double width so scrolling it left by half loops
// seamlessly.
function Sparkline({ animate }: { animate: boolean }) {
  const seed = [22, 26, 18, 30, 24, 33, 20, 28, 25, 31, 19, 27];
  const half = seed.map((y, i) => `${(i / (seed.length - 1)) * 100},${y}`);
  const full = [
    ...half,
    ...seed.map((y, i) => `${100 + (i / (seed.length - 1)) * 100},${y}`),
  ];
  return (
    <svg
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      className="h-full w-[200%]"
      aria-hidden
    >
      <path
        className={animate ? "vg-spark" : ""}
        d={"M" + full.join(" L")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CountUp({
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
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, animate, delay]);

  return <>{animate ? n : end}</>;
}
