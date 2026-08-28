"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/container";
import { DesktopNav } from "@/components/desktop-nav";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

const VCloud = dynamic(() => import("@/components/three/v-cloud"), {
  ssr: false,
});

const pages = [
  { n: "01", label: "Services", href: "/services" },
  { n: "02", label: "Industries", href: "/industries" },
  { n: "03", label: "Process", href: "/process" },
  { n: "04", label: "Work", href: "/work" },
  { n: "05", label: "Contact", href: "/contact" },
];

const headline = "We build the software your business is missing.";
const intro =
  "A small engineering team that designs, builds, and maintains custom software and AI tools — for local businesses and technical founders alike.";

function PageLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`grid gap-x-14 gap-y-4 sm:grid-cols-2 ${className}`}>
      {pages.map((p) => (
        <Link key={p.href} href={p.href} className="group flex items-baseline gap-3">
          <span className="font-mono text-sm text-accent">{p.n}</span>
          <span className="display text-3xl font-semibold text-muted transition-colors group-hover:text-foreground sm:text-4xl">
            {p.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

function StaticHome() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <Container>
        <p className="eyebrow">VantageLabsAI</p>
        <h1 className="display mt-5 max-w-3xl text-balance text-5xl font-semibold sm:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-muted">{intro}</p>
        <PageLinks className="mt-12" />
      </Container>
    </section>
  );
}

export function HomeScene() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const runwayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phase, setPhase] = useState<"hero" | "travel" | "exploded">("hero");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const runway = runwayRef.current;
      if (!runway) return;
      const span = runway.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
      progressRef.current = p;
      setPhase(p > 0.74 ? "exploded" : p > 0.2 ? "travel" : "hero");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (reducedMotion || isSmallScreen) return <StaticHome />;

  return (
    <div ref={runwayRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <VCloud progressRef={progressRef} />
        </div>

        <Container
          className={`relative transition-all duration-500 ${
            phase === "hero"
              ? "opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <div className="ml-auto max-w-[46rem] md:w-[62%]">
            <p className="eyebrow">VantageLabsAI</p>
            <h1 className="display mt-5 text-4xl font-semibold sm:text-[2.6rem]">
              We build the software
              <br className="hidden sm:block" /> your business is missing.
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted">{intro}</p>
            <p className="eyebrow mt-10 animate-pulse">Scroll ↓</p>
          </div>
        </Container>

        <div
          style={{ paddingTop: "17vh" }}
          className={`absolute inset-0 flex items-start justify-center transition-all duration-700 ${
            phase === "exploded"
              ? "opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <DesktopNav />
        </div>
      </div>
    </div>
  );
}
