import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/container";

// Shared surface for content blocks across the secondary pages: a
// blurred glass panel with faint borders and the HUD corner ticks, so
// every page reads as the same system as the home scene. `interactive`
// adds the lift-and-glow hover from globals.css.
export function Panel({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`hud relative rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-md ${
        interactive ? "card-glow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Small mono label + hairline used to open a section.
export function SectionLabel({
  children,
  index,
}: {
  children: ReactNode;
  index?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow">{children}</p>
      <span aria-hidden className="h-px flex-1 bg-border" />
      {index && <span className="font-mono text-xs text-muted">{index}</span>}
    </div>
  );
}

// Reused "book a call" closing band. Copy is overridable per page so the
// detailed content can be filled in later without touching layout.
export function CtaBand({
  title = "Have a project in mind?",
  body = "Book a free discovery call and we'll tell you what's realistic — scope, timeline, and cost, before any code is written.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Container className="pb-28">
      <div className="hud relative overflow-hidden rounded-3xl border border-border-strong bg-surface-2/70 p-8 backdrop-blur-md sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 className="display mt-3 text-2xl font-semibold sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-muted">{body}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Container>
  );
}
