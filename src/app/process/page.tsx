import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { processSteps } from "@/content/process";

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

      <Container className="space-y-8 pb-24">
        {processSteps.map((step) => (
          <div
            key={step.step}
            className="flex gap-6 border-b border-border pb-8 last:border-0"
          >
            <div className="text-2xl font-semibold text-accent">
              {String(step.step).padStart(2, "0")}
            </div>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
