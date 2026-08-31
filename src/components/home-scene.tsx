"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/container";
import { DesktopNav } from "@/components/desktop-nav";
import { ParkourFigure } from "@/components/parkour-figure";
import type { Hit } from "@/components/three/types";
import {
  useHydrated,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/media";
import { nav } from "@/lib/site";
import { useWelcome } from "@/lib/welcome";

const VCloud = dynamic(() => import("@/components/three/v-cloud"), {
  ssr: false,
});

const headline = "We build the software your business is missing.";
const intro =
  "A small engineering team that designs, builds, and maintains custom software and AI tools for local businesses and technical founders alike.";

// Scroll-progress easing, all in 0..1 runway units.
const MAX_DT = 0.05; // clamp a long frame so a stalled tab doesn't lurch
const EASE_RATE = 5; // exponential approach toward the scroll target
const SETTLE = 0.0004; // stop the loop once progress is this close
const TRAVEL_AT = 0.14; // hero copy has cleared; the cloud is in flight
const EXPLODED_AT = 0.68; // monitor has formed; show the desktop nav

function PageLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`grid gap-x-14 gap-y-4 sm:grid-cols-2 ${className}`}>
      {nav.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-baseline gap-3"
        >
          <span className="font-mono text-sm text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="display text-3xl font-semibold text-muted transition-colors group-hover:text-foreground sm:text-4xl">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function HomeStatic() {
  return (
    <section className="home-static flex min-h-[80svh] items-center">
      <Container>
        <p className="eyebrow">VantageLabsAI</p>
        <h1 className="display mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          {intro}
        </p>
        <PageLinks className="mt-12" />
      </Container>
    </section>
  );
}

// Home hero. HomeStatic is what the server renders and what stays on any
// device that shouldn't run the 3D sequence (mobile, reduced motion, no
// JS), so a phone never ships the 260vh animated runway or a hydration
// height swap. A motion-friendly desktop swaps up to the particle cloud
// once mounted; the first-load welcome overlay covers that swap.
export function HomeHero() {
  const hydrated = useHydrated();
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return !hydrated || reducedMotion || isSmallScreen ? (
    <HomeStatic />
  ) : (
    <HomeAnimated />
  );
}

function HomeAnimated() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const welcome = useWelcome();
  const runwayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  // Written by ParkourFigure when it slams a monitor edge, read by VCloud
  // to shudder the particles at that spot. Screen px + a timestamp so the
  // shader only reacts to a fresh hit.
  const hitRef = useRef<Hit>({ x: 0, y: 0, t: 0, power: 0 });
  const [phase, setPhase] = useState<"hero" | "travel" | "exploded">("hero");

  useEffect(() => {
    // The static hero has no runway; don't watch scroll at all there.
    if (reducedMotion || isSmallScreen) return;

    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      const runway = runwayRef.current;
      if (!runway) {
        raf = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, MAX_DT) : 1 / 60;
      last = now;

      const span = runway.offsetHeight - window.innerHeight;
      // Ignore scroll until the welcome hands off, so the V forms on a
      // still page instead of one already scrolled into the sequence.
      const target =
        welcome.phase !== "done"
          ? 0
          : span > 0
            ? Math.min(1, Math.max(0, window.scrollY / span))
            : 0;

      // Ease toward the scroll position, framerate-independent, so a fast
      // fling still plays smoothly, but progress stays tied to scroll, so
      // one uninterrupted scroll runs the whole sequence to the bottom.
      const cur = progressRef.current;
      const next = cur + (target - cur) * (1 - Math.exp(-dt * EASE_RATE));
      progressRef.current = next;

      setPhase(
        next > EXPLODED_AT ? "exploded" : next > TRAVEL_AT ? "travel" : "hero",
      );

      if (Math.abs(target - next) > SETTLE) {
        raf = requestAnimationFrame(frame);
      } else {
        progressRef.current = target;
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
    // welcome.phase re-kicks the loop so it eases to a real scroll
    // position the moment the intro releases.
  }, [reducedMotion, isSmallScreen, welcome.phase]);

  if (reducedMotion || isSmallScreen) return null;

  return (
    <div ref={runwayRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <VCloud progressRef={progressRef} hitRef={hitRef} />
        </div>

        <div
          data-hero-copy
          className={`absolute inset-y-0 right-0 flex items-center pr-[max(2.5rem,3vw)] pl-8 transition-all ease-out ${
            welcome.phase === "handoff"
              ? "delay-300 duration-[900ms]"
              : "duration-300"
          } ${
            phase === "hero" &&
            (welcome.phase === "handoff" || welcome.phase === "done")
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-6 opacity-0"
          }`}
        >
          <div className="relative w-[min(41rem,44vw)] -translate-y-[3vh] pl-8 before:absolute before:-top-[14vh] before:-bottom-[14vh] before:left-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-accent/50 before:to-transparent">
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-accent/70" />
              VantageLabsAI
            </p>
            <h1 className="display mt-6 text-balance text-[2.35rem] font-bold leading-[1.04] tracking-[-0.035em] [text-shadow:0_4px_30px_rgba(6,8,16,0.7)] sm:text-[2.6rem] lg:text-[2.85rem]">
              {headline}
            </h1>
            <p className="mt-5 max-w-[42ch] text-pretty text-base leading-relaxed text-muted">
              {intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/contact"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                Book a call
              </Link>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                See our work
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
            <p className="mt-10 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-foreground/30">
              Custom software · AI automation · Ongoing support
            </p>
          </div>
        </div>

        <p
          data-hero-copy
          className="eyebrow absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-foreground/40"
        >
          Scroll
          <span aria-hidden className="animate-bounce">
            ↓
          </span>
        </p>

        {/* DesktopNav positions each row onto the particle icons it sits
            over (see desktop-layout). */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            phase === "exploded"
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <DesktopNav active={phase === "exploded"} />
          <ParkourFigure active={phase === "exploded"} hitRef={hitRef} />
        </div>
      </div>
    </div>
  );
}
