import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ProcessTimeline } from "@/components/process-timeline";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How we work: discovery call, plan and design, build and iterate, launch and support.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work"
        subtitle="Four steps, no surprises — you'll know what's happening at every stage."
      />

      <Container className="pb-16">
        <Reveal>
          <article className="hud card-glow relative rounded-2xl border border-border bg-surface/60 p-6 md:p-10">
            <ProcessTimeline />
          </article>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <div className="hud relative rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="display text-2xl font-semibold md:text-3xl">
            Know what you want built?
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted">
            Start with the discovery call — a free, no-obligation chat about the
            problem and whether we&apos;re the right fit.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call
          </Link>
        </div>
      </Container>
    </>
  );
}
