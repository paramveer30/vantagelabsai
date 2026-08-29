import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand, Panel } from "@/components/ui";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies from VantageLabsAI.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        index="04 / 05"
        title="Selected projects"
        subtitle="Detailed case studies are in progress. Here's a look at what we've been building."
      />

      <Container className="pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-accent">
                    {study.industry}
                  </span>
                  {study.status === "coming-soon" ? (
                    <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                      Case study coming soon
                    </span>
                  ) : (
                    <span aria-hidden className="text-muted">
                      →
                    </span>
                  )}
                </div>
                <h2 className="display mt-4 text-lg font-semibold">
                  {study.client}
                </h2>
                <p className="mt-2 text-sm text-muted">{study.summary}</p>
              </>
            );

            return (
              <Reveal key={study.slug} delay={i * 80}>
                {study.status === "published" ? (
                  <Link href={`/work/${study.slug}`} className="block h-full">
                    <Panel interactive className="h-full">
                      {inner}
                    </Panel>
                  </Link>
                ) : (
                  <Panel className="h-full">{inner}</Panel>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>

      <CtaBand
        title="Want to see something specific?"
        body="We can walk you through relevant past work — architecture, trade-offs, and what shipped — on a call."
      />
    </>
  );
}
