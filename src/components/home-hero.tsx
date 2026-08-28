"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { HeroVisual } from "@/components/hero-visual";
import { services } from "@/content/services";

export function HomeHero() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  return (
    <>
      <section className="relative min-h-[86vh] overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <HeroVisual />
        </div>

        <Container className="relative z-10 flex min-h-[86vh] items-center">
          <div className="max-w-xl md:ml-[48%]">
            <p className="eyebrow text-accent">VantageLabsAI</p>
            <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">
              We build the software your business is missing.
            </h1>
            <p className="mt-5 text-lg text-muted">
              A small engineering team that designs, builds, and maintains
              custom software and AI tools — for local businesses and technical
              founders alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={toggle}
                className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-all hover:bg-brand-hover hover:shadow-[0_0_40px_-8px_rgba(58,208,255,0.55)]"
              >
                {open ? "Hide details" : "Get started"}
              </button>
              <Link
                href="/contact"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface"
              >
                Book a call
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section
        ref={panelRef}
        className={`overflow-hidden border-b border-border transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="py-20">
          <p className="eyebrow text-accent">What we do</p>
          <h2 className="display mt-3 text-3xl font-semibold">
            Three ways we help
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="card-glow rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-accent">{service.summary}</p>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-8 inline-block text-sm text-accent hover:underline"
          >
            Full breakdown of our services →
          </Link>
        </Container>
      </section>
    </>
  );
}
