"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import type { IndustryVariant } from "@/content/industries";
import { usePrefersReducedMotion } from "@/lib/media";
import {
  Bubble,
  Check,
  CountUp,
  Sparkline,
  StatTile,
  Streamed,
  VignetteFrame,
} from "@/components/vignette-kit";

// A small animated mock of the kind of software we'd build for each
// industry — a kitchen display filling with tickets, a stock list
// catching a low run, a dispatch board with a crew on the way. DOM + SVG
// + CSS so it stays sharp at any size; keyframes live in globals.css
// under "Services vignettes" (vg-*) and "Industries" (ind-*). Under
// reduced motion every scene renders its finished state with no timers.

const CYCLE_MS = 9000;

const LABELS: Record<IndustryVariant, string> = {
  restaurants: "kitchen-display",
  retail: "stock",
  healthcare: "schedule",
  veterinary: "patient-record",
  professional: "billing",
  trades: "dispatch",
  fitness: "classes",
  nonprofits: "donations",
  startups: "deploys",
};

export function IndustryScene({ variant }: { variant: IndustryVariant }) {
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
  const Scene = SCENES[variant];

  return (
    <VignetteFrame ref={ref} label={LABELS[variant]}>
      {/* Remounting on `cycle` restarts every CSS animation inside. */}
      <div key={cycle} className="absolute inset-0">
        <Scene animate={animate} />
      </div>
    </VignetteFrame>
  );
}

type SceneProps = { animate: boolean };

const delay = (n: number, animate: boolean) =>
  animate ? { animationDelay: `${n}ms` } : undefined;

// A track with a gradient bar that wipes across to `pct` width.
function FillBar({
  pct,
  ms,
  animate,
  tone = "brand",
}: {
  pct: number;
  ms: number;
  animate: boolean;
  tone?: "brand" | "green";
}) {
  const skin =
    tone === "green"
      ? "bg-[#4ade80]/70"
      : "bg-gradient-to-r from-brand to-accent";
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded bg-white/[0.06]">
      <div
        className={`h-full rounded ${skin} ${animate ? "ind-fill" : ""}`}
        style={{ width: `${pct}%`, ...delay(ms, animate) }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* restaurants — a kitchen display filling with tickets                */
/* -------------------------------------------------------------------- */

const TICKETS = [
  { id: "#128", tag: "NEW", lines: ["w-4/5", "w-3/5", "w-2/3"] },
  { id: "#129", tag: null, lines: ["w-3/4", "w-1/2"] },
  { id: "#130", tag: null, lines: ["w-4/5", "w-3/5", "w-1/2"] },
];

function RestaurantsScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {TICKETS.map((t, i) => (
          <div
            key={t.id}
            className={`flex flex-1 flex-col justify-center rounded-md border border-border bg-white/[0.03] px-2 py-1.5 ${
              animate ? "ind-slide" : ""
            }`}
            style={delay(200 + i * 320, animate)}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-accent">{t.id}</span>
              {t.tag && (
                <span className="rounded-full border border-accent/40 px-1 text-[7px] font-medium tracking-wide text-accent">
                  {t.tag}
                </span>
              )}
              <span className="ml-auto font-mono text-[8px] text-muted">
                0:{40 + i}s
              </span>
            </div>
            {t.lines.map((w, j) => (
              <div
                key={j}
                className={`mt-1 h-1.5 ${w} rounded bg-white/[0.06]`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex w-16 shrink-0 flex-col justify-between gap-2">
        <StatTile label="Covers" value={84} animate={animate} delay={260} />
        <StatTile
          label="Wait"
          value={6}
          suffix="m"
          animate={animate}
          delay={420}
        />
        <StatTile label="Tables" value={11} animate={animate} delay={560} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* retail — a stock list catching a low run                            */
/* -------------------------------------------------------------------- */

const STOCK = [
  { name: "House blend 1kg", pct: 72, low: false },
  { name: "Oat milk 12pk", pct: 46, low: false },
  { name: "Takeaway cups", pct: 14, low: true },
  { name: "Loyalty cards", pct: 88, low: false },
];

function RetailScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-mono tracking-wide text-foreground/80">
          Inventory
        </span>
        <span className="font-mono text-muted">
          <CountUp end={342} animate={animate} delay={200} /> SKUs
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-around">
        {STOCK.map((s, i) => (
          <div
            key={s.name}
            className={`flex items-center gap-2 ${animate ? "vg-rise" : ""}`}
            style={delay(240 + i * 150, animate)}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                s.low
                  ? `bg-danger ${animate ? "vg-blink" : ""}`
                  : "bg-accent/50"
              }`}
            />
            <span className="w-24 shrink-0 truncate font-mono text-[9px] text-foreground/70">
              {s.name}
            </span>
            <FillBar
              pct={s.pct}
              ms={360 + i * 150}
              animate={animate}
              tone={s.low ? "green" : "brand"}
            />
            {s.low && (
              <span className="shrink-0 rounded-full border border-danger/40 px-1 text-[7px] font-medium text-danger">
                Low
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        className={`flex items-center gap-1.5 border-t border-border pt-2 text-[9px] ${
          animate ? "vg-rise" : ""
        }`}
        style={delay(900, animate)}
      >
        <Check className="h-2.5 w-2.5" />
        <span className="font-mono text-foreground/70">
          Reorder drafted — 1 item low
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* healthcare — a day's schedule filling, intake collected up front    */
/* -------------------------------------------------------------------- */

const SLOTS = [
  { t: "09:00", booked: true },
  { t: "09:30", booked: true },
  { t: "10:00", booked: false },
  { t: "10:30", booked: true },
  { t: "11:00", booked: true },
  { t: "11:30", booked: true },
];
const INTAKE = ["ID & insurance", "History form", "Consent signed"];

function HealthcareScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="flex w-24 shrink-0 flex-col justify-between gap-1">
        {SLOTS.map((s, i) => (
          <div
            key={s.t}
            className={`flex flex-1 items-center gap-1.5 rounded-md border px-2 text-[9px] ${
              s.booked
                ? "border-accent/30 bg-accent/[0.12] text-accent"
                : "border-border text-muted"
            } ${animate ? "vg-rise" : ""}`}
            style={delay(200 + i * 150, animate)}
          >
            <span className="font-mono">{s.t}</span>
            {s.booked && <Check className="ml-auto h-2.5 w-2.5" />}
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
          Intake — J. Rivera
        </span>
        <div className="flex flex-1 flex-col justify-around">
          {INTAKE.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 text-[9px] text-foreground/70 ${
                animate ? "vg-rise" : ""
              }`}
              style={delay(500 + i * 260, animate)}
            >
              <Check className="h-2.5 w-2.5" />
              <span className="font-mono">{label}</span>
            </div>
          ))}
        </div>
        <div
          className={`rounded-md border border-border bg-white/[0.03] px-2 py-2 text-[9px] text-muted ${
            animate ? "vg-rise" : ""
          }`}
          style={delay(1400, animate)}
        >
          No-shows{" "}
          <span className="font-mono text-accent">
            −<CountUp end={38} animate={animate} delay={1600} />%
          </span>{" "}
          since reminders
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* veterinary — one record, and an owner who confirms                  */
/* -------------------------------------------------------------------- */

const VET_SMS = "Bella's checkup is tomorrow at 10:00 — reply Y to confirm.";
const VET_VITALS = [
  ["Weight", "28.4 kg"],
  ["Last visit", "Mar 2"],
  ["Vaccines", "Up to date"],
];

function VeterinaryScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div
        className={`flex flex-col rounded-md border border-border bg-white/[0.03] p-2 ${
          animate ? "vg-rise" : ""
        }`}
        style={delay(200, animate)}
      >
        <div className="flex items-center justify-between text-[9px]">
          <span className="font-mono text-foreground/80">Bella · Labrador</span>
          <span className="font-mono text-muted">4 yrs</span>
        </div>
        <div className="mt-1.5 h-11 overflow-hidden rounded border border-border bg-white/[0.02]">
          <Sparkline
            animate={animate}
            seed={[24, 20, 27, 19, 26, 22, 29, 21, 25, 18, 28, 23]}
          />
        </div>
        <div className="mt-1.5 flex flex-col gap-1">
          {VET_VITALS.map(([k, v], i) => (
            <div
              key={k}
              className={`flex justify-between text-[9px] ${
                animate ? "vg-rise" : ""
              }`}
              style={delay(400 + i * 140, animate)}
            >
              <span className="font-mono text-muted">{k}</span>
              <span className="font-mono text-foreground/70">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-1.5 text-[10px] leading-snug">
        <Bubble side="start" animate={animate} delay={900}>
          Reminder queued
        </Bubble>
        <Bubble side="end" animate={animate} delay={1200}>
          <span className="mr-1 text-accent/90">✦</span>
          <Streamed
            text={VET_SMS}
            animate={animate}
            startAfter={1500}
            perWord={70}
          />
        </Bubble>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* professional — enquiry to paid invoice                              */
/* -------------------------------------------------------------------- */

const INVOICES = [
  { id: "INV-0041", amt: "$2,400", paid: true },
  { id: "INV-0042", amt: "$980", paid: false },
  { id: "INV-0043", amt: "$3,150", paid: false },
];

function ProfessionalScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="relative flex flex-1 flex-col justify-around gap-1.5">
        {INVOICES.map((inv, i) => (
          <div
            key={inv.id}
            className={`flex items-center gap-2 rounded-md border border-border bg-white/[0.03] px-2 py-1.5 text-[9px] ${
              animate ? "vg-rise" : ""
            }`}
            style={delay(220 + i * 180, animate)}
          >
            <span className="font-mono text-foreground/70">{inv.id}</span>
            <span className="ml-auto font-mono text-foreground/80">
              {inv.amt}
            </span>
            <span
              className={`rounded-full border px-1 text-[7px] font-medium ${
                inv.paid
                  ? "border-[#4ade80]/40 text-[#4ade80]"
                  : "border-border-strong text-muted"
              }`}
            >
              {inv.paid ? "Paid" : "Sent"}
            </span>
          </div>
        ))}
        {animate && (
          <span className="ind-stamp pointer-events-none absolute right-8 top-0 rounded border border-[#4ade80]/60 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#4ade80]">
            PAID
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 text-[9px]">
        <span className="font-mono text-muted">Discovery</span>
        <FillBar pct={68} ms={900} animate={animate} />
        <span className="font-mono text-accent">
          <CountUp end={68} animate={animate} delay={1100} />%
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* trades — the right crew, on the way                                 */
/* -------------------------------------------------------------------- */

const JOBS = [
  { id: "J-241", eta: 12 },
  { id: "J-242", eta: 25 },
  { id: "J-243", eta: 40 },
];

function TradesScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full gap-2 p-3">
      <div className="relative w-20 shrink-0 overflow-hidden rounded-md border border-border bg-white/[0.02]">
        <span className="absolute left-1/2 top-1/3 h-px w-full -translate-x-1/2 bg-white/[0.06]" />
        <span className="absolute left-2/3 top-1/2 h-full w-px -translate-y-1/2 bg-white/[0.06]" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        {animate && (
          <span className="ind-ping absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 text-[10px]">
        {JOBS.map((j, i) => (
          <div
            key={j.id}
            className={`flex items-center gap-2 rounded-md border border-border bg-white/[0.03] px-2 py-1.5 ${
              animate ? "vg-rise" : ""
            }`}
            style={delay(220 + i * 200, animate)}
          >
            <span className="font-mono text-foreground/70">{j.id}</span>
            <span className="ml-auto font-mono text-muted">ETA</span>
            <span className="font-mono text-accent">
              <CountUp end={j.eta} animate={animate} delay={400 + i * 200} />m
            </span>
          </div>
        ))}
        <div
          className={`mt-auto flex items-center gap-1.5 text-[9px] ${
            animate ? "vg-rise" : ""
          }`}
          style={delay(1000, animate)}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full bg-[#4ade80] ${
              animate ? "vg-blink" : ""
            }`}
          />
          <span className="font-mono text-foreground/70">
            Crew 2 — on the way
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* fitness — full classes, memberships on autopilot                    */
/* -------------------------------------------------------------------- */

const GRID = Array.from({ length: 20 }, (_, i) => i);
const BOOKED = new Set([1, 2, 5, 7, 8, 11, 13, 14, 16, 17, 18]);

function FitnessScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex gap-2">
        <StatTile label="Members" value={512} animate={animate} delay={220} />
        <StatTile label="Check-ins" value={78} animate={animate} delay={360} />
      </div>

      <div className="grid flex-1 grid-cols-5 gap-1">
        {GRID.map((i) => (
          <div
            key={i}
            className={`rounded-sm border ${
              BOOKED.has(i)
                ? "border-accent/30 bg-accent/[0.14]"
                : "border-border bg-white/[0.02]"
            } ${animate && BOOKED.has(i) ? "vg-rise" : ""}`}
            style={delay(300 + i * 45, animate)}
          />
        ))}
      </div>

      <div
        className={`flex items-center gap-1.5 text-[9px] ${
          animate ? "vg-rise" : ""
        }`}
        style={delay(1300, animate)}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full bg-accent ${
            animate ? "vg-blink" : ""
          }`}
        />
        <span className="font-mono text-foreground/70">
          Spin 6pm — full, 3 on waitlist
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* nonprofits — more raised, less overhead                             */
/* -------------------------------------------------------------------- */

const DONORS = [
  "Anonymous · $50",
  "R. Okafor · $250",
  "Monthly gift · $20",
  "T. Whitfield · $500",
];

function NonprofitsScene({ animate }: SceneProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div
        className={`flex items-baseline gap-1 ${animate ? "vg-rise" : ""}`}
        style={delay(200, animate)}
      >
        <span className="font-mono text-lg text-foreground">
          $<CountUp end={24} animate={animate} delay={300} />k
        </span>
        <span className="font-mono text-[9px] text-muted">of $40k goal</span>
      </div>

      <div className="flex items-center gap-2">
        <FillBar pct={60} ms={400} animate={animate} tone="green" />
        <span className="font-mono text-[9px] text-[#4ade80]">60%</span>
      </div>

      <div className="mt-1 flex flex-1 flex-col gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
          Recent gifts
        </span>
        <div className="flex flex-1 flex-col justify-around">
          {DONORS.map((d, i) => (
            <div
              key={d}
              className={`flex items-center gap-2 text-[9px] ${
                animate ? "vg-rise" : ""
              }`}
              style={delay(600 + i * 220, animate)}
            >
              <Check className="h-2.5 w-2.5" />
              <span className="font-mono text-foreground/70">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* startups — commits in, usage up, shipped                            */
/* -------------------------------------------------------------------- */

const COMMITS = [
  "feat: checkout flow",
  "fix: auth redirect",
  "chore: seed data",
];
const USAGE = [30, 44, 38, 60, 52, 76, 68];

function StartupsScene({ animate }: SceneProps) {
  return (
    <div className="relative flex h-full flex-col gap-2 p-3">
      <div className="flex flex-col gap-1">
        {COMMITS.map((c, i) => (
          <div
            key={c}
            className={`flex items-center gap-1.5 text-[9px] ${
              animate ? "vg-rise" : ""
            }`}
            style={delay(200 + i * 180, animate)}
          >
            <span className="font-mono text-accent">→</span>
            <span className="font-mono text-foreground/70">{c}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-end gap-1.5">
        {USAGE.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm bg-gradient-to-t from-brand to-accent ${
              animate ? "vg-bar" : ""
            }`}
            style={{ height: `${h}%`, ...delay(700 + i * 70, animate) }}
          />
        ))}
      </div>

      {animate && (
        <div
          className="vg-rise absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-[#4ade80]/40 bg-surface-2 px-1.5 py-1 text-[9px] text-[#4ade80]"
          style={{ animationDelay: "1500ms" }}
        >
          <Check className="h-2.5 w-2.5" />
          <span className="font-mono">Shipped v1.4</span>
        </div>
      )}
    </div>
  );
}

const SCENES: Record<IndustryVariant, (props: SceneProps) => ReactElement> = {
  restaurants: RestaurantsScene,
  retail: RetailScene,
  healthcare: HealthcareScene,
  veterinary: VeterinaryScene,
  professional: ProfessionalScene,
  trades: TradesScene,
  fitness: FitnessScene,
  nonprofits: NonprofitsScene,
  startups: StartupsScene,
};
