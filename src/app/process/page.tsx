import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand, Panel } from "@/components/ui";
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
        index="03 / 05"
        title="How we work"
        subtitle="Four steps, no surprises — you'll know what's happening at every stage."
      />

      <Container className="pb-28">
        <ol className="space-y-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 80}>
              <li className="grid grid-cols-[2.5rem_1fr] gap-5 sm:gap-8">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-2 font-mono text-xs text-accent">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  {i < processSteps.length - 1 && (
                    <span aria-hidden className="mt-2 w-px flex-1 bg-border" />
                  )}
                </div>
                <Panel className="mb-2">
                  <h2 className="display text-xl font-semibold">{step.title}</h2>
                  <p className="mt-3 text-muted">{step.description}</p>
                </Panel>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>

      <CtaBand
        title="Ready for step one?"
        body="The discovery call is free and there's no obligation. Worst case, you leave with a clearer picture of what's slowing your business down."
      />
    </>
  );
}
